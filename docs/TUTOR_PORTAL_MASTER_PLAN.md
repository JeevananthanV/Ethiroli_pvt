# Ethiroli Tutor & LMS Portal — Master Architecture & Implementation Plan

---

## 1. Executive Summary & Vision

The **Ethiroli Tutor & Learning Management System (LMS) Portal** is the central academic teaching, authoring, and evaluation engine for Ethiroli Pvt Ltd. 

The goal of this master plan is to ensure the platform reliably answers **five core educational questions for every learner**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       5 CORE LMS LEARNING QUESTIONS                         │
├────────────────────────────────┬────────────────────────────────────────────┤
│ 1. WHAT SHOULD THEY LEARN?     │ Curriculum: Course → Phase → Module → Day  │
│ 2. DID THEY LEARN IT?          │ Tracking: Content, Video %, Lesson Status  │
│ 3. DID THEY UNDERSTAND IT?     │ Assessment: Question Bank, Quizzes, Auto   │
│ 4. DID THEY APPLY IT?          │ Application: Assignments, Code Sandbox     │
│ 5. ARE THEY ON TRACK?          │ Analytics: At-Risk Alerts, Progress %, SLA │
└────────────────────────────────┴────────────────────────────────────────────┘
```

---

## 2. Phased Implementation Roadmap

```text
Phase 1: Academic Dashboard & Faculty Navigation
  ├── Learning KPIs (Active Courses, Batches, Total Students, Reviews Due)
  ├── Today's Live Class Timetable & Launch Links
  └── Real-Time "Needs Attention" / Students-at-Risk Queue
        ↓
Phase 2: Day-Based Curriculum & Polymorphic Content Builder
  ├── 30/45/60-Day Hierarchical Tree (Course → Phase → Module → Day)
  ├── Content Blocks (Markdown, Video Player, Code Sandbox, Downloadables)
  └── Day Unlocking Engine (Scheduled Release / Pre-requisite Rules)
        ↓
Phase 3: Question Bank & Quiz Management Engine
  ├── Question Repository (Tags, Difficulty, Explanation, Marks)
  ├── Quiz Builder (Time Limit, Pass Score %, Randomization, Anti-Cheating)
  └── Granular Attempt Tracker (Question-level responses & grading)
        ↓
Phase 4: Student 360° Learning Hub & At-Risk Heuristics
  ├── Multi-Dimensional Progress (Phase 1/2/3, Video %, Quiz Avg, Tasks)
  ├── Automated "At-Risk" Flagging (Inactivity, Failed Quizzes, Overdue)
  └── Student 360° Inspection Drawer
        ↓
Phase 5: Assignment Studio & Code Review Pipeline
  ├── Rubric Authoring & Day-Level Association
  ├── Student Code/File Submissions
  └── Grading Workflow: Score, Feedback, or Request Revision
        ↓
Phase 6: Batch Cohort Management & Live Classrooms
  ├── Batch Analytics (Average Progress, Attendance %, Pass Rates)
  ├── Live Attendance Logging
  └── Google Meet / Zoom Classroom Integration
        ↓
Phase 7: Certificate Eligibility & HR Clearance Handshake
  ├── Automated Rule Validation (90% Content, 80% Quiz, Capstone Pass)
  └── 1-Click "Authorize & Submit to HR" Pipeline
        ↓
Phase 8: Academic Reports & Analytics
  ├── Course, Batch, Student, Quiz, and Certificate Reports
  └── 1-Click CSV & PDF Export
```

---

## 3. Detailed Module Workflows & Specifications

### 3.1. Faculty Dashboard (`/app/tutor/dashboard`)
- **Metric Cards**:
  1. `Active Courses` (30/45/60-Day Programs)
  2. `Active Batches` (Current learning cohorts)
  3. `Total Enrolled Students`
  4. `Pending Assignment Reviews`
  5. `Quiz Attempts Today`
  6. `Assignments Due Soon`
  7. `Students At Risk` (High-priority warning card)
  8. `Live Sessions Today`
- **Widgets**:
  - **Live Class Schedule**: Topic, cohort code, scheduled time, and 1-click **Launch Class** button.
  - **Needs Attention Queue**: Real-time table of learners lagging in progress or scoring $<50\%$ on assessments with instant support shortcuts.
  - **Faculty Quick Actions**: Shortcuts to Lesson Builder, Quiz Creator, Assignment Reviewer, and Reports.

---

### 3.2. Hierarchical Day-Based Curriculum (`/app/tutor/curriculum`)
- **Structure**:
  ```text
  Course (e.g. MERN Full Stack — 30 Days)
  └── Phase 1: Frontend Engineering (Days 1–10)
       └── Module 1: HTML5 & Semantic Web (Days 1–4)
            ├── Day 1: HTML Architecture & Semantic Tags
            │    ├── Lesson 1: Semantic Elements
            │    ├── Markdown Block: Architecture & Standards
            │    ├── Video Block: Stream (32 mins)
            │    ├── Code Sandbox: Starter HTML Drill
            │    ├── Downloadable Asset: Boilerplate (.zip)
            │    ├── Day 1 Quiz (5 Questions)
            │    └── Day 1 Task (Semantic Portfolio Skeleton)
            ├── Day 2: Form Controls & Validations
            ├── Day 3: Tables & Accessibility (ARIA)
            └── Day 4: HTML5 Capstone Project
  ```
- **Unlocking Configuration**:
  - `IMMEDIATE`: Open to all enrollees.
  - `AFTER_PREVIOUS_PASSED`: Unlocks only when prior Day quiz is passed ($\ge 70\%$).
  - `SCHEDULED_DATE`: Unlocks on a specific calendar day (e.g., Day 1 = Sep 1, Day 2 = Sep 2).
  - `TUTOR_MANUAL`: Tutor unlocks on-demand for cohort.

---

### 3.3. Question Bank & Quiz Management (`/app/tutor/question-bank`, `/app/tutor/quizzes`)
- **Question Bank Attributes**:
  - `question_text`, `question_type` (MCQ, Multi-Select, Code Output, True/False)
  - `options` (Option choices with explanation notes)
  - `difficulty` (`EASY`, `MEDIUM`, `HARD`), `marks`, `negative_marks`
  - `topic`, `course_id`, `day_number`, `tags`
- **Quiz Builder Engine**:
  - Title, Course, Module, and Day assignment.
  - Duration limit, pass percentage, max attempts.
  - Randomize question order & choice order.
  - Show answers & explanations upon submission toggle.
- **Student Attempt Records**:
  - Student identity, duration taken, percentage score, pass/fail result.
  - Itemized answer inspect modal: Selected options vs correct answers with inline rationales.

---

### 3.4. Student 360° Learning Hub & At-Risk Engine (`/app/tutor/students`)
- **Multi-Dimensional Metrics**:
  - `Overall Course Progress %`
  - `Phase Breakdown` (Phase 1 %, Phase 2 %, Phase 3 %)
  - `Video Watch Rate %` (Aggregated seconds watched across lessons)
  - `Quiz Average Score %` & Quizzes Completed Ratio
  - `Assignment Submission Ratio` & Grades
  - `Live Class Attendance Rate %`
- **Automated At-Risk Criteria**:
  - Triggered if: Quiz Average $< 50\%$ OR Inactive $> 4$ days OR Overdue Tasks $\ge 3$.
- **Certificate Eligibility Gate**:
  - Checks 6 criteria: Content $\ge 90\%$, Quiz Completion $\ge 80\%$, Quiz Avg $\ge 65\%$, Assignment $\ge 85\%$, Attendance $\ge 75\%$, Capstone Passed.
  - 1-click **"Authorize & Submit to HR"** pushes record to HR Helpdesk queue for official certificate generation.

---

### 3.5. Assignment Studio (`/app/tutor/assignments`)
- **Authoring**: Title, rubric description, max points, due date, target day.
- **Review Queue**: Student submissions with repository URLs, uploaded files, and student notes.
- **Actions**:
  - `Approve & Grade`: Assign numerical score + constructive faculty remarks.
  - `Request Revision`: Send task back with specific improvement points.

---

### 3.6. Cohort Batch Management (`/app/tutor/batches`)
- Batch capacity, active students count, start and end dates.
- Cohort average progress rate, quiz score average, and attendance score.
- Daily attendance logging with 1-click mark all present/absent.

---

### 3.7. Academic Reports & Analytics (`/app/tutor/reports`)
- Multi-tab exports:
  1. Course Performance Report
  2. Cohort Batch Report
  3. Student Progress Tracker
  4. Certificate Clearance Queue
- Instant **1-Click CSV Download** with formatted headers.

---

## 4. API & Database Blueprint

### 4.1. Core Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/v1/tutor/dashboard-stats` | Aggregated KPIs, today's classes, students at risk |
| `GET` | `/v1/tutor/quiz-attempts` | Full student quiz attempt logs with itemized answers |
| `GET` | `/v1/courses` | List of assigned courses |
| `GET` | `/v1/courses/:id/modules` | Course hierarchical curriculum tree |
| `POST` | `/v1/courses/:id/modules` | Create course module / day |
| `POST` | `/v1/modules/:id/lessons` | Create lesson with content blocks |
| `GET` | `/v1/question-bank` | List categorized questions |
| `POST` | `/v1/question-bank` | Create question with options |
| `GET` | `/v1/quizzes` | List published and draft quizzes |
| `POST` | `/v1/quizzes` | Author new quiz |
| `PATCH` | `/v1/quizzes/:id/publish` | Toggle quiz publish state |
| `GET` | `/v1/assignments` | List course assignments |
| `POST` | `/v1/assignments/grade` | Grade or request revision for submission |
| `POST` | `/v1/hr-requests` | Forward certificate clearance to HR |

---

## 5. Implementation Status Checklist

- [x] **Tutor Navigation & Sidebar Config** (`Quiz Management` and `Reports` registered)
- [x] **Faculty Dashboard** (8 LMS KPI cards, today's classes, needs attention queue)
- [x] **Quiz Management Page** (Builder, Published Quizzes, Attempts log, Analytics)
- [x] **Question Bank Upgrades** (Difficulty, Topic, Day, Explanations, Marks)
- [x] **Student Learning Hub** (360° drawer, Phase breakdown, Video watch %, At-risk alerts)
- [x] **Certificate Eligibility Engine** (Multi-metric threshold check + HR push)
- [x] **Academic Reports Page** (Course, Batch, Student, Certificate reports with CSV export)
- [x] **Backend API Routes & Controllers** (`/dashboard-stats`, `/quiz-attempts`)
- [x] **Full-Stack Build Sync** (Vite build passed, synced to `backend/public/`)

---

*Last Updated: 2026-09-30 | Ethiroli Pvt Ltd Academic Learning & Faculty System*
