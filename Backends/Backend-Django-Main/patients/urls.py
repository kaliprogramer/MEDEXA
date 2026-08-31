from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import PatientViewSet, MonthlyPatientAnalyticsView,PatientGenderAnalyticsView,RecentPatients

router = DefaultRouter()

router.register(r'', PatientViewSet, basename='patient')


urlpatterns = [
    path(
        'monthlyanalytic/',
        MonthlyPatientAnalyticsView.as_view(),
        name='monthly-analytic'
    ),
    path('genderanalytic/',PatientGenderAnalyticsView.as_view(),name='gender-analytic'),
    path('recentpatients/',RecentPatients.as_view(),name='recentpatients')
]

urlpatterns += router.urls