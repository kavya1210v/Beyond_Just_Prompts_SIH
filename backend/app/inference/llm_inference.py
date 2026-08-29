import json
import google.generativeai as genai
from typing import Dict, List, Any

class LlmInferenceService:
    def __init__(self):
        import os
        api_key = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate_advisories(self, cat_code: str, wind_kmh: float, basin: str, rag_contexts: List[str]) -> Dict[str, Any]:
        context_str = "\n".join(rag_contexts)
        prompt = f"""
        You are a disaster management expert. Given the following cyclone details and NDMP-2019 guidelines, 
        generate specific, actionable 3-point SOPs for each of the following stakeholders:
        - ndrf_sdma
        - marine_fisheries
        - port_authorities
        - district_administration
        - public_safety

        Cyclone Details:
        - Category: {cat_code}
        - Winds: {wind_kmh} km/h
        - Basin: {basin}

        NDMP-2019 Guidelines:
        {context_str}

        Output EXACTLY in the following JSON format, with a list of 3 strings for each key. Do not include markdown formatting or backticks around the JSON:
        {{
            "ndrf_sdma": [],
            "marine_fisheries": [],
            "port_authorities": [],
            "district_administration": [],
            "public_safety": []
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
        except Exception as e:
            print(f"Gemini generation failed: {e}")
            return {}

llm_inference = LlmInferenceService()
