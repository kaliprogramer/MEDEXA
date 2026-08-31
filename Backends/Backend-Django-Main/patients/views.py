from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from authentication.views import CookieJWTAuthentication
from .models import Patient
from .serializer import PatientSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count
from .models import MonthlyPatientAnalytics

class PatientGenderAnalyticsView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        gender_counts = (
            Patient.objects
            .filter(hospital=request.user)
            .values("gender")
            .annotate(value=Count("id"))
        )

        counts = {
            item["gender"]: item["value"]
            for item in gender_counts
        }

        data = [
            {
                "name": "Male",
                "value": counts.get("MALE", 0)
            },
            {
                "name": "Female",
                "value": counts.get("FEMALE", 0)
            },
            {
                "name": "Other",
                "value": counts.get("OTHER", 0)
            },
        ]

        return Response(data)

class MonthlyPatientAnalyticsView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):

        year = timezone.localdate().year

        analytics = MonthlyPatientAnalytics.objects.filter(
            hospital=request.user,
            month__year=year
        )

        data = {
            item.month.month: item.patients
            for item in analytics
        }

        months = [
            "Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug",
            "Sep", "Oct", "Nov", "Dec"
        ]

        result = [
            {
                "month": months[i - 1],
                "patients": data.get(i, 0)
            }
            for i in range(1, 13)
        ]

        return Response(result)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Patient.objects.filter(
            hospital=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(
            hospital=self.request.user
        )




from datetime import date

class RecentPatients(APIView):
    authentication_classes = [CookieJWTAuthentication] 
    permission_classes = [IsAuthenticated]

    def get(self, request):

        recentpatients = (
            Patient.objects
            .filter(hospital=request.user)
            .values(
                "id",
                "first_name",
                "last_name",
                "gender",
                "date_of_birth",
                "phone",
            )
            .order_by("-created_at")[:4]
        )

        data = []

        for item in recentpatients:

            age = None

            if item["date_of_birth"]:
                today = date.today()
                dob = item["date_of_birth"]

                age = (
                    today.year
                    - dob.year
                    - ((today.month, today.day) < (dob.month, dob.day))
                )

            data.append({
                "id": item["id"],
                "name": f'{item["first_name"]} {item["last_name"]}',
                "gender": item["gender"],
                "age": age,
                "phone": item["phone"],
            })

        return Response(data)