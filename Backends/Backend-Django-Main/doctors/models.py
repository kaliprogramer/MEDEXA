from django.db import models
from django.conf import settings


class Doctor(models.Model):

    GENDER_CHOICES = [
        ("MALE", "Male"),
        ("FEMALE", "Female"),
        ("OTHER", "Other"),
    ]

    SPECIALIZATION_CHOICES = [
        ("GENERAL", "General Physician"),
        ("CARDIOLOGIST", "Cardiologist"),
        ("NEUROLOGIST", "Neurologist"),
        ("DERMATOLOGIST", "Dermatologist"),
        ("ONCOLOGIST", "Oncologist"),
        ("ORTHOPEDIC", "Orthopedic"),
        ("PEDIATRICIAN", "Pediatrician"),
        ("PSYCHIATRIST", "Psychiatrist"),
        ("RADIOLOGIST", "Radiologist"),
        ("PULMONOLOGIST", "Pulmonologist"),
        ("OTHER", "Other"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="doctor_profile"
    )

    profile_image = models.ImageField(
        upload_to="doctors/",
        blank=True,
        null=True
    )

    full_name = models.CharField(max_length=150)

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True,
        null=True
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True
    )

    specialization = models.CharField(
        max_length=50,
        choices=SPECIALIZATION_CHOICES
    )

    qualification = models.CharField(
        max_length=255,
        blank=True
    )

    medical_license_number = models.CharField(
        max_length=100,
        unique=True
    )

    years_of_experience = models.PositiveIntegerField(
        default=0
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True
    )

    hospital_name = models.CharField(
        max_length=255,
        blank=True
    )

    address = models.TextField(
        blank=True
    )

    bio = models.TextField(
        blank=True
    )

    is_verified = models.BooleanField(
        default=False
    )

    is_available = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.full_name