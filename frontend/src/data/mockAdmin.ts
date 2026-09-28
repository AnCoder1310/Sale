import { AILogEntry, AuditLogEntry, SystemHealthMetric } from "@/types";

export const mockSystemHealth: SystemHealthMetric[] = [
  {
    name: "FastAPI Backend Core",
    service: "Python 3.11 / FastAPI",
    status: "healthy",
    latencyMs: 38,
    detail: "16 workers active, CPU 18%, Mem 1.2GB/8GB",
    uptime: "99.98%"
  },
  {
    name: "PostgreSQL Primary DB",
    service: "PostgreSQL 16.2 with pgvector",
    status: "healthy",
    latencyMs: 12,
    detail: "12 active pools, 45 connections, disk 24%",
    uptime: "99.99%"
  },
  {
    name: "Qdrant Vector Database",
    service: "Qdrant Cluster v1.8",
    status: "healthy",
    latencyMs: 45,
    detail: "12,400 embeddings indexed (dimension 1536)",
    uptime: "99.95%"
  },
  {
    name: "LLM Gateway & Provider",
    service: "OpenAI GPT-4o / Azure Fallback",
    status: "healthy",
    latencyMs: 340,
    detail: "Tokens/min: 42k, Rate limit headroom 78%",
    uptime: "99.92%"
  },
  {
    name: "RAG Retrieval Pipeline",
    service: "Hybrid Sparse/Dense + BGE Reranker",
    status: "healthy",
    latencyMs: 82,
    detail: "Top-k: 5, MRR@5: 94.2%, Cosine similarity > 0.78",
    uptime: "99.96%"
  },
  {
    name: "Roleplay State Engine",
    service: "LangGraph Multi-turn Engine v1.2",
    status: "healthy",
    latencyMs: 65,
    detail: "Checkpoints: Redis, Session state consistency 100%",
    uptime: "99.97%"
  }
];

export const mockAILogs: AILogEntry[] = [
  {
    id: "req-9842",
    timestamp: "22/09 14:42:15",
    userId: "adv-001",
    userName: "Võ Trường An",
    agent: "Copilot RAG",
    model: "gpt-4o-2024-08-06",
    promptTokens: 1240,
    completionTokens: 385,
    latencyMs: 412,
    status: "200 OK"
  },
  {
    id: "req-9841",
    timestamp: "22/09 14:40:22",
    userId: "adv-001",
    userName: "Võ Trường An",
    agent: "Customer Simulator",
    model: "gpt-4o-2024-08-06",
    promptTokens: 1820,
    completionTokens: 92,
    latencyMs: 295,
    status: "200 OK"
  },
  {
    id: "req-9840",
    timestamp: "22/09 14:38:05",
    userId: "adv-002",
    userName: "Nguyễn Minh Khang",
    agent: "Copilot RAG",
    model: "gpt-4o-2024-08-06",
    promptTokens: 890,
    completionTokens: 210,
    latencyMs: 320,
    status: "200 OK"
  },
  {
    id: "req-9839",
    timestamp: "22/09 14:35:10",
    userId: "adv-003",
    userName: "Trần Thị Mai Anh",
    agent: "Session Evaluator",
    model: "gpt-4o-2024-08-06",
    promptTokens: 3420,
    completionTokens: 840,
    latencyMs: 1450,
    status: "200 OK"
  },
  {
    id: "req-9838",
    timestamp: "22/09 14:28:44",
    userId: "adv-004",
    userName: "Lê Đức Trọng",
    agent: "Customer Simulator",
    model: "gpt-4o-mini",
    promptTokens: 1150,
    completionTokens: 85,
    latencyMs: 210,
    status: "200 OK"
  }
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "aud-501",
    timestamp: "22/09 14:15:30",
    user: "le.hoang@vinfast.vn (Manager)",
    action: "UPDATE_SCORE",
    resource: "Session sess-2026-0922-01 (Score adjusted 86 -> 88)",
    ipAddress: "14.241.22.84",
    status: "Success"
  },
  {
    id: "aud-500",
    timestamp: "22/09 13:45:12",
    user: "admin.sys@vinfast.vn (Admin)",
    action: "UPDATE_AI_CONFIG",
    resource: "RAG Chunk size updated 512 -> 600 tokens",
    ipAddress: "118.69.182.10",
    status: "Success"
  },
  {
    id: "aud-499",
    timestamp: "22/09 11:20:05",
    user: "admin.sys@vinfast.vn (Admin)",
    action: "INGEST_DOCUMENT",
    resource: "Knowledge Doc: Chính sách Pin v2.6.2",
    ipAddress: "118.69.182.10",
    status: "Success"
  },
  {
    id: "aud-498",
    timestamp: "22/09 09:10:44",
    user: "mai.anh@vinfast.vn (Advisor)",
    action: "LOGIN",
    resource: "Auth Session",
    ipAddress: "42.112.98.214",
    status: "Success"
  }
];

export const mockAdminUsers = [
  { id: "usr-01", name: "Võ Trường An", email: "an.vt@vinfast.vn", role: "Advisor", showroom: "VinFast Vinh, Nghệ An", status: "Active", lastActive: "15 phút trước" },
  { id: "usr-02", name: "Lê Văn Hoàng", email: "hoang.lv@vinfast.vn", role: "Training Manager", showroom: "VinFast Vinh, Nghệ An", status: "Active", lastActive: "5 phút trước" },
  { id: "usr-03", name: "Hệ Thống Admin", email: "admin@vinfast.vn", role: "System Admin", showroom: "Headquarters", status: "Active", lastActive: "Đang online" },
  { id: "usr-04", name: "Nguyễn Minh Khang", email: "khang.nm@vinfast.vn", role: "Advisor", showroom: "VinFast Thảo Điền", status: "Active", lastActive: "2 giờ trước" },
  { id: "usr-05", name: "Trần Thị Mai Anh", email: "anh.ttm@vinfast.vn", role: "Advisor", showroom: "VinFast Vinh, Nghệ An", status: "Active", lastActive: "Hôm qua" },
  { id: "usr-06", name: "Phạm Hải Yến", email: "yen.ph@vinfast.vn", role: "Advisor", showroom: "VinFast Long Biên", status: "Active", lastActive: "3 giờ trước" },
];
