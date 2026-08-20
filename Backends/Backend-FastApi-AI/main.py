import joblib
from Schemas.schemas import HeartDiseaseInput, DiabetesDiseaseInput, StrokeDiseaseInput,CKDInput
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image
import io
from AI.lung_disease_classification_model import predict_image


# ============================================================
# FastAPI App
# ============================================================

app = FastAPI(
    title="DoctRisk Disease Prediction API",
    description="API for disease prediction using a trained models.",
    version="1.0.0",
)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Load Model
# ============================================================

Heart_disease_model = joblib.load("AI/models/Heart_disease_model.pkl")
Diabetes_disease_model = joblib.load("AI/models/Diabetes_disease_model.pkl")
Stroke_disease_model = joblib.load("AI/models/Stroke_disease_model.pkl")
Chronic_kidney_model = joblib.load("AI/models/Chronic_kidney_Prediction.pkl")

# Get the exact feature names used during model training
HeartDisease_FEATURES = list(Heart_disease_model.feature_names_in_)
DiabetesDisease_FEATURES = list(Diabetes_disease_model.feature_names_in_)
StrokeDisease_FEATURES = list(Stroke_disease_model.feature_names_in_)
ChronicKidneyDisease_FEATURES = list(Chronic_kidney_model.feature_names_in_)

# ============================================================
# Root Endpoint
# ============================================================

@app.get("/")
def root():
    return {
        "message": "DoctRisk Disease Prediction API",
        "status": "running",
    }


# ============================================================
# Health Check
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": Heart_disease_model is not None,
    }


# ============================================================
# Prediction Endpoint
# ============================================================

@app.post("/heartdisease/predict")
def heartdisease_predict(data: HeartDiseaseInput):

    # Convert Pydantic data to dictionary
    input_data = data.model_dump()

    # Create DataFrame
    input_df = pd.DataFrame([input_data])

    # Make sure columns are in exactly the same order
    # as they were during model training
    input_df = input_df[HeartDisease_FEATURES]

    # Prediction
    prediction = Heart_disease_model.predict(input_df)[0]

    # Probability
    probabilities = Heart_disease_model.predict_proba(input_df)[0]

    # Map probabilities to class labels
    class_probabilities = {
        str(cls): float(prob)
        for cls, prob in zip(Heart_disease_model.classes_, probabilities)
    }

    return {
        "prediction": int(prediction),
        "probabilities": class_probabilities,
    }


@app.post("/diabetes/predict")
def diabetes_predict(data: DiabetesDiseaseInput):

    # Convert Pydantic data to dictionary
    input_data = data.model_dump()

    # Create DataFrame
    input_df = pd.DataFrame([{
        'Age': data.age,
        "Gender": data.gender,
        "Polyuria": data.polyuria,
        "Polydipsia": data.polydipsia,
        "sudden weight loss": data.sudden_weight_loss,
        "weakness": data.weakness,
        "Polyphagia": data.polyphagia,
        "Genital thrush": data.genital_thrush,
        "visual blurring": data.visual_blurring,
        "Itching": data.itching,
        "Irritability": data.irritability,
        "delayed healing": data.delayed_healing,
        "partial paresis": data.partial_paresis,
        "muscle stiffness": data.muscle_stiffness,
        "Alopecia": data.alopecia,
        "Obesity": data.obesity,
    }])

    # Make sure columns are in exactly the same order
    # as they were during model training
    input_df = input_df[DiabetesDisease_FEATURES]

    # Prediction
    prediction = Diabetes_disease_model.predict(input_df)[0]

    # Probability
    probabilities = Diabetes_disease_model.predict_proba(input_df)[0]

    # Map probabilities to class labels
    class_probabilities = {
        str(cls): float(prob)
        for cls, prob in zip(Diabetes_disease_model.classes_, probabilities)
    }
    return {
        "prediction": int(prediction),
        "probabilities": class_probabilities,
    }



# ---------------------------------------------------
# Lung Disease Prediction
# ---------------------------------------------------

@app.post("/lung-disease/predict")
async def lung_disease_predict(
    file: UploadFile = File(...)
):

    # Validate image type
    if not file.content_type.startswith("image/"):

        raise HTTPException(
            status_code=400,
            detail="Uploaded file must be an image"
        )

    try:

        contents = await file.read()

        image = Image.open(
            io.BytesIO(contents)
        )

        result = predict_image(image)

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.post('/stroke/predict')
async def stroke_prediction(data:StrokeDiseaseInput):
    try:
        # Convert Pydantic data to dictionary
        input_data = data.model_dump()

        # Create DataFrame
        input_df = pd.DataFrame([{
            "gender": data.gender,
            'age': data.age,
            "hypertension": data.hypertension,
            "heart_disease": data.heart_disease,
            "ever_married": data.ever_married,
            "work_type": data.work_type,
            "Residence_type": data.Residence_type,
            "avg_glucose_level": data.avg_glucose_level,
            "bmi": data.bmi,
            "smoking_status": data.smoking_status
        }])
        # input_df = input_df[StrokeDisease_FEATURES]

        # Prediction
        prediction = Stroke_disease_model.predict(input_df)[0]

        # Probability
        probabilities = Stroke_disease_model.predict_proba(input_df)[0]

        # Map probabilities to class labels
        class_probabilities = {
            str(cls): float(prob)
            for cls, prob in zip(Stroke_disease_model.classes_, probabilities)
        }

        return {
            "prediction": int(prediction),
            "probabilities": class_probabilities,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

@app.post("/chronic-kidney/predict")
def c_kidney(data:CKDInput):
    input_data = data.model_dump()
    # Create DataFrame
    input_df = pd.DataFrame([input_data])

    # Make sure columns are in exactly the same order
    # as they were during model training
    input_df = input_df[ChronicKidneyDisease_FEATURES]

    # Prediction
    prediction = Chronic_kidney_model.predict(input_df)[0]

    # Probability
    probabilities = Chronic_kidney_model.predict_proba(input_df)[0]

    # Map probabilities to class labels
    class_probabilities = {
        str(cls): float(prob)
        for cls, prob in zip(Chronic_kidney_model.classes_, probabilities)
    }

    return {
        "prediction": int(prediction),
        "probabilities": class_probabilities,
    }

