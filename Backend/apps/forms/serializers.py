from rest_framework import serializers
from .models import NominationHeader

class NominationHeaderSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='form_id', read_only=True)

    class Meta:
        model = NominationHeader
        fields = [
            'id', 
            'institution_name', 
            'aishe_code', 
            'institution_type',
            'establishment_year',
            'affiliating_university',
            'head_name', 
            'head_contact', 
            'institution_email',
            'institution_phone',
            'hei_address', 
            'website_url',
            'nodal_name',
            'nodal_contact',
            'nodal_email',
            'ugc_status',
            'accreditation_status',
            'naac_grade',
            'naac_cgpa',
            'total_students',
            'total_faculty',
            'academic_session', 
            'is_submitted',
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'academic_session', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['user'] = request.user
        return super().create(validated_data)

from .models import IndicatorEntry

class IndicatorEntrySerializer(serializers.ModelSerializer):
    uploaded_file_name = serializers.SerializerMethodField()

    class Meta:
        model = IndicatorEntry
        fields = [
            'indicator_number', 
            'status', 
            'data_ref_value', 
            'document_name', 
            'page_number', 
            'uploaded_file',
            'uploaded_file_name',
            'uploaded_file_url'
        ]
        read_only_fields = ['indicator_number', 'uploaded_file', 'uploaded_file_url']

    def get_uploaded_file_name(self, obj):
        return obj.uploaded_file.name.split('/')[-1] if obj.uploaded_file else ''
