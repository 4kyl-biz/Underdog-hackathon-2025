"use client";

import { useMemo, useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import InterviewSetup, { type Persona } from "./components/InterviewSetup";
import { defaultJobDescription, defaultResume } from "@/lib/defaults";
import InterviewSession from "./components/InterviewSession";
import personasData from "@/docs/personas.json";

const personas: Persona[] = personasData as Persona[];

export default function HomePage() {
  const defaultPersona = useMemo(() => personas[0], []);
  const [selectedPersona, setSelectedPersona] = useState<Persona>(defaultPersona);
  const [harshness, setHarshness] = useState<number>(defaultPersona.defaultHarshness);
  const [jobDescription, setJobDescription] = useState<string>(defaultJobDescription);
  const [resume, setResume] = useState<string>(defaultResume);
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
      <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-lg shadow-slate-200/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 text-lg font-semibold text-white shadow-md shadow-cyan-500/40">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
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

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur">
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
              jobDescription={jobDescription}
              resume={resume}
              onEnd={handleEnd}
            />
          )}
        </SignedIn>

        <SignedOut>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              Sign in to start your mock interview.
            </h1>
            <p className="text-slate-600">
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

