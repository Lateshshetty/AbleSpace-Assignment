<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=26&duration=3000&pause=1000&color=2563EB&center=true&vCenter=true&width=650&lines=AbleSpace+Product+Understanding;Part+2%3A+Take+Data+Workflow;Full+Stack+Developer+(Fresher)+Assessment" alt="Typing SVG" />

<br/>

![Status](https://img.shields.io/badge/Status-Completed-2ea44f?style=for-the-badge)
![Focus](https://img.shields.io/badge/Focus-Caseload_to_Take_Data-2563EB?style=for-the-badge)
![Type](https://img.shields.io/badge/Type-UX%20%26%20Workflow%20Analysis-8b5cf6?style=for-the-badge)

</div>

---

## 📌 Overview

This document breaks down the **Take Data** workflow inside AbleSpace — how a user moves from the **Caseload** screen to recording a student's performance against their configured goals. It covers the workflow steps, the different data-entry patterns the interface supports, and a set of UX improvements based on hands-on exploration of the demo student environment.

> **In one line:** AbleSpace's Take Data workflow is goal-driven — the data entry UI reshapes itself based on which goal you select.

---

## 🧭 End-to-End Workflow

<div align="center">

```mermaid
flowchart LR
    A[📋 Open Caseload] --> B[🧑‍🎓 Select Student → Take Data]
    B --> C[🗂️ Open Data Collection Session]
    C --> D[🎯 Select a Goal]
    D --> E[✍️ Goal-Specific Capture Interface]
    E --> F[✅ Record Performance]
    F --> G[🔁 Move Between Goals]
    G --> H[📝 Add Notes]
    H --> I[💾 Confirm Saved State]
```

</div>

---

## 🎯 Data Entry Patterns Observed

The Capture interface adapts entirely depending on the goal selected — the same workflow supports five distinct interaction models:

<table>
<tr>
<th>Pattern</th>
<th>Example Goal</th>
<th>How It Works</th>
</tr>
<tr>
<td>🎲 <b>Trial Based Recording</b></td>
<td>Social Studies</td>
<td>Large interaction control logs each attempt; goal can be marked complete after recording.</td>
</tr>
<tr>
<td>☑️ <b>Task Based Recording</b></td>
<td>Writing</td>
<td>Individual tasks shown with checkboxes and a "Select All" option for multi-task goals.</td>
</tr>
<tr>
<td>📊 <b>Percentage & Accuracy Tracking</b></td>
<td>Math</td>
<td>Displays prompted %, accuracy %, attempts, and prompts, with Correct / Incorrect / Cue controls.</td>
</tr>
<tr>
<td>🏷️ <b>Categorical Recording</b></td>
<td>Reading</td>
<td>User selects from categories (Independent, 1 Prompt, 2+ Prompts, No Response) instead of a numeric input.</td>
</tr>
<tr>
<td>🗣️ <b>Prompt Level Observation</b></td>
<td>Toileting / Behavior</td>
<td>Categories reflect the level of verbal/visual prompting needed — qualitative rather than numeric.</td>
</tr>
</table>

---

## 🧩 Session Interface Structure

- **Goals Panel (left):** search, filter, and add controls for navigating configured goals
- **Capture Area (right):** the goal-specific data entry interface described above
- **Tabs:** `Capture` · `Graph` · `Stats` · `Info`
- **Notes Section:** add a formatted student note directly within the session
- **Save Feedback:** header displays **"All changes Saved"** as live confirmation of persistence

---

## 🔍 UX Observations

<details>
<summary><b>1. Different interaction models per goal</b></summary>
<br>
Provides flexibility, but a user may hit an unfamiliar interaction pattern each time they switch goals.
</details>

<details>
<summary><b>2. Truncated goal descriptions</b></summary>
<br>
Goal cards show shortened text in the side panel; full context often requires selecting the goal first.
</details>

<details>
<summary><b>3. Goal navigation at scale</b></summary>
<br>
The Goals panel has its own scroll area — larger caseloads mean more scrolling to find a specific goal.
</details>

<details>
<summary><b>4. Repetitive data entry</b></summary>
<br>
Several measurement types need repeated clicks/taps. Fine for structured collection, but experienced users would benefit from faster input paths.
</details>

<details>
<summary><b>5. Strong save-state feedback ✅</b></summary>
<br>
The visible "All changes Saved" indicator is a genuine strength — it removes uncertainty about whether data was persisted.
</details>

---

## 🚀 Proposed Improvements

| Priority | Improvement | Expected Benefit |
|:---:|---|---|
| 🔴 **High** | Show full goal descriptions via expandable cards or tooltips | Better comprehension without widening the Goals panel |
| 🔴 **High** | Add short contextual guidance per measurement type | Flattens the learning curve when switching between goal interfaces |
| 🟡 **Medium** | Improve goal search / add "Jump to Goal" navigation | Less scrolling, faster for high-volume caseloads |
| 🟡 **Medium** | Add keyboard shortcuts for Correct / Incorrect / Cue | Speeds up repetitive data entry for experienced users |

---

## 🏁 Conclusion

AbleSpace's Take Data workflow is built around **goal-based data collection**: Caseload → Student → Take Data → Goal → Capture. It flexibly supports trial-based, task-based, percentage/accuracy, categorical, and prompt-level recording, backed by clear save-state feedback. The biggest wins going forward are in **discoverability**, **goal navigation at scale**, **in-context guidance**, and **efficiency for repetitive entry**.

<div align="center">

📄 Full write-up: [`AbleSpace_Product_Understanding_Part_2.pdf`](./AbleSpace_Product_Understanding_Part_2.pdf)

</div>
