# Ethiroli Tutor & LMS Platform — System Specification & Architectural Blueprint

---

## 1. Executive Summary & Core Objective

The **Ethiroli Tutor / LMS Portal** is the core educational authoring, delivery, and evaluation engine of the Ethiroli ecosystem. While the HR portal manages admissions, tuition fee verification, and official certification clearances, the **LMS / Tutor Portal** is dedicated to answering five fundamental questions for every student:

```text
1. WHAT SHOULD THEY LEARN?
   └── Curriculum Hierarchy: Course → Phase → Module → Day → Content / Lesson

2. DID THEY LEARN IT?
   └── Activity Tracking: Reading, Video Watched %, Lesson Completed

3. DID THEY UNDERSTAND IT?
   └── Assessment: Question Bank → Quizzes → Auto-Evaluation → Attempt History

4. DID THEY APPLY IT?
   └── Practice & Execution: Assignments, Code Drills, Capstone Projects

5. ARE THEY PROGRESSING PROPERLY?
   └── Analytics: Student Progress %, Batch Analytics, Students-at-Risk Alerts
```

---

## 2. Portal Structure & Navigation

Rather than bloating the interface with unnecessary sub-menus, the Tutor portal focuses on high-impact workflows:

```text
TUTOR & LMS PORTAL
│
├── 📊 Dashboard                    (Learning KPIs, Today's Sessions, Needs Attention)
│
├── 📚 Courses                      (Course Master & Course Analytics)
│
├── 👥 Batches                      (Batch Directory, Batch Analytics & At-Risk Ratios)
│
├── 🏗️ Curriculum                   (Course → Phase → Module → Day → Lesson & Content Builder)
│
├── 🎓 Students                     (Detailed Progress Breakdown, Quiz Scores, Submissions)
│
├── 📝 Assignments                  (Assignment Authoring, Submissions & Review Workflow)
│
├── ❓ Question Bank                 (Categorized Questions, Explanations, Difficulty, Tags)
│
├── ⚡ Quiz Management               (Quiz Builder, Attempts, Question-Level Results & Analytics)
│
├── 💬 Forum                        (Course Doubts & Technical Q&A)
│
├── 📢 Communications               (Batch Announcements & Messages)
│
├── 📅 Calendar                     (Live Sessions, Code Reviews & Deadlines)
│
└── 📈 Reports                      (Course, Batch, Quiz, Assignment & Completion Reports)
```

---

## 3. Curriculum Architecture: Day-Based Structured Learning

Because Ethiroli runs rigorous **30-Day, 45-Day, and 60-Day** intensive programs (such as Full Stack Web Development and AI/Data Science), curriculum is structured natively around **Phases, Modules, and Days**:

```text
Course (e.g., Full Stack Developer — 30 Days)
│
├── Course Overview & Pre-requisites
│
├── Phase 1: Frontend Engineering (Days 1–10)
│   │
│   ├── Module 1: HTML5 & Semantic Web (Days 1–4)
│   │   ├── Day 1: HTML Architecture & Page Structure
│   │   │   ├── Lesson 1: Introduction to Semantic Tags
│   │   │   ├── Content Block: Markdown Guide & Cheat Sheet
│   │   │   ├── Video Block: Stream (32 mins)
│   │   │   ├── Code Sandbox: Starter HTML Exercise
│   │   │   ├── Downloadable: Course Assets (.zip)
│   │   │   ├── Day 1 Quiz (5 Questions)
│   │   │   └── Day 1 Task (Build a Semantic Profile Page)
│   │   ├── Day 2: Forms, Inputs & Validations
│   │   ├── Day 3: Tables, Media & Accessibility (ARIA)
│   │   └── Day 4: HTML5 Capstone Drill
│   │
│   ├── Module 2: Modern CSS & Flexbox (Days 5–7)
│   └── Module 3: Modern JavaScript (ES6+) (Days 8–10)
│
├── Phase 2: Backend & Database (Days 11–20)
├── Phase 3: Full Stack Integration & DevOps (Days 21–27)
│
└── Phase 4: Final Capstone Project & Evaluation (Days 28–30)
```

---

## 4. Polymorphic Content Builder

Tutors author complete, interactive lessons using rich, composable content blocks:

### Supported Content Types:
1. **Rich Text / Markdown**: Formatted technical theory, diagrams, and formulas.
2. **Video Streaming**: Video embed / direct player with timestamp checkpoints.
3. **Interactive Code Editor**: In-browser code execution sandbox (JS, Python, HTML/CSS).
4. **PDF Viewer**: Embedded reading material, slide decks, and whitepapers.
5. **Downloadable Resources**: Starter files, dataset CSVs, and project boilerplate repos.
6. **Live Session Links**: Zoom/Google Meet integration with schedule triggers.
7. **Embedded Quiz**: Direct Day-level knowledge checks.
8. **Hands-on Assignment**: Submission upload / GitHub repo link prompt.

### Lesson Completion Rules:
- ☑ Student must read content (min reading time threshold).
- ☑ Student must watch video ($\ge 85\%$ watched percentage).
- ☑ Student must pass Day quiz ($\ge 70\%$ pass mark).
- ☑ Student must submit Day task.

---

## 5. Quiz Management & Question Bank Engine

### 5.1. Question Bank Entity Structure
Each question in the Question Bank contains:
- `question_text`: Markdown-supported question prompt.
- `question_type`: Single Choice (MCQ), Multiple Choice (Multi-Select), True/False, Short Answer, Code Output.
- `options`: Array of choices `{ option_id, text, is_correct }` (server sanitizes `is_correct` when serving to students).
- `explanation`: Detailed educational rationale revealed after submission.
- `marks` & `negative_marks`: Scoring weight.
- `difficulty`: `Easy`, `Medium`, `Hard`.
- `topic`, `module_id`, `day_number`, `tags`.

### 5.2. Quiz Builder Capabilities
Tutors configure:
- Quiz Title, Course, Module, and Day assignment.
- Question Selection: Manual picking or automatic random selection from Question Bank by topic/difficulty.
- Time Limit (e.g., 15 minutes) or Untimed.
- Pass Mark Percentage (e.g., 70%).
- Max Attempts allowed (e.g., 1, 2, or Unlimited).
- Anti-Cheating Controls: Question shuffle, option shuffle, browser tab switch warnings.
- Instant Explanation Display toggle upon submission.

### 5.3. Granular Attempt & Response Tracking
Every student attempt records:
```text
Student Attempt Record
 ├── Attempt ID & Timestamp
 ├── Start Time, End Time & Duration Taken
 ├── Score Obtained / Total Marks (%)
 ├── Result Status (PASSED / FAILED)
 └── Itemized Question Responses:
      ├── Question 1: Selected [B] (Correct) → +1 Mark
      ├── Question 2: Selected [C] (Wrong, Correct was [A]) → 0 Mark
      ├── Question 3: [Skipped] → 0 Mark
      └── Question 4: Selected [A, D] (Correct) → +2 Marks
```

---

## 6. Student Progress & "Students-at-Risk" Analytics

### 6.1. 360° Student Progress Breakdown
Instead of a single flat percentage, the Student Progress view breaks down:
- **Phase Progress**: Phase 1 (100%), Phase 2 (80%), Phase 3 (45%), Phase 4 (0%).
- **Content Metrics**: 42 Completed, 5 In Progress, 13 Pending.
- **Video Metrics**: Total minutes watched, average completion rate ($91\%$).
- **Quiz Performance**: 12/15 Quizzes Taken, 78% Average Score, 83% Pass Rate.
- **Assignment Submissions**: 8 Submitted, 6 Reviewed, 2 Pending.

### 6.2. Automated "Students-at-Risk" Detection
The system automatically tags students needing intervention based on heuristic rules:
- **Rule 1**: Quiz Average $< 50\%$ or 2 consecutive failed attempts.
- **Rule 2**: No LMS login activity for $> 4$ consecutive days.
- **Rule 3**: $\ge 3$ overdue assignments.
- **Rule 4**: Course progress lagging $> 3$ days behind batch schedule.

---

## 7. Assignment Review & Revision Workflow

```text
Create Assignment & Rubric
           ↓
     Publish to Day
           ↓
Student Submission (GitHub URL / File Upload)
           ↓
Tutor Review & Code Inspection
           ↓
   ┌───────┴───────┐
   ▼               ▼
[Request Revision] [Approve & Grade]
   │               │
   ▼               ▼
Student Resubmits  Final Score & Feedback Logged
```

---

## 8. Certificate Eligibility Engine

Certification clearance requires satisfying configurable criteria before HR is notified for official seal and issuance:

| Metric | Required Threshold |
|---|---|
| **Course Content Completion** | $\ge 90\%$ |
| **Quiz Completion Rate** | $\ge 80\%$ |
| **Quiz Average Score** | $\ge 65\%$ |
| **Assignment Completion Rate** | $\ge 85\%$ |
| **Live Attendance** | $\ge 75\%$ |
| **Final Capstone Project** | `APPROVED / COMPLETED` |

---

## 9. Database Entity Model (LMS Schema)

```text
Course
 └── CoursePhase (id, course_id, phase_number, title, order_index)
      └── CourseModule (id, phase_id, title, description, order_index)
           └── CourseDay (id, module_id, day_number, title, unlock_rule, unlock_date)
                ├── Lesson (id, day_id, title, estimated_minutes, order_index)
                │    └── LessonBlock (id, lesson_id, type, content_json, order_index)
                ├── Quiz (id, day_id, title, duration_minutes, pass_score, max_attempts)
                │    └── QuizQuestionMapping (quiz_id, question_id, points)
                └── Assignment (id, day_id, title, description, max_score, due_days)

QuestionBank (id, course_id, question_text, question_type, difficulty, topic, day_number)
 └── QuestionOption (id, question_id, option_text, is_correct, explanation)

Enrollment (id, user_id, course_id, batch_id, status, enrolled_at)
 ├── LessonProgress (enrollment_id, lesson_id, is_completed, time_spent_seconds)
 ├── VideoProgress (enrollment_id, lesson_block_id, seconds_watched, watch_percentage)
 ├── QuizAttempt (id, enrollment_id, quiz_id, attempt_number, score, is_passed)
 │    └── QuizAttemptAnswer (attempt_id, question_id, selected_options, is_correct, score)
 ├── AssignmentSubmission (id, enrollment_id, assignment_id, file_url, status, score, feedback)
 └── DayProgress (enrollment_id, day_id, is_unlocked, is_completed)
```

---

*Last Updated: 2026-09-30 | Ethiroli Pvt Ltd Learning Management System*
