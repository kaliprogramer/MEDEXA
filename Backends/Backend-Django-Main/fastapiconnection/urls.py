from django.urls import path
from . import views
urlpatterns = [
    path("heartdisease/predict/", views.predict_heart, name="predict-heart"),
    path("diabetes/predict/", views.predict_diabetes, name="predict-diabetes"),
    path("stroke/predict/", views.predict_stroke, name="predict-stroke"),
    path("chronic-kidney/predict/", views.predict_ckd, name="predict-ckd"),
    path("lung-disease/predict/", views.predict_lungsDisease, name="predict-lungs"),
]