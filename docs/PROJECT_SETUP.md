# Project Setup (AI Mock Interviewer)

## Prerequisites
- Node 18+
- NPM (project uses npm lockfile)
- ElevenLabs Agent ID (public) and Clerk keys

## Environment
Create `.env.local` at repo root:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
CLERK_SECRET_KEY=sk_test_replace_me
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_placeholder
```

## Install
```
npm install
```

## Run
```
npm run dev
```

## ElevenLabs Agent (Dashboard)
- System prompt (fallback):
  ```
  You are an interviewer. Wait for context.
  After every candidate response, you internally evaluate their answer and (when tools are available) call rateAnswer with impact and reason. If score drops below 20, warn them they are failing. Be concise and professional.
  ```
- First message:
  ```
  Let’s begin. I’ll be scoring each answer in real time. Please start by introducing yourself and the role you’re targeting.
  ```
- Whitelist domain: `localhost`
- Use the Agent ID as `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`.

## Clerk
- Add publishable + secret keys to `.env.local`.
- Middleware already protects routes; `/` is public.

## Dev Notes
- UI uses Tailwind + Radix for slider/progress.
- Persona/harshness prompt is generated at runtime (`lib/prompt.ts`) and sent when starting a session.

