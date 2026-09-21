# Kế hoạch phân công nhiệm vụ đầy đủ — Team P-043

## 1. Duy — AI Customer Role-play, Coaching Logic & Practice Chat Backend

### Trách nhiệm chính
Phụ trách business intelligence và conversational behavior của hệ thống **AI Customer Role-play**, gồm:

- AI Customer behavior
- Scenario logic
- Customer persona
- Hidden customer state
- Conversation stages
- Adaptive objections
- Sales conversation strategy
- Role-play prompts
- Turn analysis
- Coaching/evaluator behavior
- Practice chat backend

### Gate 1
- Xác định flow Advisor → AI Customer → multi-turn conversation → session finish → evaluator → manager review.
- Xác định Role-play user journey.
- Xác định scenario structure.
- Xác định AI Customer behavior contract.
- Xác định persona structure.
- Xác định visible customer information.
- Xác định hidden customer information.
- Xác định buyer intent và customer goals.
- Xác định objection structure.
- Xác định disclosure rules.
- Xác định conversation stages.
- Xác định difficulty levels.
- Xác định success conditions và termination conditions.
- Xác định coaching output và evaluation output.
- Co-own rubric với Đạt gồm:
  - Need Discovery
  - Product Knowledge
  - Objection Handling
  - Policy Accuracy
  - Closing / Next Step
- Với mỗi rubric dimension, xác định:
  - definition
  - expected behavior
  - poor behavior
  - good behavior
  - evidence expected from transcript
  - score range
- Hỗ trợ Chương xác định:
  - sales intent taxonomy
  - sales-use-case questions
  - answer structure
  - recommended talking points
  - recommended follow-up questions
  - customer-fit reasoning
- Phụ trách chính:
  - `BRIEF.md`
  - `PRD.md` — phần product + role-play
  - Role-play specification
  - Scenario specification
  - Rubric business requirements
- Hỗ trợ:
  - `WIREFRAME_UI_FLOW.md`
  - Architecture diagram
  - Copilot behavior specification

### Build responsibilities

#### 1. RoleplayGraph business flow
Co-own `RoleplayGraph` với Chương.

Duy phụ trách business transitions:

```text
START
 ↓
load_scenario
 ↓
customer_turn
 ↓
wait_for_advisor
 ↓
analyze_advisor_turn
 ↓
update_customer_state
 ↓
decide_conversation_stage
 ↓
continue / finish
 ↓
evaluate_session
 ↓
manager_review_pending
 ↓
END
```

Duy phụ trách meaning và behavior của:
- `load_scenario`
- `customer_turn`
- `analyze_advisor_turn`
- `update_customer_state`
- conversation transition rules
- evaluation reasoning

Chương phụ trách runtime/tool/persistence nodes trong cùng graph.

#### 2. AI Customer Agent
Implement:

```text
backend/roleplay/customer_agent.py
backend/roleplay/prompts/
```

AI Customer Agent cần:
- Giữ consistency với persona.
- Bám scenario goal.
- Mô phỏng buyer behavior thực tế.
- Hỏi contextual questions.
- Đưa objections.
- Phản ứng khác nhau tùy câu trả lời của salesperson.
- Không reveal hidden information quá sớm.
- Reveal thông tin khi salesperson hỏi đúng.
- Thay đổi trust/interest theo conversation.
- Không tự bịa product hoặc policy information.
- Dùng shared knowledge tools khi cần factual information.
- End conversation theo termination conditions.

#### 3. Role-play business state
Phụ trách:

```text
backend/roleplay/state.py
```

State fields:
- `scenario_id`
- `conversation_stage`
- `turn_count`
- `interest_level`
- `trust_level`
- `visible_customer_facts`
- `hidden_customer_facts`
- `revealed_facts`
- `active_objections`
- `resolved_objections`
- `unresolved_objections`
- `customer_goals`
- `advisor_discoveries`
- `current_intent`
- `current_topic`
- `termination_status`
- `termination_reason`

#### 4. Scenario engine
Phụ trách runtime interpretation của structured scenarios.

Scenario format hỗ trợ:
- persona
- visible_context
- hidden_information
- buyer_intent
- customer_goals
- objections
- difficulty
- disclosure_rules
- expected_discovery
- success_conditions
- termination_conditions
- target_skills

Implement:

```text
backend/roleplay/scenario_loader.py
```

Phối hợp với Đạt về scenario content.

#### 5. Turn-analysis logic
Implement:

```text
backend/roleplay/turn_analyzer.py
```

Phân tích mỗi salesperson turn để phát hiện:
- question asked
- need discovered
- product claim made
- policy claim made
- objection addressed
- objection avoided
- next-step attempt
- incorrect information
- customer concern resolved

Output thành structured signals để cập nhật `RoleplayState`.

#### 6. Adaptive Customer logic
Implement các transitions:

```text
good objection handling
→ objection resolved
→ trust increases
→ customer may reveal more information
```

```text
poor objection handling
→ objection stays active
→ trust may decrease
→ customer challenges salesperson again
```

```text
good discovery question
→ relevant hidden fact revealed
```

```text
premature selling
→ customer may resist
→ unresolved needs remain
```

#### 7. Practice Chat backend
Phụ trách:

```text
POST /practice/sessions
POST /practice/{id}/message
```

Implement:

```text
backend/api/practice_chat.py
backend/services/practice_service.py
```

`POST /practice/sessions`:
- validate scenario
- request session creation
- initialize role-play state
- invoke first customer turn
- return session information

`POST /practice/{id}/message`:
- receive advisor message
- load current role-play state
- invoke RoleplayGraph
- analyze advisor turn
- update business state
- generate next customer response
- return customer response + session status

Persistence mechanism do Chương cung cấp.

#### 8. Evaluator / Coaching behavior
Phụ trách:

```text
backend/roleplay/evaluator.py
```

Evaluation input:
- scenario
- transcript
- final RoleplayState
- rubric
- relevant evidence

Evaluation output:
- criterion
- score
- evidence
- reason
- improvement suggestion

Áp dụng cho:
- Need Discovery
- Product Knowledge
- Objection Handling
- Policy Accuracy
- Closing / Next Step

Phối hợp với Đạt về benchmark/calibration.
Chương phụ trách persistence và retrieval của evaluation results.

#### 9. Shared knowledge usage trong Role-play
Dùng các tools do Chương cung cấp:

```text
search_product()
search_policy()
get_current_promotion()
get_product_comparison()
citation_validator()
```

Dùng cho:
- current product facts
- price/policy facts
- promotion information
- product comparisons
- factual validation

#### 10. Integration responsibilities
Với Chương:
- RoleplayGraph
- state interfaces
- tool contracts
- checkpoint behavior
- session lifecycle

Với Đạt:
- scenario dataset
- objection library
- rubric
- evaluator benchmark
- expert calibration

Với An:
- Practice Room behavior
- session states
- customer message behavior
- Session Result semantics

### Boundary
Duy phụ trách:
- AI Customer behavior
- conversation strategy
- scenario runtime semantics
- RoleplayState business semantics
- adaptive objections
- customer-turn logic
- turn-analysis logic
- role-play prompts
- evaluation reasoning
- coaching logic
- practice start/message backend

Cần phối hợp với Chương trước khi thay đổi:
- shared FastAPI setup
- database connection
- checkpoint implementation
- persistence implementation
- shared LLM client
- shared knowledge tools
- shared middleware
- global API conventions

Không tự ý thay đổi:
- Copilot retrieval implementation
- vector-store implementation
- knowledge ingestion
- policy-versioning infrastructure
- evaluation ground-truth datasets
- frontend components

---

# 2. Chương — AI Sales Copilot, Shared Backend Platform & Role-play Runtime

### Trách nhiệm chính
Phụ trách:
- AI Sales Copilot
- RAG / retrieval
- grounding
- citations
- policy versioning
- shared knowledge layer
- FastAPI platform
- PostgreSQL
- pgvector
- shared LangGraph infrastructure
- LLM provider integration
- logging
- deployment
- Role-play runtime infrastructure
- Role-play persistence
- Role-play checkpointing

### Gate 1
Định nghĩa:
- technical architecture
- Copilot architecture
- shared knowledge architecture
- shared LangGraph architecture
- backend service boundaries
- FastAPI contracts
- PostgreSQL structure
- pgvector structure
- session persistence design
- checkpoint design
- AI logging structure
- deployment architecture
- knowledge-service interface

Phụ trách phần technical của `PRD.md`.

Phụ trách:
- Architecture diagram
- Copilot specification
- API contracts
- Database/data-model draft
- GitHub repo setup
- AI Log setup

Phối hợp với An về frontend/backend contracts.
Phối hợp với Duy về shared RoleplayGraph architecture.

### Build responsibilities

#### 1. AI Sales Copilot
Phụ trách toàn bộ flow:

```text
Advisor question
      ↓
classify intent
      ↓
retrieve knowledge
      ↓
metadata/date filtering
      ↓
rerank evidence
      ↓
generate grounded response
      ↓
validate citation
      ↓
answer / abstain
```

Implement:

```text
backend/copilot/
├── graph.py
├── state.py
├── prompts.py
├── intent_router.py
├── retrieval.py
├── reranker.py
├── answer_generator.py
├── citation_validator.py
└── guardrails.py
```

#### 2. Copilot capabilities
Support:
- product specifications
- product comparison
- price
- battery policy
- promotion
- sales policy
- current applicable policy
- customer-fit recommendation
- sales talking points
- suggested follow-up questions

Response cần có:
- answer
- supporting evidence
- source citation
- effective date
- relevant product
- relevant policy
- recommended talking point
- suggested next question

#### 3. Unsupported-query handling
Xử lý:
- insufficient evidence
- missing evidence
- conflicting evidence
- expired policy
- missing policy
- out-of-scope query

Hỗ trợ controlled abstention.

#### 4. Shared Knowledge Layer
Phụ trách:

```text
backend/knowledge/
├── ingestion.py
├── chunking.py
├── embeddings.py
├── vector_store.py
├── metadata.py
├── policy_versioning.py
└── retrieval_service.py
```

Metadata:
- document_id
- document_type
- product_model
- policy_type
- effective_from
- effective_to
- source
- version
- status

Expose shared tools:

```text
search_product()
search_policy()
get_current_promotion()
get_product_comparison()
citation_validator()
```

Dùng chung bởi `CopilotGraph` và `RoleplayGraph`.

#### 5. Shared LangGraph infrastructure
Phụ trách:
- graph execution infrastructure
- tool-node conventions
- checkpoint implementation
- state persistence mechanism
- session restore
- error handling
- retry
- timeout
- token guards
- cost guards
- shared logging
- LLM provider configuration

#### 6. Contribution trực tiếp vào Role-play runtime
Phụ trách:
- knowledge/tool node
- checkpoint node
- persistence node
- session-recovery logic

Implement:

```text
backend/roleplay/
├── checkpoint.py
├── persistence.py
└── knowledge_tools.py
```

Trong `RoleplayGraph`:

```text
[Duy]
customer_turn
   ↓
analyze_turn
   ↓
update_customer_state

[Chương]
   ↓
knowledge lookup if required
   ↓
persist turn
   ↓
checkpoint state

[Duy]
   ↓
next customer turn
```

#### 7. RoleplayGraph shared implementation
Co-own:

```text
backend/roleplay/graph.py
```

Chương phụ trách:
- graph wiring
- tool integration
- checkpoint integration
- persistence integration
- runtime reliability
- error/retry behavior
- session recovery

Duy phụ trách business logic và transition meaning.

#### 8. Backend/API
Chương phụ trách platform-level FastAPI structure.

Chương phụ trách:

```text
POST /copilot/query
GET  /copilot/sources/{id}

POST /practice/{id}/finish
GET  /practice/{id}/evaluation

GET   /manager/reviews
PATCH /manager/reviews/{id}

GET /progress
```

Duy phụ trách:

```text
POST /practice/sessions
POST /practice/{id}/message
```

#### 9. Evaluation backend
Phụ trách:
- evaluation persistence
- criterion-score persistence
- evaluation retrieval API
- manager-review persistence
- manager-review API

Flow:

```text
[Duy]
Evaluator reasoning
        ↓
criterion scores
evidence
feedback
        ↓
[Chương]
persist evaluation
        ↓
evaluation API
        ↓
manager review
```

#### 10. Database / persistence
Phụ trách shared PostgreSQL infrastructure.

Models/tables:
- users
- roles
- documents
- document_versions
- scenarios
- practice_sessions
- conversation_turns
- roleplay_checkpoints
- evaluations
- criterion_scores
- manager_reviews
- progress
- AI logs
- telemetry

Phối hợp với Duy về business fields trong Role-play tables.
Phối hợp với Đạt về corpus metadata.

#### 11. Shared platform
Phụ trách:

```text
backend/platform/
├── database.py
├── llm_client.py
├── logging.py
├── config.py
├── errors.py
└── dependencies.py
```

Bao gồm:
- database connection
- shared LLM client
- environment configuration
- logging
- API error handling
- backend deployment

#### 12. Integration responsibilities
Với Duy:
- RoleplayGraph
- knowledge tools
- state persistence
- checkpoints
- practice session lifecycle

Với Đạt:
- corpus metadata
- retrieval evaluation
- policy versioning
- RAG benchmark

Với An:
- API contract
- Copilot integration
- Manager APIs
- frontend/backend schemas

### Boundary
Chương phụ trách:
- Copilot
- RAG runtime
- retrieval
- reranking
- citations
- knowledge services
- policy versioning infrastructure
- shared tools
- shared backend platform
- FastAPI platform
- PostgreSQL/pgvector
- checkpointing
- persistence
- session recovery
- Role-play tool nodes
- evaluation persistence
- manager APIs
- backend deployment

Cần phối hợp với Duy trước khi thay đổi:
- Role-play business transitions
- RoleplayState semantics
- customer behavior
- role-play prompts
- scenario behavior
- evaluation reasoning

Cần phối hợp với Đạt trước khi thay đổi:
- ground-truth format
- evaluation datasets
- benchmark definitions
- corpus labeling conventions

Cần phối hợp với An trước khi thay đổi:
- frontend-facing API schemas
- response payloads
- UI-required fields

---

# 3. Đạt — Data, Evaluation, Benchmark & Product Evidence

### Trách nhiệm chính
Phụ trách:
- knowledge datasets
- product/policy corpus
- sales conversation data
- objection data
- scenario evidence
- benchmark datasets
- ground truth
- evaluation harness
- RAG evaluation
- Role-play evaluation
- Judge calibration
- HITL evaluation analysis

### Gate 1
Định nghĩa:
- knowledge/data source plan
- dataset feasibility
- product/policy corpus requirements
- sales dialogue data requirements
- scenario-data requirements
- evaluation strategy
- ground-truth strategy
- policy-versioning data requirements
- benchmark structure
- success metrics

Hỗ trợ `BRIEF.md` bằng problem/data evidence.
Hỗ trợ `PRD.md` bằng measurable requirements.
Co-own rubric với Duy.

### Build responsibilities

#### 1. Product / policy corpus
Chuẩn bị và normalize:
- vehicle information
- product specifications
- price information
- battery information
- promotion policies
- sales policies
- FAQs
- sales playbooks

Data format:
- document_id
- title
- document_type
- product_model
- policy_type
- effective_date
- expiry_date
- source
- version
- status
- content

Cung cấp normalized data cho ingestion pipeline của Chương.

#### 2. Sales dialogue / objection data
Thu thập và structure:
- customer objections
- buyer intents
- common customer questions
- discovery questions
- follow-up questions
- sales responses
- good response patterns
- bad response patterns
- customer personas
- conversation stages
- closing patterns

#### 3. Scenario dataset
Co-own scenario content với Duy.

Đạt phụ trách data/evidence side:
- scenario source
- persona attributes
- buyer intent
- objection library
- difficulty metadata
- target skills
- expected facts
- reference response patterns
- expected discovery points

Duy phụ trách runtime behavior.

#### 4. Copilot evaluation dataset
Tạo benchmark:
- single-product facts
- multi-product comparison
- current policies
- expired policies
- promotions
- battery policies
- multi-document questions
- unsupported questions
- conflicting information
- date-sensitive questions

Initial benchmark:

```text
20–30+ grounded questions
```

#### 5. RAG evaluation
Theo dõi:
- retrieval hit rate
- Recall@K
- citation correctness
- answer groundedness
- unsupported-query abstention
- policy-version correctness

Chạy trên Copilot implementation của Chương.

#### 6. Role-play benchmark
Tạo tests:
- persona consistency
- objection consistency
- hidden-information disclosure
- conversation-stage behavior
- adaptive response behavior
- difficulty behavior
- policy grounding
- termination behavior

Chạy cùng Duy.

#### 7. Judge / evaluator calibration
Chuẩn bị expert-labelled transcripts.

Initial target:

```text
≥20 annotated cases
```

Với mỗi rubric criterion:
- expert score
- expert evidence
- expert rationale
- expected weakness

Metrics:
- MAE
- criterion-level agreement
- weighted agreement
- rank correlation

#### 8. HITL evaluation
Phân tích:
- AI score
- manager score
- AI evidence
- AI rationale
- manager correction
- manager note

Dùng cho evaluator calibration.

#### 9. Evaluation harness
Phụ trách:

```text
eval/
├── copilot_eval/
├── retrieval_eval/
├── roleplay_eval/
├── judge_eval/
├── datasets/
└── reports/
```

Automate repeatable evaluation runs khi khả thi.

#### 10. Integration responsibilities
Với Duy:
- scenario data
- objection library
- rubric
- Role-play benchmark
- judge calibration

Với Chương:
- corpus schema
- metadata
- policy versioning data
- retrieval benchmark
- Copilot evaluation

Với An:
- evaluation result semantics
- progress metrics
- manager-review analysis
- dashboard data definitions

### Boundary
Đạt phụ trách:
- source data
- normalized corpus
- scenario evidence
- benchmark datasets
- ground truth
- evaluation metrics
- evaluation scripts
- evaluation reports
- judge calibration

Không tự ý thay đổi:
- Copilot runtime
- RoleplayGraph runtime
- production prompts
- FastAPI implementation
- database infrastructure
- frontend components

Evaluation findings chuyển cho owner tương ứng.

---

# 4. An — Frontend, Product UX & Client Integration

### Trách nhiệm chính
Phụ trách:
- Advisor frontend
- Manager frontend
- Copilot UI
- Scenario Selection
- Practice Room
- Session Results
- History
- Progress Dashboard
- Manager Review
- frontend API integration
- frontend telemetry

### Gate 1
Phụ trách:

```text
WIREFRAME_UI_FLOW.md
```

Định nghĩa:
- Advisor journey
- Training Manager journey
- navigation
- Copilot interaction
- Scenario Selection
- Practice Room
- Session Result
- History
- Progress
- Manager Review
- score-editing flow
- approval flow

Draft frontend/backend contracts với Chương.

### Build responsibilities

#### 1. Frontend architecture
Phụ trách:

```text
frontend/src/
├── api/
├── types/
├── hooks/
├── components/
├── pages/
└── features/
```

Tạo typed API clients và reusable hooks.

#### 2. Advisor Home
Cung cấp:
- Copilot
- Practice
- History
- Progress

#### 3. Copilot UI
Implement:
- question input
- conversation history
- grounded answer
- citation cards
- source detail
- effective-date display
- unsupported-answer state
- loading state
- error state
- suggested follow-up questions

Integrate:

```text
POST /copilot/query
GET /copilot/sources/{id}
```

#### 4. Scenario Selection
Hiển thị:
- scenario title
- persona
- difficulty
- training objective
- target skills
- estimated duration

Start session bằng:

```text
POST /practice/sessions
```

#### 5. Practice Room
Implement:
- AI Customer messages
- advisor messages
- conversation history
- scenario context
- session state
- finish action
- error handling
- retry

Integrate:

```text
POST /practice/sessions
POST /practice/{id}/message
POST /practice/{id}/finish
```

Giữ continuous multi-turn session context.

#### 6. Session Result
Hiển thị:
- overall result
- Need Discovery
- Product Knowledge
- Objection Handling
- Policy Accuracy
- Closing / Next Step

Với mỗi criterion:
- score
- evidence
- reason
- improvement suggestion

Cung cấp transcript view.

#### 7. Manager Review
Implement:
- Pending Reviews
- Review Detail
- Transcript
- AI Scores
- Evidence
- Manager Score Editing
- Manager Notes
- Approve

Integrate:

```text
GET /manager/reviews
PATCH /manager/reviews/{id}
```

#### 8. Progress Dashboard
Hiển thị:
- sessions completed
- scores over time
- criterion-level performance
- weak skills
- manager-reviewed scores
- practice history

#### 9. UX telemetry
Capture:
- session_started
- session_finished
- message_sent
- copilot_query
- source_clicked
- practice_abandoned
- retry_triggered
- manager_score_edited
- manager_review_approved

Phối hợp persistence với Chương.
Phối hợp analysis với Đạt.

#### 10. Integration responsibilities
Với Duy:
- Practice Room behavior
- role-play session states
- customer interaction
- Session Result semantics

Với Chương:
- API contracts
- Copilot integration
- Manager integration
- authentication/API errors

Với Đạt:
- evaluation visualizations
- progress metrics
- dashboard semantics

### Boundary
An phụ trách:
- frontend architecture
- React components
- frontend state
- API client
- Advisor UX
- Manager UX
- visualizations
- frontend telemetry

Cần phối hợp với Chương trước khi thay đổi:
- API schemas
- response structures
- backend contracts

Cần phối hợp với Duy trước khi thay đổi:
- Practice behavior
- Role-play session semantics
- customer interaction rules

Cần phối hợp với Đạt trước khi thay đổi:
- evaluation metric meaning
- dashboard metric meaning
- score interpretation

Không tự ý thay đổi:
- backend implementation
- Copilot reasoning
- Role-play reasoning
- rubric logic
- evaluation formulas
- database schema

---

# 5. Role-play Ownership Map

| Component | Owner | Support |
|---|---|---|
| Customer persona | Duy | Đạt |
| Customer behavior | Duy | Chương |
| Scenario runtime logic | Duy | Đạt |
| Conversation stages | Duy | Chương |
| Adaptive objections | Duy | Đạt |
| RoleplayState semantics | Duy | Chương |
| `RoleplayGraph` | Duy + Chương | — |
| Customer-turn node | Duy | Chương |
| Turn-analysis node | Duy | Chương |
| State-transition logic | Duy | Chương |
| Knowledge/tool node | Chương | Duy |
| Checkpoint node | Chương | Duy |
| Persistence node | Chương | Duy |
| Session recovery | Chương | Duy |
| Knowledge grounding | Chương | Duy + Đạt |
| Evaluation reasoning | Duy | Đạt |
| Evaluation calibration | Đạt | Duy |
| Evaluation persistence | Chương | Duy |
| Practice start API | Duy | Chương |
| Practice message API | Duy | Chương |
| Practice finish API | Chương | Duy |
| Evaluation result API | Chương | Duy |
| Practice Room UI | An | Duy |
| Result UI | An | Duy + Đạt |

---

# 6. Copilot Ownership Map

| Component | Owner | Support |
|---|---|---|
| Copilot behavior | Chương | Duy |
| Copilot LangGraph | Chương | Duy |
| Intent routing | Chương | Duy |
| Retrieval | Chương | Đạt |
| Reranking | Chương | Đạt |
| Metadata filtering | Chương | Đạt |
| Policy/version filtering | Chương | Đạt |
| Grounded generation | Chương | Duy |
| Citation validation | Chương | Đạt |
| Abstention | Chương | Đạt |
| Knowledge corpus | Đạt | Chương |
| Copilot benchmark | Đạt | Chương |
| Copilot UI | An | Chương |
| Sales-use-case taxonomy | Duy + Chương | Đạt |

---

# 7. Shared Platform Ownership Map

| Component | Owner | Support |
|---|---|---|
| FastAPI platform | Chương | Duy + An |
| PostgreSQL | Chương | Đạt |
| pgvector | Chương | Đạt |
| Shared LLM client | Chương | Duy |
| Shared logging | Chương | Cả team |
| AI-call logging | Chương | Cả team |
| Deployment | Chương | An |
| Shared knowledge tools | Chương | Duy |
| Role-play checkpointing | Chương | Duy |
| Role-play persistence | Chương | Duy |
| Practice business API | Duy | Chương |
| Manager API | Chương | An |
| API contract | Chương + An | Duy |
| Frontend integration | An | Chương + Duy |

---

# 8. Evaluation Ownership Map

| Component | Owner | Support |
|---|---|---|
| Rubric | Duy + Đạt | Chương |
| Ground truth | Đạt | Duy |
| Corpus benchmark | Đạt | Chương |
| Retrieval benchmark | Đạt | Chương |
| Role-play benchmark | Đạt | Duy |
| Judge benchmark | Đạt | Duy |
| Evaluation reasoning | Duy | Đạt |
| Evaluation persistence | Chương | Duy |
| Manager correction data | Đạt | Chương + An |
| E2E evaluation | Đạt | Cả team |

---

# 9. Gate 1 Task Ownership

| Deliverable / Task | Owner | Support |
|---|---|---|
| `BRIEF.md` | Duy | Đạt |
| `PRD.md` | Duy | Chương + Đạt |
| `WIREFRAME_UI_FLOW.md` | An | Duy |
| Role-play specification | Duy | Đạt + Chương |
| Copilot specification | Chương | Duy |
| Architecture diagram | Chương | Duy |
| Scenario specification | Duy | Đạt |
| Rubric skeleton | Duy + Đạt | Chương |
| Data/source plan | Đạt | Chương |
| Evaluation plan | Đạt | Duy + Chương |
| API contracts | Chương + An | Duy |
| Database model draft | Chương | Đạt + Duy |
| GitHub repo setup | Chương | Cả team |
| AI Log setup | Chương | Cả team |
| Final Gate-1 consistency check | Duy | Cả team |

---

# 10. Build Ownership by Phase

| Phase | Duy | Chương | Đạt | An |
|---|---|---|---|---|
| **Gate 1** | Product + Role-play specification | Copilot + architecture | Data + evaluation plan | Wireframe/UI Flow |
| **Walking Skeleton** | Basic RoleplayGraph + Practice API | Platform + graph runtime + persistence | Test fixtures | React shell + mocks |
| **Knowledge Layer** | Role-play knowledge requirements | Knowledge service + RAG | Corpus preparation | Source/citation UI |
| **Copilot** | Sales behavior support | Copilot lead | Copilot benchmark | Copilot UI |
| **Role-play** | AI Customer lead | Runtime/tools/checkpoint/persistence | Scenario dataset | Practice Room |
| **Evaluator** | Evaluation reasoning | Evaluation backend/persistence | Calibration + benchmark | Results UI |
| **Manager HITL** | Coaching semantics | Manager APIs | AI-vs-manager analysis | Manager UI |
| **Progress** | Skill semantics | Progress backend | Metric definition | Dashboard |
| **Final Integration** | Role-play fixes | Platform/Copilot fixes | E2E evaluation | UX/E2E fixes |

---

# 11. Code Ownership

## Duy

```text
backend/
├── roleplay/
│   ├── graph.py
│   ├── state.py
│   ├── customer_agent.py
│   ├── scenario_loader.py
│   ├── turn_analyzer.py
│   ├── evaluator.py
│   └── prompts/
│
├── api/
│   └── practice_chat.py
│
└── services/
    └── practice_service.py
```

`roleplay/graph.py` là shared file với Chương.

## Chương

```text
backend/
├── copilot/
│   ├── graph.py
│   ├── state.py
│   ├── prompts.py
│   ├── intent_router.py
│   ├── retrieval.py
│   ├── reranker.py
│   ├── answer_generator.py
│   ├── citation_validator.py
│   └── guardrails.py
│
├── knowledge/
│   ├── ingestion.py
│   ├── chunking.py
│   ├── embeddings.py
│   ├── vector_store.py
│   ├── metadata.py
│   ├── policy_versioning.py
│   └── retrieval_service.py
│
├── roleplay/
│   ├── checkpoint.py
│   ├── persistence.py
│   └── knowledge_tools.py
│
├── api/
│   ├── copilot.py
│   ├── practice_result.py
│   └── manager.py
│
└── platform/
    ├── database.py
    ├── llm_client.py
    ├── logging.py
    ├── config.py
    ├── errors.py
    └── dependencies.py
```

## Đạt

```text
data/
├── raw/
├── processed/
├── knowledge/
├── scenarios/
└── evaluation/

scripts/
├── normalize/
├── validate/
└── prepare_eval/

eval/
├── copilot_eval/
├── retrieval_eval/
├── roleplay_eval/
├── judge_eval/
├── datasets/
└── reports/
```

## An

```text
frontend/src/
├── api/
├── types/
├── hooks/
├── components/
├── pages/
├── features/
│   ├── copilot/
│   ├── practice/
│   ├── results/
│   ├── manager/
│   └── progress/
└── telemetry/
```

---

# 12. Shared Interfaces

## Duy ↔ Chương
- RoleplayGraph
- RoleplayState interface
- knowledge-tool interface
- checkpoint interface
- session lifecycle
- evaluation result contract

## Duy ↔ Đạt
- scenario schema
- persona data
- objection library
- rubric
- Role-play benchmark
- judge calibration

## Duy ↔ An
- Practice Room
- session states
- AI Customer interaction
- Result semantics

## Chương ↔ Đạt
- corpus schema
- metadata
- policy versions
- retrieval benchmark
- Copilot evaluation

## Chương ↔ An
- API contracts
- Copilot API
- Manager API
- frontend/backend schemas

## Đạt ↔ An
- evaluation display
- progress metrics
- manager correction data
- dashboard semantics
