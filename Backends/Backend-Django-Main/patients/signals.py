# signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Patient, MonthlyPatientAnalytics


@receiver(post_save, sender=Patient)
def update_monthly_patient_analytics(sender, instance, created, **kwargs):

    if not created:
        return

    today = timezone.localdate()

    month = today.replace(day=1)

    analytics, _ = MonthlyPatientAnalytics.objects.get_or_create(
        hospital=instance.hospital,
        month=month,
    )

    analytics.patients += 1
    analytics.save()