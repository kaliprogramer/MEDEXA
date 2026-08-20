from torchvision import models, transforms
import torch
import torch.nn as nn

from torchvision.models import ResNet50_Weights

from PIL import Image
import numpy as np
import base64
import io

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image


# =====================================================
# DATASET CLASSES
# =====================================================

class_names = [
    "Bacterial Pneumonia",
    "Corona Virus Disease",
    "Normal",
    "Tuberculosis",
    "Viral Pneumonia",
]


# =====================================================
# DEVICE
# =====================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# =====================================================
# LOAD MODEL
# =====================================================

def load_model():

    model = models.resnet50(weights=None)

    model.fc = nn.Linear(
        model.fc.in_features,
        len(class_names)
    )

    model.load_state_dict(
        torch.load(
            "AI/models/lung_disease_resnet50.pth",
            map_location=device
        )
    )

    model.to(device)

    model.eval()

    return model


model = load_model()


# =====================================================
# IMAGE TRANSFORM
# =====================================================

transform = transforms.Compose([

    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# =====================================================
# GRAD-CAM TARGET LAYER
# =====================================================

target_layers = [
    model.layer4[-1]
]


# =====================================================
# IMAGE -> BASE64
# =====================================================

def image_to_base64(image):

    buffer = io.BytesIO()

    image.save(
        buffer,
        format="JPEG"
    )

    return base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")


# =====================================================
# PREDICTION + GRAD-CAM
# =====================================================

def predict_image(image: Image.Image):

    # -------------------------------------------------
    # Prepare original image
    # -------------------------------------------------

    image = image.convert("RGB")

    # Resize image for model
    resized_image = image.resize(
        (224, 224)
    )

    # -------------------------------------------------
    # Prepare tensor
    # -------------------------------------------------

    tensor = transform(image)

    tensor = tensor.unsqueeze(0)

    tensor = tensor.to(device)


    # -------------------------------------------------
    # Prediction
    # -------------------------------------------------

    with torch.no_grad():

        outputs = model(tensor)

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

        confidence, prediction = torch.max(
            probabilities,
            dim=1
        )

        top_probs, top_indices = torch.topk(
            probabilities,
            k=len(class_names),
            dim=1
        )


    predicted_index = prediction.item()

    predicted_class = class_names[
        predicted_index
    ]

    confidence_value = confidence.item()


    # =================================================
    # GRAD-CAM
    # =================================================

    # GradCAM needs gradients, so DO NOT use
    # torch.no_grad() here.

    cam = GradCAM(
        model=model,
        target_layers=target_layers
    )


    # Tell Grad-CAM to explain the predicted class
    targets = [
        ClassifierOutputTarget(
            predicted_index
        )
    ]


    # Generate heatmap
    grayscale_cam = cam(
        input_tensor=tensor,
        targets=targets
    )


    # First image in batch
    grayscale_cam = grayscale_cam[0]


    # -------------------------------------------------
    # Convert image to float RGB
    # -------------------------------------------------

    rgb_image = np.array(
        resized_image
    ).astype(
        np.float32
    ) / 255.0


    # -------------------------------------------------
    # Overlay Grad-CAM
    # -------------------------------------------------

    visualization = show_cam_on_image(
        rgb_image,
        grayscale_cam,
        use_rgb=True
    )


    # Convert NumPy image -> PIL
    gradcam_image = Image.fromarray(
        visualization
    )


    # Convert Grad-CAM -> Base64
    gradcam_base64 = image_to_base64(
        gradcam_image
    )


    # =================================================
    # TOP PREDICTIONS
    # =================================================

    top_predictions = []

    for probability, index in zip(
        top_probs[0],
        top_indices[0]
    ):

        top_predictions.append({

            "disease":
                class_names[index.item()],

            "probability":
                float(probability.item())

        })


    # =================================================
    # RESPONSE
    # =================================================

    return {

        "prediction":
            predicted_class,

        "confidence":
            float(confidence_value),

        "top_predictions":
            top_predictions,

        "gradcam":
            gradcam_base64

    }