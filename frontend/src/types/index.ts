export type UserRole = "advisor" | "manager" | "admin" | "pending";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  title: string;
  department: string;
  showroom: string;
  status: "online" | "offline" | "busy" | "pending";
  accountStatus?: "active" | "pending" | "rejected";
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

// Vehicle specifications
export interface Vehicle {
  id: string;
  model: string;
  segment: string;
  tagline: string;
  image: string;
  startingPrice: string;
  batteryOptions: {
    type: "rent" | "buy";
    price: string;
    monthlyFee?: string;
  }[];
  rangeWltp: string;
  powerHp: number;
  torqueNm: number;
  acceleration: string;
  fastCharging: string;
  warranty: string;
  batteryWarranty: string;
  keyFeatures: string[];
  competitors: string[];
  sourceUrl?: string;
  fallbackImage?: string;
}

// Knowledge types
export interface KnowledgeDoc {
  id: string;
  title: string;
  category: "vehicle" | "policy" | "warranty_charging" | "sales_technique" | "competitor_battlecard";
  version: string;
  effectiveDate: string;
  status: "active" | "updating" | "archive" | "expired";
  summary: string;
  content: string;
  tags: string[];
  confidenceScore: number;
  source: string;
}

// Copilot Chat
export interface CopilotCitation {
  id: string;
  docTitle: string;
  version: string;
  effectiveDate: string;
  confidence: number;
  snippet: string;
  sourceUrl?: string;
}



export interface CopilotMessage {
  id: string;
  sender: "user" | "ai";
  timestamp: string;
  text: string;
  category?: string;
  citations?: CopilotCitation[];
  recommendedTalkingPoints?: string[];
  followUpQuestions?: string[];
  customerFitReasoning?: string;
}

// Role-play types
export interface CustomerPersona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  avatar: string;
  personality: string;
  familyProfile: string;
  primaryGoal: string;
  budgetVnd: string;
  trustInitial: number; // 0-100
  interestInitial: number; // 0-100
  hiddenNeeds: string[];
  primaryObjections: string[];
}

export interface RoleplayScenario {
  id: string;
  title: string;
  vehicleId: string;
  vehicleModel: string;
  difficulty: "Cơ bản" | "Tiêu chuẩn" | "Nâng cao";
  customerPersona: CustomerPersona;
  context: string;
  trainingObjective: string;
  targetSkills: string[];
  durationMinutes: number;
  successConditions: string[];
  terminationConditions: string[];
}

export interface RoleplayMessage {
  id: string;
  sender: "advisor" | "customer";
  text: string;
  timestamp: string;
  intentDetected?: string;
  factRevealed?: string;
  objectionResolved?: boolean;
}

export interface RubricScore {
  criterion: string;
  criterionNameVi: string;
  score: number; // out of 100 or 5
  maxScore: number;
  definition: string;
  evidence: string[];
  reason: string;
  improvementTip: string;
}

export interface PracticeSessionResult {
  sessionId: string;
  scenarioId: string;
  scenarioTitle: string;
  vehicleModel: string;
  advisorName: string;
  advisorId: string;
  date: string;
  duration: string;
  overallScore: number;
  managerReviewed: boolean;
  managerScore?: number;
  managerNote?: string;
  managerReviewerName?: string;
  managerReviewedAt?: string;
  rubricBreakdown: RubricScore[];
  aiSummary: string;
  transcript: RoleplayMessage[];
  recommendedNextPractice: string;
}

// Manager types
export interface AdvisorPerformance {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  completedSessions: number;
  averageScore: number;
  lastActive: string;
  status: "high_performer" | "on_track" | "needs_attention";
  skills: {
    needDiscovery: number;
    productKnowledge: number;
    objectionHandling: number;
    policyAccuracy: number;
    closing: number;
  };
  pendingReviewsCount: number;
}

export interface Assignment {
  id: string;
  title: string;
  scenarioTitle: string;
  targetVehicle: string;
  assignedToAdvisor: string;
  assignedByManager: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
  score?: number;
}

// Admin types
export interface SystemHealthMetric {
  name: string;
  service: string;
  status: "healthy" | "warning" | "error";
  latencyMs: number;
  detail: string;
  uptime: string;
}

export interface AILogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  agent: "Copilot RAG" | "Customer Simulator" | "Session Evaluator";
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  status: "200 OK" | "429 Rate Limit" | "500 Error";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: "Success" | "Failed";
}
// Real-time Notification types
export type NotificationType = 
  | "review_approved" 
  | "new_assignment" 
  | "policy_update" 
  | "practice_completed" 
  | "system"
  | "user_approval_needed"
  | "system_audit"
  | "review_needed"
  | "performance";

export interface AppNotification {
  id: string;
  userId?: string;
  userRole?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  targetTab?: string;
  targetData?: Record<string, any>;
}
