"""
Copilot Agent Graph.
Chủ quản: Chương (Platform, RAG & Runtime)
LangGraph-compatible state workflow điều phối:
Intent Router -> Retrieval -> Reranker -> Answer Generator -> Citation Validator -> Guardrails.
"""
from typing import Any, Dict, List, Optional, TypedDict

from src.copilot.answer_generator import answer_generator
from src.copilot.citation_validator import citation_validator
from src.copilot.guardrails import guardrails
from src.copilot.intent_router import intent_router
from src.copilot.reranker import rerank_evidence
from src.copilot.retrieval import retrieve_copilot_evidence


class CopilotState(TypedDict, total=False):
    query: str
    vehicle_model: Optional[str]
    intent: str
    evidence: List[Dict[str, Any]]
    answer: str
    citations: List[Dict[str, Any]]
    recommended_talking_points: List[str]
    follow_up_questions: List[str]
    is_safe: bool
    warnings: List[str]


class CopilotGraph:
    """Graph điều phối quy trình trả lời câu hỏi Copilot chuẩn RAG."""

    async def ainvoke(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state.get("query", "")
        vehicle_model = state.get("vehicle_model")

        # 1. Intent Routing
        intent = intent_router.route_intent(query)

        # 2. Retrieval
        raw_evidence = retrieve_copilot_evidence(
            query=query,
            vehicle_model=vehicle_model,
            top_k=4,
            intent=intent
        )

        # 3. Reranking
        reranked = rerank_evidence(query=query, evidence_list=raw_evidence, intent=intent)

        # 4. Answer Generation
        gen_result = await answer_generator.generate(
            query=query,
            evidence_list=reranked,
            intent=intent,
            vehicle_model=vehicle_model
        )

        # 5. Citation Validation
        is_cit_valid, valid_citations, cit_warnings = citation_validator.validate_citations(
            citations=reranked[:2],
            answer_text=gen_result["answer"]
        )

        # 6. Guardrails
        is_safe, safety_err = guardrails.check_safety(query, gen_result["answer"])
        final_answer = gen_result["answer"]
        if not is_safe:
            final_answer = f"Cảnh báo bảo mật: {safety_err}"

        return {
            "query": query,
            "vehicle_model": vehicle_model,
            "intent": intent,
            "answer": final_answer,
            "citations": valid_citations,
            "recommendedTalkingPoints": gen_result["recommendedTalkingPoints"],
            "followUpQuestions": gen_result["followUpQuestions"],
            "warnings": cit_warnings,
            "is_safe": is_safe
        }


copilot_graph = CopilotGraph()
