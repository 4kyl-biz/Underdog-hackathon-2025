# Hackathon Todo List: AI Mock Interviewer

## 🟢 Level 1: Foundation & UI (First 45 Mins)

_Goal: Get the visuals up so it looks like a real app immediately._

- [ ] **Scaffold Project**: Run `npx create-next-app@latest` (TS, Tailwind, App Router).
- [ ] **Install Deps**: `npm install @11labs/react lucide-react framer-motion clsx tailwind-merge @radix-ui/react-slider @radix-ui/react-progress sonner`
- [ ] **Env Vars**: Create `.env.local` and add `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` (Use a generic placeholder agent ID for now).
- [ ] **Layout Shell**: Clean up `page.tsx`. Add a dark mode theme wrapper (or just force dark classes).
- [ ] **Config Component (`InterviewSetup.tsx`)**:
  - [ ] Create "Persona Cards" (Clickable divs: Tech Lead, HR, Founder).
  - [ ] Create "Harshness Slider" (0-100 range).
  - [ ] Create Inputs: Job Description (Textarea), Resume (Textarea).
  - [ ] Add a "Start Interview" button that switches the view state.
- [ ] **Session Component (`InterviewSession.tsx`)**:
  - [ ] Build the skeleton: An "End Button" and a placeholder for the Orb/Visualizer.
  - [ ] Add the **Confidence Score UI** (A Shadcn Progress bar starting at 70%).

## 🟡 Level 2: The Voice Connection (Next 45 Mins)

_Goal: Make the Agent talk and listen._

- [ ] **ElevenLabs Setup**:
  - [ ] Go to ElevenLabs Dashboard -> Create Agent.
  - [ ] **System Prompt**: Set a generic fallback: _"You are an interviewer. Wait for context."_
  - [ ] **Security**: whitelist `localhost` domain in the agent settings.
- [ ] **Hook Implementation**:
  - [ ] In `InterviewSession.tsx`, import `useConversation` from `@11labs/react`.
  - [ ] Connect the "Start" button (or `useEffect`) to `conversation.startSession()`.
  - [ ] Bind `conversation.isSpeaking` state to a simple visual indicator (e.g., text saying "Agent Speaking...").
- [ ] **Prompt Builder Logic**:
  - [ ] Write a function `generateSystemMessage(persona, harshness, jobData)` that returns a string.
  - [ ] **Crucial**: Pass this string as the first message or context override when starting the session.

## 🔴 Level 3: The "Magic" (Complex Logic) (Next 60 Mins)

_Goal: Implement Function Calling and the Dynamic Score._

- [ ] **Define Client Tool**:
  - [ ] Inside `useConversation` config, add `clientTools`.
  - [ ] Create `rateAnswer({ impact, reason })`.
- [ ] **Connect Tool to State**:
  - [ ] Inside `rateAnswer`, update the `confidence` state (`setConfidence(prev => prev + impact)`).
  - [ ] Trigger a Toast notification (`sonner`) showing the `reason` (e.g., "Too vague (-10)").
- [ ] **Force Tool Usage (Prompt Engineering)**:
  - [ ] Update your `generateSystemMessage` function.
  - [ ] Add explicit instruction: _"After EVERY user response, you MUST call the `rateAnswer` tool to evaluate them based on the harshness setting."_
- [ ] **Feedback Loop**:
  - [ ] Make the `rateAnswer` tool return the _new_ score to the Agent.
  - [ ] (Optional) Instruct Agent to comment on the score if it drops too low.

## 🔵 Level 4: Polish & Demo Prep (Final 30 Mins)

_Goal: Make it demo-ready._

- [ ] **Persona Visuals**: Show the Avatar of the selected Persona in the active session view.
- [ ] **Harshness Visuals**: If harshness > 80, turn the UI accent color Red.
- [ ] **End Screen**: When "End Interview" is clicked, show a summary card (High Score? Hired or Not?).
- [ ] **Video Backup**: Record a screen capture of a successful flow NOW, just in case internet fails during the demo.
