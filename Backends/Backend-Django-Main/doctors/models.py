from django.db import models
from django.conf import settings
import uuid


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

    DEPARTMENT_CHOICES = [
        ("GENERAL_MEDICINE", "General Medicine"),
        ("CARDIOLOGY", "Cardiology"),
        ("NEUROLOGY", "Neurology"),
        ("DERMATOLOGY", "Dermatology"),
        ("ONCOLOGY", "Oncology"),
        ("ORTHOPEDICS", "Orthopedics"),
        ("PEDIATRICS", "Pediatrics"),
        ("PSYCHIATRY", "Psychiatry"),
        ("RADIOLOGY", "Radiology"),
        ("PULMONOLOGY", "Pulmonology"),
        ("EMERGENCY", "Emergency"),
        ("OTHER", "Other"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]

    # ============================================================
    # PERSONAL INFORMATION
    # ============================================================

    first_name = models.CharField(
        max_length=100
    )

    last_name = models.CharField(
        max_length=100
    )
    image = models.ImageField(
        upload_to="doctor_images/",
        blank=True,
        null=True
    )
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

    # ============================================================
    # PROFESSIONAL INFORMATION
    # ============================================================

    specialization = models.CharField(
        max_length=50,
        choices=SPECIALIZATION_CHOICES
    )

    department = models.CharField(
        max_length=50,
        choices=DEPARTMENT_CHOICES
    )

    qualification = models.CharField(
        max_length=255,
        blank=True
    )

    license_number = models.CharField(
        max_length=100,
        unique=True
    )

    experience_years = models.PositiveIntegerField(
        default=0
    )

    # ============================================================
    # CONTACT INFORMATION
    # ============================================================

    phone = models.CharField(
        max_length=20,
        blank=True
    )

    email = models.EmailField(
        blank=True
    )

    address = models.TextField(
        blank=True
    )

    # ============================================================
    # WORK INFORMATION
    # ============================================================

    joining_date = models.DateField(
        blank=True,
        null=True
    )

    consultation_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )

    # ============================================================
    # AVAILABILITY
    # ============================================================

    available_days = models.CharField(
        max_length=255,
        blank=True
    )

    available_from = models.TimeField(
        blank=True,
        null=True
    )

    available_to = models.TimeField(
        blank=True,
        null=True
    )

    # ============================================================
    # STATUS
    # ============================================================

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Active"
    )

    # ============================================================
    # ADDITIONAL INFORMATION
    # ============================================================

    bio = models.TextField(
        blank=True
    )

    notes = models.TextField(
        blank=True
    )

    # ============================================================
    # TIMESTAMPS
    # ============================================================

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )
    hospital = models.ForeignKey(
            settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE,
            related_name="doctor",
            null=True,
            blank=True
        )

    # ============================================================
    # STRING REPRESENTATION
    # ============================================================

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()