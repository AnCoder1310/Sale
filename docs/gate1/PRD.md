# Product Requirements Document

## 1. Product Overview

**Project:** VFO2O-20 — AI Agent Huấn luyện & Hỗ trợ Tư vấn viên Bán xe
**Product type:** Internal Sales Enablement Platform
**Primary users:** Sales Advisor, Training Manager

### Product objective

Giúp tư vấn viên:

* tiếp cận kiến thức sản phẩm/chính sách chính xác nhanh hơn;
* luyện tập các tình huống bán hàng trước khi gặp khách;
* nhận feedback có thể hành động được.

Giúp manager:

* giảm công sức review thủ công;
* kiểm tra kết quả do AI tạo;
* phát hiện skill gap của từng nhân viên.

---

# 2. Problem Statement

Hiện tại có hai khoảng trống chính.

## 2.1. Knowledge Gap

Tư vấn viên có thể không nhớ hoặc chưa cập nhật:

* thông số sản phẩm;
* giá;
* ưu đãi;
* chính sách bán hàng;
* bảo hành;
* pin / sạc;
* nội dung vừa thay đổi.

Việc sử dụng thông tin cũ hoặc sai có thể dẫn tới tư vấn không chính xác.

---

## 2.2. Execution Gap

Ngay cả khi đã đọc tài liệu, tư vấn viên vẫn cần thực hành trước khi gặp khách thật.

Các cuộc hội thoại có thể thay đổi theo:

* loại khách hàng;
* nhu cầu;
* mức độ quan tâm;
* câu hỏi;
* phản đối;
* bối cảnh.

Sản phẩm phải hỗ trợ cả **Know** và **Do**, không chỉ xây chatbot hỏi đáp.

---

# 3. Personas

## Persona A — Sales Advisor

### Jobs

* tìm thông tin nhanh;
* luyện tư vấn;
* xem feedback;
* cải thiện kỹ năng.

### Pain points

* tài liệu phân tán;
* chính sách thay đổi;
* khó nhớ toàn bộ thông tin;
* không phải lúc nào cũng có trainer để luyện tập;
* khó biết mình cần cải thiện phần nào.

---

## Persona B — Training Manager

### Jobs

* kiểm tra chất lượng đào tạo;
* review kết quả của nhân viên;
* điều chỉnh đánh giá AI khi cần;
* xác định điểm yếu của từng nhân viên và team.

### Pain points

* review thủ công tốn thời gian;
* khó quan sát tất cả các phiên luyện tập;
* feedback có thể không đồng nhất;
* cần kiểm soát kết quả trước khi sử dụng chính thức.

---

# 4. Product Scope

## P0 — MVP Core

### F1. Authentication & Role

Hệ thống có hai role:

```text
Sales Advisor
Training Manager
```

Sau khi đăng nhập:

```text
Sales Advisor
→ Advisor Home

Training Manager
→ Manager Overview
```

---

### F2. Knowledge Copilot

Advisor có thể hỏi bằng ngôn ngữ tự nhiên về:

```text
Sản phẩm
Thông số xe
Giá
Ưu đãi
Chính sách
Bảo hành
Pin / sạc
```

Flow:

```text
Query
  ↓
Retrieve knowledge
  ↓
Filter relevant/current documents
  ↓
Rerank
  ↓
Generate grounded answer
  ↓
Answer + citation
```

Câu trả lời phải hiển thị:

* câu trả lời;
* tên nguồn;
* tài liệu liên quan;
* phiên bản/ngày hiệu lực khi có.

Nếu không đủ evidence:

> Không tìm thấy thông tin đủ tin cậy trong kho kiến thức hiện tại.

Hệ thống không được tự đoán giá, ưu đãi hoặc chính sách.

---

### F3. Knowledge Base

MVP sử dụng corpus được chuẩn bị từ các nguồn VinFast chính thức và tài liệu được team lựa chọn.

Knowledge base cần hỗ trợ:

```text
Product information
Price information
Sales policies
Promotion policies
Warranty
Battery / charging information
```

Metadata cơ bản:

```text
document_id
title
source_url
document_type
vehicle_model
policy_type
published_at
effective_from
effective_to
version
source_hash
content
```

Hệ thống cần phân biệt được:

```text
tài liệu hiện hành
tài liệu cũ
phiên bản tài liệu
thời gian hiệu lực
```

Không xây giao diện cho Manager upload URL hoặc PDF trong MVP.

Việc ingest/update corpus được xử lý bởi pipeline phía backend của project.

---

### F4. Practice Scenario Library

MVP có khoảng 4–5 scenario cố định.

Ví dụ:

```text
Price objection

EV / range concern

Competitor comparison

Customer not ready to buy

Need discovery
```

Một scenario có thể chứa:

```text
title
persona
context
hidden_needs
opening_statement
difficulty
reveal_rules
assessment_dimensions
```

---

### F5. AI Customer

AI đóng vai khách hàng trong phiên luyện tập.

AI Customer phải:

* giữ đúng persona;
* nhớ conversation history;
* phản ứng theo câu trả lời của advisor;
* không tự đổi scenario;
* không reveal toàn bộ hidden information ngay lập tức;
* tiết lộ thông tin dần theo conversation;
* duy trì hội thoại nhiều lượt.

AI Customer không được hiển thị:

```text
system prompt
hidden needs
scenario control logic
scoring logic
```

---

### F6. Conversation Memory

Mỗi practice session phải giữ context xuyên suốt nhiều lượt.

Ví dụ:

```text
Customer → Turn 1

Advisor → Turn 2

Customer → Turn 3

Advisor → Turn 4

...
```

AI Customer phải sử dụng các lượt trước để tạo phản hồi tiếp theo.

Không được coi mỗi message là một conversation mới.

---

### F7. End Practice Session

Advisor có thể chọn:

```text
[End Practice]
```

Sau khi kết thúc:

```text
Freeze transcript
      ↓
Analyze session
      ↓
Generate assessment
      ↓
Generate feedback
      ↓
Save session
```

---

### F8. AI Assessment / Rubric Judge

Sau phiên luyện tập, hệ thống đánh giá advisor theo các tiêu chí được cấu hình.

Assessment có thể bao gồm:

```text
Overall result

Score theo từng skill

Strengths

Areas for improvement

Transcript evidence

Suggested improvement
```

Rubric, số lượng skill, trọng số và thang điểm cụ thể sẽ được nghiên cứu và chốt ở giai đoạn sau.

---

### F9. Grounded Fact / Policy Check

Khi advisor đưa ra một phát biểu về:

```text
sản phẩm
giá
ưu đãi
policy
bảo hành
pin / sạc
```

hệ thống có thể sử dụng cùng Knowledge Base để kiểm tra.

Flow:

```text
Advisor statement
       ↓
Extract factual claim
       ↓
Retrieve relevant knowledge
       ↓
Compare with approved sources
       ↓
SUPPORTED
UNSUPPORTED
CONTRADICTED
       ↓
Provide evidence to assessment
```

Mục tiêu là không để phần factual accuracy phụ thuộc hoàn toàn vào đánh giá chủ quan của LLM Judge.

---

### F10. Session Review

Sau practice, Advisor có thể xem:

* overall result;
* score theo từng skill;
* strengths;
* weaknesses;
* evidence từ transcript;
* feedback;
* suggested improvement.

Nếu feedback liên quan đến factual information:

```text
Current source
[View Source]
```

Không hiển thị rubric score real-time trong lúc luyện tập.

---

### F11. Session History

MVP lưu:

```text
user
scenario
date/time
transcript
AI assessment
manager review
status
```

Advisor có thể xem:

```text
Recent Sessions
Previous Feedback
Basic Skill Summary
```

---

### F12. Manager HITL Review

Session sau khi được AI đánh giá sẽ xuất hiện trong Manager Review Queue.

Manager có thể xem:

```text
Transcript

AI assessment

Evidence

Feedback
```

Manager actions:

```text
Approve

Edit score / assessment

Add note / reason
```

Nếu chỉnh sửa, hệ thống lưu:

```text
old value
new value
manager
reason
timestamp
```

AI assessment không được coi là đánh giá chính thức của nhân viên trước khi Manager review theo workflow được cấu hình.

---

# 5. Main User Flows

## 5.1. Knowledge Lookup

```text
Advisor
   ↓
Open Knowledge Copilot
   ↓
Ask question
   ↓
Retrieve current knowledge
   ↓
Enough evidence?
   │
   ├── Yes
   │     ↓
   │ Answer + Citation
   │
   └── No
         ↓
      Cannot Verify
```

---

## 5.2. Practice

```text
Advisor
   ↓
Choose Scenario
   ↓
View Context
   ↓
Start Practice
   ↓
AI Customer ↔ Advisor
   ↓
Multi-turn Conversation
   ↓
End Practice
   ↓
Freeze Transcript
   ↓
Assessment
   ↓
Session Review
```

---

## 5.3. Manager Review

```text
Completed Session
       ↓
AI Assessment
       ↓
Pending Review
       ↓
Manager opens session
       ↓
┌──────────────┴──────────────┐
│                             │
Approve                     Edit
│                             │
└──────────────┬──────────────┘
               ↓
        Save Review Result
```

---

# 6. P1 — Advanced

## Personalized Recommended Practice

Dựa trên lịch sử assessment:

```text
assessment history
        ↓
identify weak area
        ↓
recommend scenario
```

Ví dụ:

```text
Objection Handling thấp
        ↓
Recommend Price Objection scenario
```

---

## Difficulty Progression

```text
Easy
  ↓
Medium
  ↓
Hard
```

Difficulty có thể thay đổi theo:

* mức resistance của customer;
* số hidden constraints;
* ambiguity;
* số objections;
* mức độ phức tạp của scenario.

---

## Progress Tracking

Theo dõi thay đổi theo thời gian:

```text
Skill score history

Practice frequency

Scenario history

Improvement trend
```

---

## Know–Do Profile

Phân biệt:

```text
KNOW
Khả năng nắm kiến thức

DO
Khả năng sử dụng kiến thức trong conversation
```

Ví dụ:

| Skill     | KNOW | DO |
| --------- | ---: | -: |
| Product   |   90 | 85 |
| Objection |   88 | 55 |
| Policy    |   52 | 58 |

---

## Team Analytics

Manager có thể xem:

```text
Team skill summary

Common weaknesses

Practice activity

Performance trends
```

---

## Policy Change Detection

Hệ thống có thể kiểm tra khi nguồn policy chính thức thay đổi.

```text
Existing source
      ↓
Check updated source
      ↓
Detect change
      ↓
Update/version corpus
```

Đây là enhancement sau MVP, không phải yêu cầu để hoàn thành Gate 1.

---

## Policy Delta Training

Nếu policy mới thay đổi:

```text
New policy
    ↓
Compare with previous version
    ↓
Extract important changes
    ↓
Create short update
    ↓
Recommend relevant practice
```

---

# 7. Main User Stories

## Advisor

### US-01 — Knowledge Lookup

As a Sales Advisor, I want to ask about current product or policy information so that I can answer accurately.

Acceptance:

* response có source;
* current/version information có thể xác định;
* unsupported question triggers abstention.

---

### US-02 — Practice

As a Sales Advisor, I want to practice against an AI Customer so that I can improve before talking to a real customer.

Acceptance:

* multi-turn conversation;
* AI giữ persona;
* AI nhớ conversation context;
* AI phản ứng theo previous answers.

---

### US-03 — Feedback

As a Sales Advisor, I want detailed feedback so that I know what I should improve.

Acceptance:

* assessment theo skill;
* transcript evidence;
* strengths;
* improvement suggestions.

---

## Manager

### US-04 — Assessment Review

As a Training Manager, I want to review AI assessments before using them as official training results.

Acceptance:

* xem transcript;
* xem evidence;
* approve/edit;
* edit history được lưu.

---

### US-05 — Team Skill Gaps

As a Training Manager, I want to see common skill gaps so that I can determine future training priorities.

---

# 8. UX Requirements

## Advisor Navigation

```text
Home
Practice
Knowledge
Progress
```

Main actions:

```text
[Start Practice]

[Ask Knowledge Copilot]
```

---

## Manager Navigation

```text
Overview
Team
Reviews
```

MVP không cần dashboard phức tạp.

---

## UX Principles

* ít menu;
* một CTA chính trên mỗi màn hình;
* clean modern light UI;
* automotive / premium appearance;
* responsive desktop-first;
* không animation phức tạp;
* không skeletal animation.

---

# 9. AI Architecture

```text
                     React Frontend
                            │
                         FastAPI
                            │
                        LangGraph
                ┌───────────┴───────────┐
                │                       │
         Knowledge Flow          Practice Flow
                │                       │
              RAG                 Load Scenario
                │                       │
      Version / Date Filter        AI Customer
                │                       │
       Answer + Citation        Multi-turn Loop
                                        │
                                   Transcript
                                        │
                               Fact / Policy Check
                                        │
                                    AI Judge
                                        │
                                 Session Review
                                        │
                                  Manager HITL
```

LangGraph được sử dụng cho:

```text
Stateful conversation

Multi-turn role-play

Branching workflow

Evaluation workflow

Manager HITL

Session state
```

Không cần LLM quyết định user muốn dùng Knowledge hay Practice vì user chọn chức năng trực tiếp từ UI.

---

# 10. Data Model — Minimal

```text
users

documents

document_chunks

scenarios

practice_sessions

conversation_turns

assessments

assessment_dimensions

manager_reviews
```

Relations:

```text
User
 └── Practice Session
      ├── Conversation Turns
      └── Assessment
           └── Manager Review
```

Knowledge:

```text
Document
 └── Document Chunks
```

---

# 11. Evaluation

## Knowledge Copilot

Có thể đánh giá ví dụ:

* Recall@K;
* Context Precision;
* Answer Correctness;
* Faithfulness;
* Citation Accuracy;
* Out-of-KB abstention.

---

## AI Judge

Advanced evaluation sử dụng tập transcript được chuyên gia chấm.

```text
≥20 transcripts
       ↓
Expert scores
       ↓
AI Judge scores same transcripts
       ↓
Compare
```

Có thể report:

* QWK;
* MAE;
* ±1 score agreement;
* disagreement theo từng skill.

---

# 12. Non-Functional Requirements

## Accuracy

Thông tin factual, sản phẩm và policy phải grounded vào knowledge base được phê duyệt.

---

## Freshness

Knowledge system cần hỗ trợ:

```text
Document version

Effective date

Current / previous policy
```

---

## Security

Không commit:

```text
API keys

Database passwords

Sensitive employee information
```

---

## Privacy

Training results là dữ liệu nội bộ.

Chỉ Advisor phù hợp và Manager được cấp quyền mới được truy cập.

---

## Auditability

Hệ thống nên lưu:

```text
Document/source version

AI-generated assessment

Rubric version

Prompt/model version

Manager changes
```

---

## Cost

MVP ưu tiên:

```text
Không gọi Judge ở mỗi conversation turn

Chỉ evaluate sau khi session kết thúc

Cache embeddings

Giới hạn session length

Tái sử dụng cùng knowledge base cho Copilot và fact checking
```

---

# 13. Guardrails

AI Customer không được tạo:

```text
Nội dung kỳ thị

Nội dung tình dục không phù hợp

Tình huống bất hợp pháp

Tấn công cá nhân
```

Knowledge Copilot không được:

```text
Tự tạo policy

Tự đoán giá

Tự đoán promotion

Trả lời chắc chắn khi không có đủ nguồn
```

---

# 14. MVP Priority

## P0 — MVP

```text
Authentication + Role

Knowledge Copilot

RAG + Citations

Version / effective-date filtering

Scenario Library

AI Customer multi-turn

Conversation Memory

Assessment after session

Fact / Policy Check

Session Review

Manager Review / Edit / Approve

Session History
```

---

## P1 — Advanced

```text
Personalized Recommended Practice

Difficulty Progression

Progress Tracking

Know–Do Profile

Team Analytics

Policy Change Detection

Policy Delta Training

Scenario Generation
```

---

# 15. Explicit Non-Goals

Không xây:

```text
Customer-facing chatbot

Manager URL/PDF upload interface

Voice mode

CRM

Lead generation

Marketing automation

Automatic customer calls

Automatic closing

Automatic payment

Autonomous sales agent
```

---

# 16. MVP Completion Criteria

MVP cần chứng minh được ba luồng chính.

## 1. Knowledge

Advisor có thể:

```text
Ask question

Receive grounded answer

View source

Receive Cannot Verify response when evidence is insufficient
```

---

## 2. Practice

Advisor có thể:

```text
Choose scenario

Have multi-turn conversation with AI Customer

End session

Receive assessment and feedback
```

---

## 3. Manager HITL

Manager có thể:

```text
View assessment

View transcript

View evidence

Approve

Edit

Save review note
```

---
