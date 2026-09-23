from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000, description="Tin nhắn từ user")

class ChatResponse(BaseModel):
    response: str = Field(..., description="Phản hồi từ agent")
    analysis: str = Field(default="", description="Phân tích nội bộ")

# Copilot Schemas
class CopilotQueryRequest(BaseModel):
    query: str = Field(..., min_length=1)
    sessionId: Optional[str] = None
    vehicleModel: Optional[str] = None
    category: Optional[str] = None

class CopilotCitation(BaseModel):
    id: str
    docTitle: str
    version: str
    effectiveDate: str
    confidence: float
    snippet: str

class CopilotQueryResponse(BaseModel):
    answer: str
    citations: List[CopilotCitation]
    recommendedTalkingPoints: List[str]
    followUpQuestions: List[str]

# Practice / Role-play Schemas
class CreatePracticeSessionRequest(BaseModel):
    scenarioId: str
    advisorId: Optional[str] = "adv-001"
    advisorName: Optional[str] = "Võ Trường An"

class SendPracticeMessageRequest(BaseModel):
    message: str = Field(..., min_length=1)

# Manager HITL Schemas
class UpdateManagerReviewRequest(BaseModel):
    managerScore: int = Field(..., ge=0, le=100)
    managerNote: str
    reviewerName: Optional[str] = "Lê Văn Hoàng"

class CreateAssignmentRequest(BaseModel):
    title: str
    scenarioTitle: str
    targetVehicle: str
    assignedToAdvisor: str
    assignedByManager: str
    dueDate: str

# Telemetry Schema
class TelemetryEventRequest(BaseModel):
    eventName: str
    payload: Dict[str, Any] = Field(default_factory=dict)
    userId: Optional[str] = "adv-001"

# ----------------- Auth Schemas -----------------
class LoginRequest(BaseModel):
    email: str
    password: str
    rememberMe: Optional[bool] = False

class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    password: str
    confirmPassword: Optional[str] = None
    role: Optional[str] = "advisor"
    agreedToTerms: Optional[bool] = True

class RefreshTokenRequest(BaseModel):
    refreshToken: str

class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = ""
    role: str
    avatar: Optional[str] = ""
    title: Optional[str] = ""
    department: Optional[str] = ""
    showroom: Optional[str] = ""
    status: Optional[str] = "online"
    createdAt: Optional[str] = ""

class AuthTokensResponse(BaseModel):
    accessToken: str
    refreshToken: str
    tokenType: str = "Bearer"
    expiresIn: int = 28800

class AuthLoginResponse(BaseModel):
    user: Dict[str, Any]
    tokens: AuthTokensResponse

class ApproveUserRequest(BaseModel):
    userId: str
    assignedRole: str = "advisor"
    showroom: Optional[str] = "VinFast Vinh, Nghệ An"

class RejectUserRequest(BaseModel):
    userId: str
