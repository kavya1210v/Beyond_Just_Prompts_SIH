import sys

with open('app/services/advisory_service.py', 'r') as f:
    lines = f.readlines()

new_lines = lines[:73]

new_code = """        default_actions = StakeholderAdvisories(
            ndrf_sdma=ndrf_sdma,
            marine_fisheries=marine_fisheries,
            port_authorities=[
                "Hoist Local Cautionary / Danger Signal (LC-III / Danger Signal VIII) at all operational jetties.",
                "Secure ship-to-shore gantry cranes, suspend vessel bunkering, and move light craft to inner tidal basins.",
                "Maintain tugboats on active engine standby for emergency drift interventions."
            ],
            district_administration=[
                "Execute mandatory evacuation of residents in kutcha houses located within 5–10 km of the coastline.",
                "Inspect high-mast lighting, trim hazardous tree canopies near arterial emergency transport routes.",
                "Ensure dedicated diesel generator sets at all district district general hospitals and blood banks."
            ],
            public_safety=[
                "Stay indoors in sturdy concrete structures; avoid venturing near beaches and sea walls.",
                "Disconnect non-essential electrical appliances and charge mobile battery banks.",
                "Rely strictly on official IMD/SDMA bulletins; do not circulate unverified rumors."
            ]
        )
        actions = default_actions

        if rag_enabled:
            query = f"What are the disaster management guidelines and actions for {cat_code} cyclone and NDRF deployment?"
            results = collection.query(
                query_texts=[query],
                n_results=4
            )
            
            rag_contexts = results['documents'][0] if results['documents'] else []
            
            if rag_contexts:
                # Augment the risk assessment with actual chunks retrieved from NDMP-2019
                risk_assessment += "\\n\\n--- RAG KNOWLEDGE BASE CONTEXT ---\\n"
                for i, ctx in enumerate(rag_contexts[:2]):
                    risk_assessment += f"\\n[{i+1}] {ctx}\\n"
                
                # Use Gemini to generate stakeholder actions based on RAG context
                context_str = "\\n".join(rag_contexts)
                prompt = f'''
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
                '''
                try:
                    llm = genai.GenerativeModel('gemini-1.5-flash')
                    response = llm.generate_content(prompt)
                    clean_text = response.text.replace("```json", "").replace("```", "").strip()
                    generated_actions = json.loads(clean_text)
                    
                    actions = StakeholderAdvisories(
                        ndrf_sdma=generated_actions.get("ndrf_sdma", default_actions.ndrf_sdma),
                        marine_fisheries=generated_actions.get("marine_fisheries", default_actions.marine_fisheries),
                        port_authorities=generated_actions.get("port_authorities", default_actions.port_authorities),
                        district_administration=generated_actions.get("district_administration", default_actions.district_administration),
                        public_safety=generated_actions.get("public_safety", default_actions.public_safety)
                    )
                except Exception as e:
                    print(f"Gemini generation failed: {e}")

"""
new_lines.extend([new_code])
new_lines.extend(lines[110:])

with open('app/services/advisory_service.py', 'w') as f:
    f.writelines(new_lines)
