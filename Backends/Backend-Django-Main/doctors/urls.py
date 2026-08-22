from django.urls import path
from .views import DoctorViewSet
import rest_framework.routers as routers

router = routers.DefaultRouter()
router.register(r'', DoctorViewSet, basename='doctor')

urlpatterns = router.urls