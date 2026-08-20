from pydantic import BaseModel, Field

# ============================================================
# Request Schema
# ============================================================

class HeartDiseaseInput(BaseModel):
    age: float = Field(..., ge=0)
    anaemia: int = Field(..., ge=0, le=1)
    creatinine_phosphokinase: float = Field(..., ge=0)
    diabetes: int = Field(..., ge=0, le=1)
    ejection_fraction: float = Field(..., ge=0, le=100)
    high_blood_pressure: int = Field(..., ge=0, le=1)
    platelets: float = Field(..., ge=0)
    serum_creatinine: float = Field(..., ge=0)
    serum_sodium: float = Field(..., ge=0)
    sex: int = Field(..., ge=0, le=1)
    smoking: int = Field(..., ge=0, le=1)


class DiabetesDiseaseInput(BaseModel):
    age: float = Field(..., ge=0)
    gender: int = Field(..., ge=0, le=1)
    polyuria: int = Field(..., ge=0, le=1)
    polydipsia: int = Field(..., ge=0, le=1)
    sudden_weight_loss: int = Field(..., ge=0, le=1)
    weakness: int = Field(..., ge=0, le=1)
    polyphagia: int = Field(..., ge=0, le=1)
    genital_thrush: int = Field(..., ge=0, le=1)
    visual_blurring: int = Field(..., ge=0, le=1)
    itching: int = Field(..., ge=0, le=1)
    irritability: int = Field(..., ge=0, le=1)
    delayed_healing: int = Field(..., ge=0, le=1)
    partial_paresis: int = Field(..., ge=0, le=1)
    muscle_stiffness: int = Field(..., ge=0, le=1)
    alopecia: int = Field(..., ge=0, le=1)
    obesity: int = Field(..., ge=0, le=1)

class StrokeDiseaseInput(BaseModel):
    age: float = Field(..., ge=0)
    gender: int = Field(..., ge=0, le=2)
    hypertension: int = Field(..., ge=0, le=1)
    heart_disease: int = Field(..., ge=0, le=1)
    ever_married: int = Field(..., ge=0, le=1)
    work_type: int = Field(..., ge=0, le=5)
    Residence_type: int = Field(..., ge=0, le=1)
    avg_glucose_level: float = Field(..., ge=0)
    bmi: float = Field(..., ge=0)
    smoking_status: int = Field(..., ge=0, le=3)



class CKDInput(BaseModel):
    age: float = Field(..., description="Age of the patient")
    bp: float = Field(..., description="Blood pressure")
    sg: float = Field(..., description="Specific gravity")
    al: float = Field(..., description="Albumin")
    su: float = Field(..., description="Sugar")
    rbc: float = Field(..., description="Red blood cells")
    pc: float = Field(..., description="Pus cell")
    pcc: float = Field(..., description="Pus cell clumps")
    ba: float = Field(..., description="Bacteria")
    bgr: float = Field(..., description="Blood glucose random")
    bu: float = Field(..., description="Blood urea")
    sc: float = Field(..., description="Serum creatinine")
    sod: float = Field(..., description="Sodium")
    pot: float = Field(..., description="Potassium")
    hemo: float = Field(..., description="Hemoglobin")
    pcv: float = Field(..., description="Packed cell volume")
    wc: int = Field(..., description="White blood cell count")
    rc: float = Field(..., description="Red blood cell count")
    htn: float = Field(..., description="Hypertension")
    dm: int = Field(..., description="Diabetes mellitus")
    cad: int = Field(..., description="Coronary artery disease")
    appet: float = Field(..., description="Appetite")
    pe: float = Field(..., description="Pedal edema")
    ane: float = Field(..., description="Anemia")