from .models import Report
from .serializers import ReportSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from authentication.views import CookieJWTAuthentication

# Create your views here.

class ReportViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes =[CookieJWTAuthentication]
    queryset = Report.objects.all().order_by('-created_at')
    serializer_class=ReportSerializer
    def perform_create(self, serializer):
            serializer.save(
                hospital=self.request.user
            )