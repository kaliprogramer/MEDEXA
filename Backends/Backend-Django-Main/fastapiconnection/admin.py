from django.contrib import admin
from .models import Prediction, LungsImagePrediction
# Register your models here.44

admin.site.register(Prediction)  
admin.site.register(LungsImagePrediction)