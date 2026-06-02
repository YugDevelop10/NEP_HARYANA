from django.db import models
from apps.authentication.models import College

class Nomination(models.Model):
    form_id = models.CharField(max_length=100)
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='nominations')
    
    # Section 1: Basic Info
    head_name = models.CharField(max_length=255, blank=True, null=True)
    head_contact = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    institution_type = models.CharField(max_length=100, blank=True, null=True)
    
    # Section 2: Indicators data
    answers = models.JSONField(default=dict, blank=True)
    
    # Scores
    score = models.IntegerField(default=0)
    award_category = models.CharField(max_length=50, default="No Award")
    
    # Status
    is_submitted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('form_id', 'college')

    def __str__(self):
        return f"Nomination({self.form_id} - {self.college.name})"
