from typing import Annotated, Any, Optional, Sequence

from langchain_core.messages import BaseMessage
from langgraph.graph import add_messages
from pydantic import BaseModel, Field


class AgentDecisionStructuredOutput(BaseModel):
    """Keputusan agent dalam menjawab pertanyaan"""

    can_answer: bool = Field(
        ..., description="Apakah agent bisa menjawab pertanyaan dari user"
    )
    reason: str = Field(
        ..., description="Alasan dari agent, contoh perlu mencari jawaban di dokumen"
    )


class AgentState(BaseModel):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    user_message: Optional[str] = None
    is_document: bool = False
    can_answer: bool = False
    reason: Optional[str] = None
    document_description: Optional[str] = None
