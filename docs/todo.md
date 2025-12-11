# Hackathon Todo List: AI Mock Interviewer

## 🟣 Level 0: Authentication (Clerk) - *Partner Tech*
*Goal: Secure the app and score partner points immediately.*

- [x] **Install Clerk**: `npm install @clerk/nextjs`
- [x] **Env Vars**: Get keys from Clerk Dashboard and add to `.env.local`:
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
- [x] **Middleware**: Create `middleware.ts` in root to protect routes.
- [x] **Provider**: Wrap `<html />` (or the body content) with `<ClerkProvider>` in `app/layout.tsx`.
- [x] **UI Integration**:
    - [x] Add `<UserButton />` to the Header in `app/page.tsx`.
    - [x] Wrap the main content in `<SignedIn>` / `<SignedOut>` components (or let middleware handle redirection).

## 🟢 Level 1: Foundation & UI (First 45 Mins)
*Goal: Get the visuals up so it looks like a real app immediately.*

- [x] **Scaffold Project**: Run `npx create-next-app@latest` (TS, Tailwind, App Router).
- [x] **Install Deps**: `npm install @11labs/react lucide-react framer-motion clsx tailwind-merge @radix-ui/react-slider @radix-ui/react-progress sonner`
- [x] **Env Vars**: Add `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` (Use a generic placeholder agent ID for now).
- [x] **Layout Shell**: Clean up `page.tsx`. Add a dark mode theme wrapper (or just force dark classes).
- [x] **Config Component (`InterviewSetup.tsx`)**:
    - [x] Create "Persona Cards" (Clickable divs: Tech Lead, HR, Founder).
    - [x] Create "Harshness Slider" (0-100 range).
    - [x] Create Inputs: Job Description (Textarea), Resume (Textarea).
    - [x] Add a "Start Interview" button that switches the view state.
- [x] **Session Component (`InterviewSession.tsx`)**:
    - [x] Build the skeleton: An "End Button" and a placeholder for the Orb/Visualizer.
    - [x] Add the **Confidence Score UI** (A Shadcn Progress bar starting at 70%).

## 🟡 Level 2: The Voice Connection (Next 45 Mins)
*Goal: Make the Agent talk and listen.*

- [ ] **ElevenLabs Setup**:
    - [ ] Go to ElevenLabs Dashboard -> Create Agent.
    - [ ] **System Prompt**: Set a generic fallback: *"You are an interviewer. Wait for context."*
    - [ ] **Security**: whitelist `localhost` domain in the agent settings.
- [x] **Hook Implementation**:
    - [x] In `InterviewSession.tsx`, import `useConversation` from `@11labs/react`.
    - [x] Connect the "Start" button (or `useEffect`) to `conversation.startSession()`.
    - [x] Bind `conversation.isSpeaking` state to a simple visual indicator (e.g., text saying "Agent Speaking...").
- [x] **Prompt Builder Logic**:
    - [x] Write a function `generateSystemMessage(persona, harshness, jobData)` that returns a string.
    - [x] **Crucial**: Pass this string as the first message or context override when starting the session.

## 🔴 Level 3: The "Magic" (Complex Logic) (Next 60 Mins)
*Goal: Implement Function Calling and the Dynamic Score.*

- [x] **Define Client Tool**:
    - [x] Inside `useConversation` config, add `clientTools`.
    - [x] Create `rateAnswer({ impact, reason })`.
- [x] **Connect Tool to State**:
    - [x] Inside `rateAnswer`, update the `confidence` state (`setConfidence(prev => prev + impact)`).
    - [x] Trigger a Toast notification (`sonner`) showing the `reason` (e.g., "Too vague (-10)").
- [x] **Force Tool Usage (Prompt Engineering)**:
    - [x] Update your `generateSystemMessage` function.
    - [x] Add explicit instruction: *"After EVERY user response, you MUST call the `rateAnswer` tool to evaluate them based on the harshness setting."*
- [x] **Feedback Loop**:
    - [x] Make the `rateAnswer` tool return the *new* score to the Agent.
    - [ ] (Optional) Instruct Agent to comment on the score if it drops too low.

## 🔵 Level 4: Polish & Demo Prep (Final 30 Mins)
*Goal: Make it demo-ready.*

- [ ] **Persona Visuals**: Show the Avatar of the selected Persona in the active session view.
- [ ] **Harshness Visuals**: If harshness > 80, turn the UI accent color Red.
- [ ] **End Screen**: When "End Interview" is clicked, show a summary card (High Score? Hired or Not?).
- [ ] **Video Backup**: Record a screen capture of a successful flow NOW, just in case internet fails during the demo.