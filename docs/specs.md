# Project Specs: AI Mock Interviewer (Hackathon Final)

## 1. Project Overview

A real-time voice interviewer with **Dynamic Confidence Scoring**. The AI judges the candidate's answers in real-time and updates a visual score on the screen using Function Calling. Includes Persona selection and Harshness settings.

## 2. Tech Stack

- **Framework:** Next.js 14, Tailwind, Shadcn/ui
- **Voice:** ElevenLabs React SDK (`@11labs/react`)
- **Key Feature:** Client-side Function Calling (`clientTools`)

## 3. Core Logic: The Confidence System

### UI Component: `LiveScoreBoard`

- **Visual:** A large Progress Bar or Gauge.
- **Color Logic:**
  - 80-100: Green (Hired)
  - 50-79: Yellow (Warning)
  - 0-49: Red (Danger Zone)
- **Animation:** Smooth transition when score updates.

### Agent Logic (Function Calling)

- **Tool Name:** `rateAnswer`
- **Trigger:** The Agent must call this tool **after every user response**.
- **Parameters:**
  - `impact`: integer (e.g., +10, -5, -15).
  - `reason`: string (short feedback, e.g., "Answer was too vague", "Great STAR method").
- **System Prompt Addition:**
  > "After the candidate answers, you MUST internally evaluate their answer and call the `rateAnswer` tool.
  > IF HARSHNESS IS HIGH: Penalize mistakes heavily (-15). Reward sparingly (+5).
  > IF HARSHNESS IS LOW: Be generous (+10).
  > If the score drops below 20, warn them they are failing."

## 4. Interaction Flow

1. **Config:** User selects "Elon (Founder)" + Harshness 90%.
2. **Start:** Score initializes at 70.
3. **Q1:** "Tell me about a mistake you made."
4. **A1:** User stammers, gives a bad answer.
5. **Action:**
   - Agent thinks: "Terrible answer."
   - Agent calls: `rateAnswer({ impact: -15, reason: "Lacked accountability" })`
   - UI: Score drops to 55 (Yellow). Toast notification shows "Lacked accountability".
   - Audio: Agent says "That sounds like you're blaming others. Next question..."

## 5. Implementation Plan (Prioritized)

1. **State:** Add `confidence` state (0-100).
2. **SDK Config:** Define `clientTools` in `useConversation`.
3. **Prompt:** Update the dynamic prompt builder to enforce tool usage.
