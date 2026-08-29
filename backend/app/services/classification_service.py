import os
import xgboost as xgb
import numpy as np
from app.schemas.cyclone import ClassificationRequest, ClassificationResponse
from app.services.ibtracs_service import IMD_CATEGORIES

class ClassificationService:
    def __init__(self):
        # Determine the base directory dynamically
        # Since this file is in backend/app/services/, the models are in ../../../classification_models
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        model_path = os.path.join(base_dir, 'classification_models', 'cyclone_xgboost_model.json')
        
        self.model = xgb.Booster()
        try:
            self.model.load_model(model_path)
            self.is_loaded = True
        except Exception as e:
            print(f"Error loading XGBoost model from {model_path}: {e}")
            self.is_loaded = False
            
        self.classes = ['CS', 'D', 'DD', 'ESCS', 'SCS', 'SuCS', 'VSCS']
        self.features = ['lat', 'lon', 'pressure', 'wind', 'pressure_drop', 'ci_no', 'step', 'basin_ARB', 'basin_BOB', 'basin_LAND']

    def predict(self, data: ClassificationRequest) -> ClassificationResponse:
        if not self.is_loaded:
            raise RuntimeError("XGBoost model is not loaded.")

        # Create input array based on the exact feature order expected by the model
        feature_values = [
            data.lat,
            data.lon,
            data.pressure,
            data.wind,
            data.pressure_drop,
            data.ci_no,
            data.step,
            data.basin_ARB,
            data.basin_BOB,
            data.basin_LAND
        ]
        
        # Convert to DMatrix
        # XGBoost expects a 2D array
        input_data = np.array([feature_values])
        dmatrix = xgb.DMatrix(input_data, feature_names=self.features)
        
        # Predict
        preds = self.model.predict(dmatrix)
        # For multi-class, preds is usually a 2D array of probabilities (1, num_classes)
        # Let's extract the probabilities and get the argmax
        if len(preds.shape) > 1:
            probs = preds[0]
            pred_idx = int(np.argmax(probs))
            confidence = float(probs[pred_idx])
        else:
            # Depending on objective, it might just return the class index
            pred_idx = int(preds[0])
            confidence = 1.0 # fallback

        predicted_class = self.classes[pred_idx]
        imd_info = IMD_CATEGORIES.get(predicted_class, IMD_CATEGORIES["D"])
        
        return ClassificationResponse(
            predicted_category=predicted_class,
            confidence=confidence,
            imd_info=imd_info
        )

classification_service = ClassificationService()
