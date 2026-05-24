from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import NominationHeader, IndicatorEntry
from .serializers import NominationHeaderSerializer, IndicatorEntrySerializer

class NominationHeaderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        header = NominationHeader.objects.filter(user=request.user).first()
        if not header:
            return Response({'detail': 'No nomination header found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = NominationHeaderSerializer(header)
        return Response(serializer.data, status=status.HTTP_200_OK)

class NominationHeaderOpenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        college_name = request.user.college.name if request.user.college else 'Govt College Example'
        aishe_code = request.user.college.aishe_code if request.user.college else 'C-12345'
        
        header, created = NominationHeader.objects.get_or_create(
            user=request.user,
            defaults={
                'institution_name': college_name,
                'aishe_code': aishe_code,
                'institution_type': 'college',
                'head_name': request.user.full_name,
                'head_contact': request.user.email,
                'hei_address': 'Address details pending...',
                'academic_session': '2024-25'
            }
        )
        serializer = NominationHeaderSerializer(header)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class NominationHeaderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, form_id):
        try:
            header = NominationHeader.objects.get(form_id=form_id, user=request.user)
        except NominationHeader.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = NominationHeaderSerializer(header)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, form_id):
        try:
            header = NominationHeader.objects.get(form_id=form_id, user=request.user)
        except NominationHeader.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if header.is_submitted:
            return Response({'detail': 'This form has been submitted and cannot be modified.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = NominationHeaderSerializer(header, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IndicatorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, form_id):
        try:
            header = NominationHeader.objects.get(form_id=form_id, user=request.user)
        except NominationHeader.DoesNotExist:
            return Response({'detail': 'Nomination form not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Ensure exactly 20 indicators exist for this nomination header
        indicators = list(header.indicators.all())
        if len(indicators) < 20:
            existing_nums = {ind.indicator_number for ind in indicators}
            new_entries = []
            for num in range(1, 21):
                if num not in existing_nums:
                    new_entries.append(IndicatorEntry(nomination_header=header, indicator_number=num))
            if new_entries:
                IndicatorEntry.objects.bulk_create(new_entries)
                indicators = list(header.indicators.all())

        serializer = IndicatorEntrySerializer(indicators, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class IndicatorFileUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, form_id, indicator_num):
        try:
            header = NominationHeader.objects.get(form_id=form_id, user=request.user)
        except NominationHeader.DoesNotExist:
            return Response({'detail': 'Nomination form not found.'}, status=status.HTTP_404_NOT_FOUND)

        if header.is_submitted:
            return Response({'detail': 'This form has been submitted and cannot be modified.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            entry = IndicatorEntry.objects.get(nomination_header=header, indicator_number=indicator_num)
        except IndicatorEntry.DoesNotExist:
            return Response({'detail': 'Indicator not found.'}, status=status.HTTP_404_NOT_FOUND)

        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'detail': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        if file_obj.size > 5 * 1024 * 1024:
            return Response({'detail': 'File size exceeds maximum limit of 5MB.'}, status=status.HTTP_400_BAD_REQUEST)

        entry.uploaded_file = file_obj
        entry.save()

        file_url = request.build_absolute_uri(entry.uploaded_file.url)
        entry.uploaded_file_url = file_url
        entry.save()

        return Response({
            'indicator_number': entry.indicator_number,
            'uploaded_file_name': entry.uploaded_file.name.split('/')[-1],
            'uploaded_file_url': entry.uploaded_file_url
        }, status=status.HTTP_200_OK)

class IndicatorBulkSaveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, form_id):
        try:
            header = NominationHeader.objects.get(form_id=form_id, user=request.user)
        except NominationHeader.DoesNotExist:
            return Response({'detail': 'Nomination form not found.'}, status=status.HTTP_404_NOT_FOUND)

        if header.is_submitted:
            return Response({'detail': 'This form has been submitted and cannot be modified.'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data
        if not isinstance(data, list):
            return Response({'detail': 'Expected list of indicator entries.'}, status=status.HTTP_400_BAD_REQUEST)

        updated_entries = []
        for item in data:
            num = item.get('indicator_number')
            if not num:
                continue
            try:
                entry = IndicatorEntry.objects.get(nomination_header=header, indicator_number=num)
                entry.status = item.get('status', False)
                entry.data_ref_value = item.get('data_ref_value', '')
                entry.document_name = item.get('document_name', '')
                
                page_no = item.get('page_number')
                if page_no is not None and page_no != '':
                    entry.page_number = int(page_no)
                else:
                    entry.page_number = None

                entry.save()
                updated_entries.append(entry)
            except (IndicatorEntry.DoesNotExist, ValueError):
                pass

        serializer = IndicatorEntrySerializer(updated_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
