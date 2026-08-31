from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
import requests
from .models import Prediction,LungsImagePrediction
from .serializers import HeartPredictionInputSerializer,DiabetesPredictionInputSerializer, LungsImagePredictionInputSerializer,StrokePredictionInputSerializer,CKDPredictionInputSerializer
from authentication.views import CookieJWTAuthentication
import os
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

@api_view(["POST"])
@authentication_classes([
    SessionAuthentication,
    CookieJWTAuthentication,
])
@permission_classes([IsAuthenticated])
def predict_heart(request):

    # 1. Authenticated Django user
    user = request.user
    type = "heartdisease"
    # 2. Validate input
    serializer = HeartPredictionInputSerializer(
        data=request.data
    )
    

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=400
        )

    # 3. Validated data
    data = serializer.validated_data

    # 4. Django → FastAPI
    response = requests.post(
        f"{os.getenv('FAST_API_URL')}/heartdisease/predict/",
        json=data,
        timeout=10
    )

    # 5. Check FastAPI
    if response.status_code != 200:
        return Response(
            {
                "error": "FastAPI prediction failed",
                "details": response.text,
            },
            status=502
        )

    # 6. FastAPI result
    prediction = response.json()

    print(prediction)

    # 7. Save to Django database
    Prediction.objects.create(
        hospital=user,
        name=data["name"],
        age=data["age"],
        type=type,
        prediction=str(prediction["prediction"]),
        probability_of_risk=prediction["probabilities"]["1"],
        probability_of_healthy=prediction["probabilities"]["0"],
    )

    # 8. Return to Next.js
    return Response(prediction)




@api_view(["POST"])
@authentication_classes([
    SessionAuthentication,
    CookieJWTAuthentication,
])
@permission_classes([IsAuthenticated])
def predict_diabetes(request):

    # 1. Authenticated Django user
    user = request.user
    type = "diabetes"
    # 2. Validate input
    serializer = DiabetesPredictionInputSerializer(
        data=request.data
    )
    

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=400
        )

    # 3. Validated data
    data = serializer.validated_data

    # 4. Django → FastAPI
    response = requests.post(
        f"{os.getenv('FAST_API_URL')}/diabetes/predict/",
        json=data,
        timeout=10
    )

    # 5. Check FastAPI
    if response.status_code != 200:
        return Response(
            {
                "error": "FastAPI prediction failed",
                "details": response.text,
            },
            status=502
        )

    # 6. FastAPI result
    prediction = response.json()

    print(prediction)

    # 7. Save to Django database
    Prediction.objects.create(
        hospital=user,
        name=data["name"],
        age=data["age"],
        type=type,
        prediction=str(prediction["prediction"]),
        probability_of_risk=prediction["probabilities"]["1"],
        probability_of_healthy=prediction["probabilities"]["0"],
    )

    # 8. Return to Next.js
    return Response(prediction)


@api_view(["POST"])
@authentication_classes([
    SessionAuthentication,
    CookieJWTAuthentication,
])
@permission_classes([IsAuthenticated])
def predict_stroke(request):

    # 1. Authenticated Django user
    user = request.user
    type = "stroke"
    # 2. Validate input
    serializer = StrokePredictionInputSerializer(
        data=request.data
    )
    

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=400
        )

    # 3. Validated data
    data = serializer.validated_data

    # 4. Django → FastAPI
    response = requests.post(
        f"{os.getenv('FAST_API_URL')}/stroke/predict/",
        json=data,
        timeout=10
    )

    # 5. Check FastAPI
    if response.status_code != 200:
        return Response(
            {
                "error": "FastAPI prediction failed",
                "details": response.text,
            },
            status=502
        )

    # 6. FastAPI result
    prediction = response.json()

    print(prediction)

    # 7. Save to Django database
    Prediction.objects.create(
        hospital=user,
        name=data["name"],
        age=data["age"],
        type=type,
        prediction=str(prediction["prediction"]),
        probability_of_risk=prediction["probabilities"]["1"],
        probability_of_healthy=prediction["probabilities"]["0"],
    )

    # 8. Return to Next.js
    return Response(prediction)




@api_view(["POST"])
@authentication_classes([
    SessionAuthentication,
    CookieJWTAuthentication,
])
@permission_classes([IsAuthenticated])
def predict_ckd(request):

    # 1. Authenticated Django user
    user = request.user
    type = "ckd"
    # 2. Validate input
    serializer = CKDPredictionInputSerializer(
        data=request.data
    )
    

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=400
        )

    # 3. Validated data
    data = serializer.validated_data

    # 4. Django → FastAPI
    response = requests.post(
        f"{os.getenv('FAST_API_URL')}/chronic-kidney/predict",
        json=data,
        timeout=10
    )

    # 5. Check FastAPI
    if response.status_code != 200:
        return Response(
            {
                "error": "FastAPI prediction failed",
                "details": response.text,
            },
            status=502
        )

    # 6. FastAPI result
    prediction = response.json()

    print(prediction)

    # 7. Save to Django database
    Prediction.objects.create(
        hospital=user,
        name=data["name"],
        age=data["age"],
        type=type,
        prediction=str(prediction["prediction"]),
        probability_of_risk=prediction["probabilities"]["1"],
        probability_of_healthy=prediction["probabilities"]["0"],
    )

    # 8. Return to Next.js
    return Response(prediction)




@api_view(["POST"])
@authentication_classes([
    SessionAuthentication,
    CookieJWTAuthentication,
])
@permission_classes([IsAuthenticated])
def predict_lungsDisease(request):

    # 1. Authenticated Django user
    user = request.user
    # 2. Validate input
    serializer = LungsImagePredictionInputSerializer(
        data=request.data
    )
   

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=400
        )

    # 3. Validated data
    data = serializer.validated_data
    image = data["image"]
    # 4. Django → FastAPI

    
    response = requests.post(
        f"{os.getenv('FAST_API_URL')}/lung-disease/predict",
        files={
            "file": (
                image.name,
                image.file,
                image.content_type
            )
        }
    )


    # 5. Check FastAPI
    if response.status_code != 200:
        return Response(
            {
                "error": "FastAPI prediction failed",
                "details": response.text,
            },

            status=502
        )

    # 6. FastAPI result
    prediction = response.json()


    # 7. Save to Django database
    LungsImagePrediction.objects.create(
        hospital=user,
        name=data["name"],
        image=data["image"],
        gradcam_image=prediction["gradcam"],
        prediction=str(prediction["prediction"]),
        probability_of_risk=prediction["confidence"],
    )

    # 8. Return to Next.js
    return Response(prediction)
