from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings


class Patient(models.Model):

    GENDER_CHOICES = [
        ("MALE", "Male"),
        ("FEMALE", "Female"),
        ("OTHER", "Other"),
    ]

    BLOOD_GROUP_CHOICES = [
        ("A+", "A+"),
        ("A-", "A-"),
        ("B+", "B+"),
        ("B-", "B-"),
        ("AB+", "AB+"),
        ("AB-", "AB-"),
        ("O+", "O+"),
        ("O-", "O-"),
    ]

    # Automatically generated patient ID
    patient_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )

    # Doctor responsible for this patient
    hospital = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="patient",
        null=True,
        blank=True
    )

    # Personal information
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    date_of_birth = models.DateField(
        null=True,
        blank=True
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )
    status = models.CharField(
        max_length=20,
        default="Active",
        choices=[
            ("Active", "Active"),
            ("Inactive", "Inactive"),
        ]
    )

    blood_group = models.CharField(
        max_length=5,
        choices=BLOOD_GROUP_CHOICES,
        blank=True,
        null=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    address = models.TextField(
        blank=True,
        null=True
    )

    emergency_contact = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    # Medical information
    allergies = models.TextField(
        blank=True,
        null=True
    )

    medical_history = models.TextField(
        blank=True,
        null=True
    )

    current_medications = models.TextField(
        blank=True,
        null=True
    )

    notes = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.patient_id:
            import uuid
            self.patient_id = f"PAT-{uuid.uuid4().hex[:8].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient_id} - {self.first_name} {self.last_name}"


class MonthlyPatientAnalytics(models.Model):
    hospital = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    month = models.DateField()
    patients = models.IntegerField(default=0)
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["hospital", "month"],
                name="unique_organization_month"
            )
        ]