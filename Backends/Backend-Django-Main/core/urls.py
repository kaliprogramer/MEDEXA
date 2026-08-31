from django.contrib import admin
from django.urls import path,include
from core import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path('api/auth/', include('authentication.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/doctors/', include('doctors.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/fastapi/', include('fastapiconnection.urls')),
    path('api/report/',include('report.urls')),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )