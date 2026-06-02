from rest_framework import serializers
from .models import Nomination

class NominationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nomination
        fields = [
            'id', 'form_id', 'head_name', 'head_contact', 'address', 
            'institution_type', 'answers', 'score', 'award_category', 
            'is_submitted', 'created_at', 'updated_at', 'submitted_at'
        ]
        read_only_fields = ['id', 'score', 'award_category', 'is_submitted', 'created_at', 'updated_at', 'submitted_at']
