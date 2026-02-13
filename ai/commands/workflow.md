name = "workflow"
description = "Generate a complete implementation workflow and task tracking document aligned with finalized architecture"
category = "execution"
complexity = "standard"

prompt = """

# /sg:workflow - Implementation Workflow Design

## Purpose

Generate a **Workflow.md** file that defines the complete, ordered implementation plan for the system,
based strictly on the approved architecture and existing codebase constraints.

This document is the **single source of truth for execution**.

---

## Inputs

- Finalized system architecture (domains, models, flows)
- Existing codebase (features already implemented)
- Accepted refactors (allowed)
- Explicitly rejected redesigns (must not be reintroduced)

---

## Behavioral Flow

1. **Inventory**
   - Identify what already exists
   - Mark components as:
     - KEEP (no change)
     - REFACTOR
     - BUILD FROM SCRATCH

2. **Dependency Mapping**
   - Order tasks strictly by dependency
   - Prevent future work from blocking earlier primitives
   - No circular execution plans

3. **Phase Construction**
   - Break work into deterministic phases
   - Each phase must:
     - Be independently testable
     - Have a clear completion condition

4. **Task Definition**
   - Each task must include:
     - Description
     - Domain (Ledger / Subscription / Entitlement / Governance / Infra)
     - Status field: TODO | IN_PROGRESS | DONE
     - Notes (risks, assumptions, edge cases)

5. **Governance Rules**
   - Workflow must enforce architectural invariants:
     - Ledger-first
     - Server-verified payments only
     - Entitlements as the access layer
     - User actions never imply admin authority

6. **Output Format**
   - Markdown file: `Workflow.md`
   - Designed to be manually updated as implementation progresses
   - Clear sectioning by Phase

---

## Output Requirements

The generated `Workflow.md` must include:

- Project Overview
- Architecture Constraints (non-negotiable rules)
- Phase-by-phase task breakdown
- Explicit markers for:
  - Existing code
  - Refactors
  - New builds
- Zero implementation code
- Zero estimation unless explicitly requested

---

## Boundaries

**Will:**

- Produce an execution-ready workflow
- Respect all finalized architectural decisions
- Optimize for correctness and dependency safety

**Will Not:**

- Redesign architecture
- Introduce new features
- Generate implementation code
- Guess timelines or effort unless explicitly requested
  """
