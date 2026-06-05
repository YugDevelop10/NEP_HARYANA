from rest_framework import serializers
from .models import Nomination, ClarificationRequest

class ClarificationRequestSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.CharField(source='requested_by.full_name', read_only=True)

    class Meta:
        model = ClarificationRequest
        fields = [
            'id', 'nomination', 'requested_by', 'requested_by_name', 
            'query', 'fields_to_edit', 'response', 'responded_at', 
            'status', 'created_at'
        ]
        read_only_fields = ['id', 'requested_by', 'requested_by_name', 'created_at', 'responded_at']

class NominationSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.name', read_only=True)
    aishe_code = serializers.CharField(source='college.aishe_code', read_only=True)

    class Meta:
        model = Nomination
        fields = [
            'id', 'form_id', 'college_name', 'aishe_code', 'head_name', 'head_contact', 'address', 
            'institution_type', 'answers', 'score', 'award_category', 
            'is_submitted', 'status', 'remarks', 'history', 'reviewer_scores',
            'created_at', 'updated_at', 'submitted_at'
        ]
        read_only_fields = ['id', 'score', 'award_category', 'is_submitted', 'created_at', 'updated_at', 'submitted_at']

