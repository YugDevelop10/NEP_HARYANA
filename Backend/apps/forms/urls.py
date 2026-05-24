from django.urls import path
from .views import (
    NominationHeaderView,
    NominationHeaderOpenView,
    NominationHeaderDetailView,
    IndicatorListView,
    IndicatorFileUploadView,
    IndicatorBulkSaveView
)

urlpatterns = [
    path('nomination-header/', NominationHeaderView.as_view(), name='nomination-header-get'),
    path('nomination-header/open/', NominationHeaderOpenView.as_view(), name='nomination-header-open'),
    path('nomination-header/<str:form_id>/', NominationHeaderDetailView.as_view(), name='nomination-header-detail'),
    path('nomination-header/<str:form_id>/indicators/', IndicatorListView.as_view(), name='indicator-list'),
    path('nomination-header/<str:form_id>/indicators/<int:indicator_num>/upload/', IndicatorFileUploadView.as_view(), name='indicator-upload'),
    path('nomination-header/<str:form_id>/indicators/save/', IndicatorBulkSaveView.as_view(), name='indicator-save'),
]
