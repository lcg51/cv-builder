# TDD Test Creation Prompt (Structured)

## Prompt Template (Role, Task, Context, Expectations)

```markdown
Role: Act as a staff-level QA engineer and TDD-focused software developer who designs robust, maintainable automated tests aligned to a design document.

Task: Create a comprehensive automated test suite using Test-Driven Development (TDD) based on the provided design document. Outline the RED-GREEN-REFACTOR cycle for each unit of work and propose test structure and coverage.

Required Context:
- Design document (functional and non-functional requirements): [DESIGN_DOCUMENT_CONTENT]
- Target language, framework, and test runner: [LANGUAGE_AND_FRAMEWORK]
- System boundaries and integration points: [SYSTEM_BOUNDARIES]
- Data stores and models: [DATA_MODELS]
- Authentication/authorization approach: [AUTH]
- Performance and security requirements: [PERF_AND_SECURITY]
- Environments and CI constraints: [ENV_AND_CI]

Expectations and Goals:
1) Test Strategy Overview
   - Test pyramid guidance, scope boundaries, mocking/stubbing policy, fixtures/factories plan

2) Unit Tests
   - Per component/function: inputs/outputs, edge cases, error conditions, state transitions
   - Template example in chosen framework

3) Integration/Contract/API Tests
   - Component interaction scenarios, API endpoint contracts, schema validation, authZ/authN cases

4) Data Model Tests
   - Validation rules, constraints, referential integrity, migration checks

5) Performance and Reliability Tests
   - Latency/throughput targets, concurrency tests, timeouts, retries, idempotency

6) Security Tests
   - Input sanitization, access control, common vuln checks (e.g., injection, SSRF patterns)

7) Coverage and Traceability
   - Map tests to requirements (traceability matrix), define coverage goals and meaningful metrics

8) Test Data Management
   - Fixtures/factories, seeding strategy, isolation, deterministic tests, time/clock control

9) TDD Workflow Plan
   - Break down features into test-first tasks with RED/GREEN/REFACTOR notes

10) CI Integration
   - Commands, parallelization/sharding, flake management, reporting, coverage publishing

Authoring Guidelines:
- Write tests before implementation; keep each test focused and descriptive
- Prefer deterministic tests; mock external dependencies; avoid network calls unless required
- Use AAA (Arrange, Act, Assert) and given-when-then naming
- Keep tests independent and idempotent; clean up resources
- Measure coverage but prioritize meaningful assertions
```

## Usage Example

```markdown
Role: Act as a staff-level QA engineer and TDD-focused software developer who designs robust, maintainable automated tests aligned to a design document.

Task: Create a comprehensive automated test suite using TDD for the notification system described in the design doc.

Required Context:
- DESIGN_DOCUMENT_CONTENT: [paste design doc]
- LANGUAGE_AND_FRAMEWORK: TypeScript + Node.js, Jest + Supertest
- SYSTEM_BOUNDARIES: Notification service with adapters for email/SMS/push
- DATA_MODELS: Message, Template, DeliveryLog
- AUTH: Service-to-service token, per-endpoint scopes
- PERF_AND_SECURITY: P99 latency < 2s, rate limiting, input validation
- ENV_AND_CI: GitHub Actions, Node 20, PostgreSQL test container

Expectations and Goals: Provide the sections 1–10 above, including example test blocks and commands to run in CI.
```
