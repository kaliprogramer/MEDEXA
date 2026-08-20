from django.urls import path
from .views import PatientViewSet
import rest_framework.routers as routers

router = routers.DefaultRouter()
router.register(r'', PatientViewSet, basename='patient')

urlpatterns = router.urls