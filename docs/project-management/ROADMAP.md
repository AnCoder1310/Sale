Dưới đây là timeline bám trực tiếp theo task division hiện tại của team.

## Mốc chung

| Mốc             | Kết quả bắt buộc                                     |
| -----------------| ------------------------------------------------------|
| **21–22/09**    | Freeze Gate 1 + API/schema/interface                 |
| **23–24/09**    | Walking Skeleton chạy end-to-end                     |
| **25–26/09**    | Copilot + Role-play core chạy thật                   |
| **27–28/09**    | Evaluator + persistence + UI integration             |
| **29/09**       | Integration freeze + bug fixing                      |
| **30/09 — MVP** | Deploy được, salesperson có thể dùng từ đầu đến cuối |
| **01–02/10**    | Hoàn thiện product + eval + HITL + polish            |
| **03/10**       | Release cho sales testers                            |
| **03–05/10**    | Thu feedback + bug/UX observations                   |

---

# 1. Duy — Role-play AI + Practice Backend

### Checkpoint D1 — 21–22/09

**Freeze Role-play contract**

Hoàn thành:

```text
RoleplayState schema
Scenario schema
5-dimension rubric
conversation stages
termination rules
disclosure rules
adaptive objection rules
```

Có ít nhất **3 scenario mẫu**:

```text
Scenario 1: khách quan tâm giá
Scenario 2: khách lo pin / charging
Scenario 3: khách đang so sánh 2 mẫu xe
```

Freeze interface với Chương:

```text
RoleplayGraph
knowledge tools
checkpoint
session ID
evaluation output
```

Deliverable:

```text
roleplay/state.py
roleplay/scenario_loader.py
sample scenarios
PRD role-play section
```

---

### Checkpoint D2 — 23–24/09

**AI Customer conversation chạy multi-turn**

Implement:

```text
customer_agent.py
turn_analyzer.py
basic RoleplayGraph
POST /practice/sessions
POST /practice/{id}/message
```

Flow phải chạy được:

```text
select scenario
→ AI Customer nói câu đầu
→ salesperson trả lời
→ AI phân tích
→ state update
→ AI Customer trả lời tiếp
→ tiếp tục nhiều turn
```

Yêu cầu:

- Không reset memory mỗi turn.
    
- Persona không đổi lung tung.
    
- Hidden information được giữ.
    
- Objection có thể unresolved/resolved.
    
- Có conversation history.
    

---

### Checkpoint D3 — 25–26/09

**Adaptive Customer v1**

Thêm:

```text
trust_level
interest_level
resolved_objections
unresolved_objections
revealed_facts
conversation_stage
```

Các behavior phải thấy được:

```text
salesperson hỏi đúng
→ reveal relevant information

xử lý objection tốt
→ trust tăng

né objection
→ customer hỏi lại / challenge

premature closing
→ customer resist
```

Tích hợp knowledge tool của Chương:

```text
search_product()
search_policy()
get_current_promotion()
```

---

### Checkpoint D4 — 27–28/09

**Evaluator v1**

Implement:

```text
evaluator.py
```

Output:

```text
Need Discovery
Product Knowledge
Objection Handling
Policy Accuracy
Closing / Next Step
```

Mỗi criterion có:

```text
score
evidence
reason
improvement suggestion
```

Kết nối evaluator với transcript thật.

Phối hợp Đạt chạy các case đầu tiên.

---

### Checkpoint D5 — 29/09

**Role-play integration freeze**

Test full flow:

```text
Scenario
→ Practice Room
→ 5–10 turns
→ Finish
→ Evaluation
→ Results
```

Fix:

- broken state
    
- memory loss
    
- repeated customer responses
    
- hallucinated scenario information
    
- premature termination
    
- evaluator output malformed
    

Không thêm feature mới sau checkpoint này trước MVP.

---

### Checkpoint D6 — 30/09 — MVP

Role-play MVP phải dùng được:

```text
✓ choose scenario
✓ multi-turn conversation
✓ adaptive customer
✓ persistent conversation
✓ knowledge lookup
✓ finish session
✓ 5-dimension evaluation
✓ result shown on frontend
```

---

### Checkpoint D7 — 01–02/10

**Role-play completion**

Thêm/fix:

- Difficulty handling.
    
- Better persona consistency.
    
- Better adaptive objections.
    
- Better termination logic.
    
- Improve evaluator prompt.
    
- Fix issues từ Đạt benchmark.
    
- More realistic scenarios.
    
- Improve coaching feedback.
    
- Support manager-reviewed evaluation flow.
    

---

# 2. Chương — Copilot + Knowledge + Platform + Role-play Runtime

### Checkpoint C1 — 21–22/09

**Freeze backend architecture**

Hoàn thành:

```text
FastAPI skeleton
PostgreSQL connection
pgvector setup
shared LLM client
API schemas
knowledge metadata schema
Role-play checkpoint interface
```

Freeze APIs với Duy + An:

```text
POST /copilot/query

POST /practice/sessions
POST /practice/{id}/message
POST /practice/{id}/finish
GET  /practice/{id}/evaluation

GET/PATCH /manager/reviews
```

---

### Checkpoint C2 — 23–24/09

**Backend Walking Skeleton**

Phải chạy được:

```text
React
→ FastAPI
→ LLM
→ response
```

và:

```text
RoleplayGraph
→ checkpoint
→ Postgres
→ reload session
```

Implement:

```text
database.py
llm_client.py
config.py
logging.py

roleplay/checkpoint.py
roleplay/persistence.py
```

Duy có thể gọi persistence API/service mà không cần biết DB implementation.

---

### Checkpoint C3 — 25–26/09

**Copilot RAG v1**

Implement:

```text
ingestion
chunking
embeddings
pgvector
retrieval
metadata filtering
grounded generation
citation
```

Copilot flow:

```text
question
→ retrieval
→ evidence
→ answer
→ citation
```

Support tối thiểu:

```text
product facts
price
policy
promotion
product comparison
```

Có:

```text
POST /copilot/query
```

---

### Checkpoint C4 — 27/09

**Copilot grounding + policy logic**

Thêm:

```text
effective_from
effective_to
version
status
```

Handle:

```text
current policy
expired policy
missing information
unsupported query
```

Output:

```text
answer
source
effective date
evidence
```

---

### Checkpoint C5 — 28–29/09

**Role-play runtime + Evaluation backend**

Hoàn thiện:

```text
knowledge_tools.py
checkpoint integration
conversation persistence
session restore
evaluation persistence
```

Implement:

```text
POST /practice/{id}/finish
GET /practice/{id}/evaluation
```

Support Duy's evaluator output.

---

### Checkpoint C6 — 30/09 — MVP

Copilot/backend MVP phải có:

```text
✓ deployed FastAPI
✓ Postgres working
✓ pgvector working
✓ Copilot RAG
✓ citations
✓ current-policy filtering
✓ Role-play persistence
✓ checkpoint/session restore
✓ evaluator persistence
✓ APIs connected to frontend
```

---

### Checkpoint C7 — 01–02/10

**Platform completion**

Hoàn thiện:

```text
Manager Review API
progress API
error handling
retry
timeout
logging
cost/token guards
deployment reliability
```

Improve:

- retrieval quality
    
- citation reliability
    
- policy conflict handling
    
- session recovery
    
- API error responses
    

---

# 3. Đạt — Data + Evaluation

### Checkpoint Đ1 — 21–22/09

**Data contract + minimum corpus**

Freeze metadata:

```text
document_id
document_type
product_model
policy_type
effective_date
expiry_date
version
source
status
content
```

Chuẩn bị corpus tối thiểu đủ để build:

```text
product information
price
policy
promotion
battery information
```

Đồng thời freeze scenario schema với Duy.

---

### Checkpoint Đ2 — 23–24/09

**Usable corpus v1**

Có cleaned/normalized dataset Chương có thể ingest.

Tạo:

```text
data/knowledge/
data/scenarios/
```

Có ít nhất:

```text
3 usable scenarios
objection library
buyer intent examples
sales question examples
```

---

### Checkpoint Đ3 — 25–26/09

**Copilot benchmark v1**

Tạo khoảng:

```text
20–30 questions
```

Bao gồm:

```text
product fact
comparison
promotion
current policy
expired policy
battery
unsupported query
```

Có expected evidence/source.

Chạy first RAG evaluation cùng Chương.

---

### Checkpoint Đ4 — 27–28/09

**Role-play benchmark + Judge set**

Tạo Role-play tests cho:

```text
persona consistency
hidden-info disclosure
objection handling
adaptive behavior
policy grounding
termination
```

Bắt đầu expert-labelled evaluator set.

MVP target có thể dùng:

```text
10+ labelled transcripts
```

sau đó tăng lên ≥20.

---

### Checkpoint Đ5 — 29/09

**MVP evaluation report**

Chạy:

```text
Copilot benchmark
Role-play benchmark
Evaluator benchmark
```

Report lỗi theo nhóm:

```text
Critical
Major
Minor
```

Gửi issue cụ thể cho Duy/Chương.

---

### Checkpoint Đ6 — 30/09 — MVP

Có ít nhất:

```text
✓ clean usable corpus
✓ scenario dataset
✓ Copilot eval set
✓ Role-play eval set
✓ evaluator-labelled examples
✓ MVP evaluation report
```

---

### Checkpoint Đ7 — 01–02/10

**Final evaluation**

Tăng evaluator set đến khoảng:

```text
≥20 annotated cases
```

Chạy:

```text
retrieval hit / Recall@K
citation correctness
groundedness
policy version correctness
role-play behavior tests
judge agreement / MAE
```

Chuẩn bị feedback form / tester observation fields cho sales testers.

---

# 4. An — Frontend + UX

### Checkpoint A1 — 21–22/09

**UI Flow freeze**

Freeze screens:

```text
Home
Copilot
Scenario Selection
Practice Room
Session Result
History
Progress
Manager Review
```

Freeze API contracts với Chương/Duy.

Hoàn thành frontend skeleton:

```text
routing
layout
API client
types
mock data
```

---

### Checkpoint A2 — 23–24/09

**Walking Skeleton UI**

Có navigation chạy được:

```text
Home
→ Copilot

Home
→ Scenario
→ Practice Room
→ Result
```

Dùng mock API nếu backend chưa xong.

Practice Room phải support:

```text
multi-turn chat
conversation history
loading
error
finish
```

---

### Checkpoint A3 — 25–26/09

**Connect real Copilot + Practice**

Tích hợp:

```text
POST /copilot/query

POST /practice/sessions
POST /practice/{id}/message
```

Copilot UI show:

```text
answer
citation
source
effective date
```

Practice Room chạy với AI thật.

---

### Checkpoint A4 — 27–28/09

**Results + Manager UI**

Implement:

```text
Session Result
5 rubric dimensions
evidence
reason
improvement suggestion
transcript
```

Implement Manager Review basic:

```text
AI score
manager score
note
approve
```

---

### Checkpoint A5 — 29/09

**Frontend freeze**

Run E2E:

```text
Copilot
Role-play
Finish
Evaluation
Result
```

Fix:

```text
broken states
loading states
API errors
responsive layout
conversation overflow
citation display
```

Không thêm major page trước MVP.

---

### Checkpoint A6 — 30/09 — MVP

Frontend MVP:

```text
✓ Advisor Home
✓ Copilot
✓ Scenario Selection
✓ Practice Room
✓ multi-turn chat
✓ Session Result
✓ citations
✓ deployed frontend
```

---

### Checkpoint A7 — 01–02/10

**Product completion**

Hoàn thiện:

```text
Manager Review
History
Progress Dashboard
empty states
error states
telemetry
responsive polish
UX polish
```

---

# 5. Integration checkpoints bắt buộc

### 22/09 — Contract Freeze

Team freeze:

```text
scenario schema
RoleplayState
API schemas
knowledge metadata
evaluation result schema
```

Không tự ý đổi interface sau đó mà không báo owner liên quan.

---

### 24/09 — Walking Skeleton Gate

Phải chạy được một flow thật dù còn rất thô:

```text
Frontend
→ FastAPI
→ RoleplayGraph
→ LLM
→ response
→ persisted session
→ frontend
```

Nếu gate này chưa pass, ưu tiên sửa nó trước khi build advanced features.

---

### 26/09 — Core AI Gate

Phải có hai hệ thống:

```text
Copilot
→ query → grounded answer → citation
```

và:

```text
Role-play
→ scenario → multi-turn AI Customer
```

---

### 28/09 — Product Loop Gate

Phải chạy:

```text
Select Scenario
→ Practice
→ Finish
→ Evaluate
→ Show Result
```

Copilot cũng phải chạy trên frontend.

---

### 29/09 — Feature Freeze

Từ đây tới MVP:

```text
NO major new features
```

Chỉ:

```text
bug fixing
integration
eval failures
deployment
critical UX
```

---

# 6. MVP Gate — 30/09/2026

MVP chỉ được coi là pass nếu salesperson có thể tự thực hiện toàn bộ:

```text
1. Open deployed website
2. Ask Copilot a product/policy question
3. Receive grounded answer + citation

4. Select Role-play scenario
5. Talk with AI Customer for multiple turns
6. AI remembers conversation
7. AI Customer reacts to salesperson behavior
8. Finish practice

9. Receive scores:
   - Need Discovery
   - Product Knowledge
   - Objection Handling
   - Policy Accuracy
   - Closing / Next Step

10. See evidence + feedback
```

---

# 7. Completion Gate — 02/10/2026

Trước khi gửi sales tester:

```text
✓ Copilot grounded + citation
✓ policy/version handling
✓ Role-play multi-turn stable
✓ adaptive customer behavior
✓ session persistence
✓ evaluation + evidence
✓ Manager Review
✓ ≥20 evaluator calibration cases hoặc dataset đã chuẩn bị đủ
✓ core benchmark run
✓ deployed frontend
✓ deployed backend
✓ production DB
✓ logging
✓ major bugs resolved
✓ tester accounts / test instructions ready
```

---

# 8. Sales Tester Release — 03/10/2026

Sales tester nhận:

```text
deployed URL
short login/instruction
3–5 suggested scenarios/tasks
feedback form
```

Tester tasks nên yêu cầu họ thử cả:

```text
Copilot lookup
product comparison
policy lookup
easy Role-play
difficult objection Role-play
evaluation feedback
```

Thu feedback theo:

```text
realism of AI Customer
usefulness of Copilot
correctness of information
quality of objections
quality of AI feedback
score fairness
missing sales situations
UX problems
would-use-in-real-training
```

---

## Critical path

```text
22 Sep
Contracts frozen
      ↓
24 Sep
Walking Skeleton
      ↓
26 Sep
Copilot + Role-play core
      ↓
28 Sep
Full practice loop
      ↓
29 Sep
Feature freeze
      ↓
30 Sep
MVP deployed
      ↓
1–2 Oct
Evaluate + fix + HITL + polish
      ↓
3 Oct
Sales tester release
```

Với deadline này, **30/09 nên được coi là “usable MVP”, không phải bản đầy đủ**; các phần Progress Dashboard, Manager analytics nâng cao, nhiều difficulty levels và polish nên ưu tiên sau khi core loop đã pass. Điều này giữ đúng các ownership đã chốt trong bản phân công hiện tại.