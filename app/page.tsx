"use client";

import { useMemo, useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import InterviewSetup, { type Persona } from "./components/InterviewSetup";
import InterviewSession from "./components/InterviewSession";

const personas: Persona[] = [
  {
    id: "tech_lead",
    name: "Alex Chen",
    role: "Senior Staff Engineer",
    avatar: "👨‍💻",
    description:
      "Focuses on system design, edge cases, and technical depth. Hates buzzwords.",
    defaultHarshness: 70,
  },
  {
    id: "hr_manager",
    name: "Sarah Jenkins",
    role: "Head of People",
    avatar: "👋",
    description:
      "Cares about STAR stories, culture fit, and clear communication. Very polite.",
    defaultHarshness: 40,
  },
  {
    id: "founder",
    name: "Marcus Sterling",
    role: "Founder & CEO",
    avatar: "🚀",
    description:
      "Loves big ideas and energy. Penalizes low enthusiasm more than missed details.",
    defaultHarshness: 20,
  },
];

export default function HomePage() {
  const defaultPersona = useMemo(() => personas[0], []);
  const [selectedPersona, setSelectedPersona] = useState<Persona>(defaultPersona);
  const [harshness, setHarshness] = useState<number>(defaultPersona.defaultHarshness);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resume, setResume] = useState<string>("");
  const [inSession, setInSession] = useState<boolean>(false);
  const [confidence, setConfidence] = useState<number>(70);

  const handleStart = () => {
    setConfidence(70);
    setInSession(true);
  };

  const handleEnd = () => {
    setInSession(false);
  };

  return (
    <main className="flex flex-1 flex-col gap-8">
      <header className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3 shadow-lg shadow-slate-950/30 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 text-lg font-semibold text-slate-950 shadow-md shadow-cyan-500/40">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Mock Interviewer
            </p>
            <p className="text-xs text-slate-500">
              Dynamic scoring · Persona-driven interviews
            </p>
          </div>
        </div>
        <SignedIn>
          <UserButton appearance={{ elements: { userButtonAvatarBox: "h-9 w-9" } }} />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
      </header>

      <section className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
        <SignedIn>
          {!inSession ? (
            <InterviewSetup
              personas={personas}
              selectedPersona={selectedPersona}
              harshness={harshness}
              jobDescription={jobDescription}
              resume={resume}
              onSelectPersona={(persona) => {
                setSelectedPersona(persona);
                setHarshness(persona.defaultHarshness);
              }}
              onHarshnessChange={setHarshness}
              onJobDescriptionChange={setJobDescription}
              onResumeChange={setResume}
              onStart={handleStart}
            />
          ) : (
            <InterviewSession
              persona={selectedPersona}
              harshness={harshness}
              confidence={confidence}
              onEnd={handleEnd}
            />
          )}
        </SignedIn>

        <SignedOut>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-white">
              Sign in to start your mock interview.
            </h1>
            <p className="text-slate-400">
              Authentication is required for the real-time voice session and scoring.
            </p>
            <SignInButton mode="modal">
              <button className="w-fit rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
                Sign in with Clerk
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </section>
    </main>
  );
}

