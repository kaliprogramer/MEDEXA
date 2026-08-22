from django.contrib import admin
from .models import Doctor
# Register your models here.
admin.site.site_header = "MEDEXA Admin"
admin.site.site_title = "MEDEXA Admin Portal"
admin.site.index_title = "Welcome to MEDEXA Admin Portal"
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'specialization', 'gender', 'date_of_birth', 'qualification')
    