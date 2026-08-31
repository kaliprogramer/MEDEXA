from django.contrib import admin

from .models import Patient,MonthlyPatientAnalytics
# Register your models here.
admin.site.register(Patient)
admin.site.register(MonthlyPatientAnalytics)