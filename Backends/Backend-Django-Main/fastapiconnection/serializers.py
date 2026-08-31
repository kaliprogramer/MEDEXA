from .models import  Prediction
from rest_framework import serializers



class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ["__all__"]
        

class LungsImagePredictionInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    image = serializers.ImageField(required=True, allow_null=False)

# =========================================================
# HEART DISEASE INPUT
# =========================================================

class HeartPredictionInputSerializer(serializers.Serializer):
    
    name = serializers.CharField(max_length=100)

    age = serializers.IntegerField(
        min_value=1,
        max_value=120
    )


    anaemia = serializers.IntegerField(
        min_value=0,
        max_value=1
    )

    creatinine_phosphokinase = serializers.IntegerField(
        min_value=0
    )

    diabetes = serializers.IntegerField(
        min_value=0,
        max_value=1
    )

    ejection_fraction = serializers.IntegerField(
        min_value=0,
        max_value=100
    )

    high_blood_pressure = serializers.IntegerField(
        min_value=0,
        max_value=1
    )

    platelets = serializers.IntegerField(
        min_value=0
    )

    serum_creatinine = serializers.FloatField(
        min_value=0
    )

    serum_sodium = serializers.IntegerField(
        min_value=0
    )

    sex = serializers.IntegerField(
        min_value=0,
        max_value=1
    )

    smoking = serializers.IntegerField(
        min_value=0,
        max_value=1
    )



class DiabetesPredictionInputSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=100,
        required=True
    )

    age = serializers.IntegerField(
        min_value=1,
        max_value=120,
        required=True
    )

    gender = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    polyuria = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    polydipsia = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    sudden_weight_loss = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    weakness = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    polyphagia = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    genital_thrush = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    visual_blurring = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    itching = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    irritability = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    delayed_healing = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    partial_paresis = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    muscle_stiffness = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    alopecia = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    obesity = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )



class StrokePredictionInputSerializer(serializers.Serializer):
    name = serializers.CharField(
            max_length=100,
            required=True
        )

    
    age = serializers.IntegerField(
        min_value=1,
        max_value=120,
        required=True
    )

    gender = serializers.IntegerField(
        min_value=0,
        max_value=2,
        required=True
    )

    hypertension = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    heart_disease = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    ever_married = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    work_type = serializers.IntegerField(
        min_value=0,
        max_value=5,
        required=True
    )

    Residence_type = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    avg_glucose_level = serializers.FloatField(
        min_value=0,
        required=True
    )

    bmi = serializers.FloatField(
        min_value=0,
        required=True
    )

    smoking_status = serializers.IntegerField(
        min_value=0,
        max_value=3,
        required=True
    )


class CKDPredictionInputSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=100,
        required=True
    )

    age = serializers.FloatField(
        required=True
    )

    bp = serializers.FloatField(
        required=True
    )

    sg = serializers.FloatField(
        min_value=1.0,
        max_value=2.0,
        required=True
    )

    al = serializers.IntegerField(
        min_value=0,
        max_value=5,
        required=True
    )

    su = serializers.IntegerField(
        min_value=0,
        max_value=5,
        required=True
    )

    rbc = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    pc = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    pcc = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    ba = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )

    bgr = serializers.FloatField(
        min_value=0,
        max_value=1000,
        required=True
    )

    bu = serializers.FloatField(
        required=True
    )

    sc = serializers.FloatField(
        required=True
    )

    sod = serializers.FloatField(
        required=True
    )

    pot = serializers.FloatField(
        required=True
    )

    hemo = serializers.FloatField(
        required=True
    )

    pcv = serializers.FloatField(
        required=True
    )

    wc = serializers.FloatField(
        required=True
    )

    rc = serializers.FloatField(
        required=True
    )

    htn = serializers.IntegerField(
        required=True
    )

    dm = serializers.IntegerField(
        required=True
    )

    cad = serializers.IntegerField(
        required=True
    )

    appet = serializers.IntegerField(
        required=True
    )

    pe = serializers.IntegerField(
        required=True
    )

    ane = serializers.IntegerField(
        min_value=0,
        max_value=1,
        required=True
    )


