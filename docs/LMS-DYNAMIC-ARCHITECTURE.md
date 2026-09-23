# Dynamic LMS & Interactive Curriculum Architecture

## Overview
Ethiroli LMS has transitioned from static, hard-coded course modules into a **100% database-driven, reactive, and modular architecture** designed for high engagement, real-time instructor-student synchronization, and automated assessment grading.

---

## 4 Core Architectural Pillars

### 1. Dynamic Module & Lesson Architecture
- **Non-blocking Reordering:** Both course modules and lessons support atomic drag-and-drop or order-key reordering (`POST /v1/courses/:courseId/modules/reorder` and `POST /v1/modules/:moduleId/lessons/reorder`) via database transactions.
- **Hierarchical Tree:** Courses -> Modules -> Lessons -> Lesson Blocks.
- **Bulk Import & Export:** Full curriculum hierarchies can be exported to JSON and imported in bulk (`GET /v1/courses/:id/export` and `POST /v1/courses/:id/import`), instantly replicating whole course trees without manual input.

### 2. Polymorphic Lesson Content Blocks
Lessons are no longer limited to a single static text or video field. Each lesson contains ordered **`lesson_blocks`**:
- `VIDEO`: Embedded streaming or direct video players.
- `MARKDOWN`: Formatted technical documentation, guides, and theory.
- `CODE_PLAYGROUND`: Interactive editable code editor for live student practice.
- `RESOURCE_DOWNLOAD`: Associated project files, starter repos, and downloadable assets.

### 3. Centralized Question Bank & Server-Side Evaluation
- **Reusable Question Repository:** Questions are authored independently in `question_bank` with associated `question_options`, difficulty ratings, topics, and detailed explanations.
- **Zero Client-Side Leaks:** When students fetch a quiz (`GET /v1/quizzes/:id/take`), the server sanitizes all option payloads to strictly omit `is_correct`.
- **Instant Server-Side Grading:** Submissions (`POST /v1/quizzes/:id/submit`) compute points and percentages against the validated question database, return itemized question-by-question feedback, and record official results in `quiz_attempts`.
- **Bulk Question Import:** Instructors can import batches of standardized questions with options via `POST /v1/question-bank/bulk-import`.

### 4. Real-Time Synchronization & Granular Progress Rollups
- **WebSocket Broadcasts:** Instant socket alerts notify students when curriculum changes (`course_content_updated`), while tutors are notified when students complete lessons or quizzes.
- **Granular Progress Rollups:** When a student marks a lesson completed (`POST /v1/lessons/:id/complete`), the backend atomically recalculates completion percentage across all lessons in the course and updates `enrollments.progress_percentage`.

---

## API Reference Summary

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| `GET` | `/v1/courses/:id/modules` | Fetch all dynamic modules for course | All |
| `POST` | `/v1/courses/:id/modules` | Create dynamic module | Tutor, Admin |
| `POST` | `/v1/courses/:id/modules/reorder` | Atomically reorder modules | Tutor, Admin |
| `POST` | `/v1/modules/:id/lessons` | Create lesson with content blocks | Tutor, Admin |
| `POST` | `/v1/modules/:id/lessons/reorder` | Atomically reorder lessons | Tutor, Admin |
| `POST` | `/v1/lessons/:id/complete` | Mark lesson completed + progress rollup | Student, Intern |
| `GET` | `/v1/courses/:id/export` | Export entire course curriculum tree | Tutor, Admin |
| `POST` | `/v1/courses/:id/import` | Bulk import curriculum tree | Tutor, Admin |
| `GET` | `/v1/question-bank` | List questions in Question Bank | Tutor, Admin |
| `POST` | `/v1/question-bank` | Create question with options | Tutor, Admin |
| `POST` | `/v1/question-bank/bulk-import` | Bulk import questions | Tutor, Admin |
| `GET` | `/v1/quizzes/:id/take` | Fetch sanitized quiz questions | Student, Intern |
| `POST` | `/v1/quizzes/:id/submit` | Submit quiz for server evaluation | Student, Intern |

---

## Verification
The entire architecture is verified by `scratch/test-lms-dynamic.cjs` with 15/15 integration tests passing end-to-end.
