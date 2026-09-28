import { AdvisorPerformance, Assignment } from "@/types";

export const mockManagerAdvisors: AdvisorPerformance[] = [
  {
    id: "adv-001",
    name: "Võ Trường An",
    email: "an.vt@vinfast.vn",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    title: "Senior Sales Consultant",
    completedSessions: 28,
    averageScore: 88.5,
    lastActive: "15 phút trước",
    status: "high_performer",
    skills: {
      needDiscovery: 87,
      productKnowledge: 94,
      objectionHandling: 89,
      policyAccuracy: 95,
      closing: 72 // Weak skill consistently marked across all views
    },
    pendingReviewsCount: 1
  },
  {
    id: "adv-002",
    name: "Nguyễn Minh Khang",
    email: "khang.nm@vinfast.vn",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    title: "Sales Consultant",
    completedSessions: 19,
    averageScore: 82.0,
    lastActive: "2 giờ trước",
    status: "on_track",
    skills: {
      needDiscovery: 80,
      productKnowledge: 85,
      objectionHandling: 81,
      policyAccuracy: 88,
      closing: 76
    },
    pendingReviewsCount: 2
  },
  {
    id: "adv-003",
    name: "Trần Thị Mai Anh",
    email: "anh.ttm@vinfast.vn",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    title: "Junior Consultant",
    completedSessions: 12,
    averageScore: 68.4,
    lastActive: "Hôm qua",
    status: "needs_attention",
    skills: {
      needDiscovery: 62,
      productKnowledge: 74,
      objectionHandling: 65,
      policyAccuracy: 58,
      closing: 60
    },
    pendingReviewsCount: 3
  },
  {
    id: "adv-004",
    name: "Lê Đức Trọng",
    email: "trong.ld@vinfast.vn",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    title: "Sales Specialist",
    completedSessions: 24,
    averageScore: 85.2,
    lastActive: "35 phút trước",
    status: "high_performer",
    skills: {
      needDiscovery: 84,
      productKnowledge: 90,
      objectionHandling: 86,
      policyAccuracy: 89,
      closing: 77
    },
    pendingReviewsCount: 0
  },
  {
    id: "adv-005",
    name: "Phạm Hải Yến",
    email: "yen.ph@vinfast.vn",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    title: "Junior Consultant",
    completedSessions: 14,
    averageScore: 71.0,
    lastActive: "3 giờ trước",
    status: "needs_attention",
    skills: {
      needDiscovery: 68,
      productKnowledge: 72,
      objectionHandling: 70,
      policyAccuracy: 64,
      closing: 62
    },
    pendingReviewsCount: 2
  }
];

export const mockManagerAssignments: Assignment[] = [
  {
    id: "asg-01",
    title: "Luyện tập xử lý thắc mắc Pin VF 8",
    scenarioTitle: "VF 8 — Xử lý băn khoăn Pin Thuê vs Mua Đứt & Tính toán kinh tế",
    targetVehicle: "VinFast VF 8 Plus",
    assignedToAdvisor: "Trần Thị Mai Anh",
    assignedByManager: "Lê Văn Hoàng",
    dueDate: "2026-09-30",
    status: "pending"
  },
  {
    id: "asg-02",
    title: "Thuyết phục khách hàng truyền thống đi VF 9",
    scenarioTitle: "VF 9 — Thuyết phục Doanh nhân lựa chọn Ghế Cơ trưởng VIP",
    targetVehicle: "VinFast VF 9 Plus (6 chỗ)",
    assignedToAdvisor: "Võ Trường An",
    assignedByManager: "Lê Văn Hoàng",
    dueDate: "2026-09-28",
    status: "completed",
    score: 88
  },
  {
    id: "asg-03",
    title: "So sánh công nghệ ADAS trên VF 7 với C-SUV",
    scenarioTitle: "VF 7 — So sánh trực diện ADAS & Vận hành với C-SUV Máy Xăng",
    targetVehicle: "VinFast VF 7 Plus AWD",
    assignedToAdvisor: "Phạm Hải Yến",
    assignedByManager: "Lê Văn Hoàng",
    dueDate: "2026-09-29",
    status: "pending"
  }
];

export const mockWeeklyTrainingTrend = [
  { week: "Tuần 1", target: 80, completed: 68, avgScore: 74 },
  { week: "Tuần 2", target: 85, completed: 78, avgScore: 78 },
  { week: "Tuần 3", target: 90, completed: 86, avgScore: 81 },
  { week: "Tuần 4", target: 90, completed: 92, avgScore: 88.5 },
];

export const mockSkillDistribution = [
  { skill: "Need Discovery", score: 87, benchmark: 80 },
  { skill: "Product Knowledge", score: 94, benchmark: 85 },
  { skill: "Objection Handling", score: 89, benchmark: 80 },
  { skill: "Policy Accuracy", score: 95, benchmark: 90 },
  { skill: "Closing / Next Step", score: 72, benchmark: 75 },
];
