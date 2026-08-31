from django.urls import path
from .views import ReportViewSet
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register('',ReportViewSet,basename='report')
urlpatterns=[]
urlpatterns += router.urls