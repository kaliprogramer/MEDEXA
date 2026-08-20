from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Patient

        fields = [
            "id",
            "patient_id",

            "hospital",

            "first_name",
            "last_name",
            "date_of_birth",
            "gender",
            "blood_group",

            "phone",
            "email",
            "address",
            "emergency_contact",

            "allergies",
            "medical_history",
            "current_medications",
            "notes",
            "status",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "patient_id",
            "doctor",
            "created_at",
            "updated_at",
        ]

    def get_doctor_name(self, obj):
        return obj.doctor.username

    