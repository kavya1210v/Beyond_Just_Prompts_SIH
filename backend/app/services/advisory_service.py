"""
Tier 2 - RAG Integrated Advisory Service
Generates stakeholder-specific actionable SOPs using ChromaDB RAG.
"""

import os
from typing import Optional
from pathlib import Path
from app.schemas.advisory import AdvisoryResponse, StakeholderAdvisories
from app.services.ibtracs_service import ibtracs_service
from app.rag.rag_service import rag_service
from app.inference.llm_inference import llm_inference

class AdvisoryService:
    def generate_advisory(self, storm_key: Optional[str] = None) -> AdvisoryResponse:
        cyclone_meta = ibtracs_service.get_current_cyclone_metadata(storm_key)
        cat_code = cyclone_meta.meteorological_data.imd_category.code
        wind_kmh = cyclone_meta.meteorological_data.max_sustained_wind_kmh
        basin = cyclone_meta.georeference.basin
        storm_name = cyclone_meta.storm_name

        # Determine IMD warning alert level
        if cat_code in ["VSCS", "ESCS", "SuCS"]:
            alert_level = "RED"
        elif cat_code in ["CS", "SCS"]:
            alert_level = "ORANGE"
        elif cat_code in ["D", "DD"]:
            alert_level = "YELLOW"
        else:
            alert_level = "GREEN"

        headline = f"{alert_level} ALERT: {cyclone_meta.meteorological_data.imd_category.name} ({storm_name}) in {basin}"
        
        risk_assessment = (
            f"The system is packing sustained surface winds of {wind_kmh} km/h with central pressure at "
            f"{cyclone_meta.meteorological_data.central_pressure_hpa} hPa. Potential for tidal storm surge of 2.0–3.5m "
            f"and localized flooding across vulnerable low-lying coastal tracts."
        )

        default_actions = StakeholderAdvisories(
            ndrf_sdma=[
                "Deploy pre-positioned rapid rescue battalions equipped with inflatable boats and tree cutters.",
                "Activate multi-purpose cyclone shelters; ensure 72-hour buffer of potable water, dry rations, and trauma kits.",
                "Set up satellite-based HAM radio communication backup across vulnerable district collectorates."
            ],
            marine_fisheries=[
                f"Total prohibition of fishing and small boat operations across entire {basin} maritime zones.",
                "Mandate immediate return of all offshore mechanized trawlers to designated safe berths.",
                "Broadcast continuous VHF Channel 16 emergency advisories in regional coastal languages."
            ],
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

        if rag_service.rag_enabled:
            query = f"What are the disaster management guidelines and actions for {cat_code} cyclone and NDRF deployment?"
            rag_contexts = rag_service.query_knowledge_base(query)
            
            if rag_contexts:
                # The context is fed to the LLM, but we don't display it directly in the UI anymore.
                
                generated_actions = llm_inference.generate_advisories(cat_code, wind_kmh, basin, rag_contexts)
                if generated_actions:
                    actions = StakeholderAdvisories(
                        ndrf_sdma=generated_actions.get("ndrf_sdma", default_actions.ndrf_sdma),
                        marine_fisheries=generated_actions.get("marine_fisheries", default_actions.marine_fisheries),
                        port_authorities=generated_actions.get("port_authorities", default_actions.port_authorities),
                        district_administration=generated_actions.get("district_administration", default_actions.district_administration),
                        public_safety=generated_actions.get("public_safety", default_actions.public_safety)
                    )

        return AdvisoryResponse(
            is_simulation=False if rag_service.rag_enabled else True,
            tier_status="TIER 2 - RAG INTEGRATED",
            engine="ChromaDB RAG + NDMP-2019 Vector Search",
            alert_level=alert_level,
            headline=headline,
            risk_assessment=risk_assessment,
            stakeholder_actions=actions
        )

advisory_service = AdvisoryService()
