import xgboost as xgb
import json

bst = xgb.Booster()
bst.load_model('../classification_models/cyclone_xgboost_model.json')
print("Model loaded successfully!")
with open('../classification_models/cyclone_xgboost_model.json', 'r') as f:
    data = json.load(f)
print("Features:", data['learner']['feature_names'])
