import * as Progress from "@radix-ui/react-progress";
import { X, Mic, MicOff } from "lucide-react";
import { useInterviewSession } from "@/lib/hooks/useInterviewSession";
import { type Persona } from "./InterviewSetup";
import { useEffect, useState } from "react";

type InterviewSessionProps = {
  persona: Persona;
  harshness: number;
  confidence: number;
  jobDescription: string;
  resume: string;
  onConfidenceChange: (value: number) => void;
  onTranscript?: (payload: { speaker: "ai" | "user"; message: string }) => void;
  onFeedback?: (payload: { impact: number; reason: string; score: number }) => void;
  onEnd: () => void;
};

const progressClass = (value: number) => {
  if (value >= 80) return "bg-emerald-400";
  if (value >= 50) return "bg-amber-300";
  return "bg-red-400";
};

const statusLabel = {
  connecting: "Connecting...",
  connected: "Connected",
  disconnecting: "Disconnecting...",
  disconnected: "Disconnected",
};

// Waveform visualization component
const Waveform = ({ isActive }: { isActive: boolean }) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) {
      setBars([]);
      return;
    }

    const interval = setInterval(() => {
      setBars(
        Array.from({ length: 40 }, () => Math.random() * 100)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) {
    return (
      <div className="flex h-12 items-end justify-center gap-1">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-slate-300"
            style={{ height: "4px" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-12 items-end justify-center gap-1">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-indigo-500 transition-all duration-75"
          style={{ height: `${Math.max(4, height)}%` }}
        />
      ))}
    </div>
  );
};

// Agent Orb component with state-based animations
type OrbState = "idle" | "listening" | "talking" | "connecting";

const AgentOrb = ({ 
  status, 
  isSpeaking, 
  personaName 
}: { 
  status: string; 
  isSpeaking: boolean; 
  personaName: string;
}) => {
  const getOrbState = (): OrbState => {
    if (status === "connecting" || status === "disconnecting") return "connecting";
    if (isSpeaking) return "talking";
    if (status === "connected") return "listening";
    return "idle";
  };

  const orbState = getOrbState();

  const stateClasses: Record<OrbState, string> = {
    idle: "bg-slate-200",
    listening: "bg-cyan-400 animate-pulse",
    talking: "bg-indigo-500 animate-pulse",
    connecting: "bg-amber-400 animate-pulse",
  };

  const stateLabels: Record<OrbState, string> = {
    idle: "Idle",
    listening: "Listening",
    talking: "Talking",
    connecting: "Connecting",
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer glow */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
            orbState === "talking"
              ? "bg-indigo-400/50 scale-125"
              : orbState === "listening"
                ? "bg-cyan-400/50 scale-110"
                : "bg-slate-300/30 scale-100"
          }`}
        />
        {/* Orb */}
        <div
          className={`relative flex h-32 w-32 items-center justify-center rounded-full ${stateClasses[orbState]} transition-all duration-500 shadow-lg`}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">
              {personaName.split(" ")[0][0]}
            </span>
          </div>
        </div>
        {/* Status indicator */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 shadow-md">
          <span className="text-xs font-semibold text-slate-700">
            {stateLabels[orbState]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function InterviewSession({
  persona,
  harshness,
  confidence,
  jobDescription,
  resume,
  onConfidenceChange,
  onTranscript,
  onFeedback,
  onEnd,
}: InterviewSessionProps) {
  const { status, isSpeaking, error } = useInterviewSession({
    persona,
    harshness,
    jobDescription,
    resume,
    confidence,
    onConfidenceChange,
    onTranscript,
    onFeedback,
  });

  const isActive = status === "connected" && (isSpeaking || true); // Always show waveform when connected

  return (
    <div className="space-y-6">
      {/* Header with persona info and end button */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <span className="text-sm font-semibold text-slate-700">
              {persona.name.split(" ")[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{persona.name}</p>
            <p className="text-xs text-slate-600">
              {persona.role} · Harshness {harshness}%
            </p>
            <div className="flex items-center gap-2 mt-1">
              {status === "connected" ? (
                <Mic className="h-3 w-3 text-emerald-500" />
              ) : (
                <MicOff className="h-3 w-3 text-slate-400" />
              )}
              <p className="text-[11px] font-semibold text-slate-600">
                {statusLabel[status]}
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onEnd}
          className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-100"
        >
          <X size={14} />
          End Interview
        </button>
      </div>

      {/* Agent Orb Visualization */}
      <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8">
        <AgentOrb 
          status={status} 
          isSpeaking={isSpeaking} 
          personaName={persona.name}
        />
      </div>

      {/* Waveform Visualization */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Audio Activity
          </p>
          <span className="text-xs text-slate-500">
            {isSpeaking ? "Agent Speaking" : status === "connected" ? "Listening" : "Inactive"}
          </span>
        </div>
        <Waveform isActive={isActive} />
      </div>

      {/* Confidence Score */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Confidence Score</p>
          <span className={`text-lg font-bold ${progressClass(confidence).replace('bg-', 'text-')}`}>
            {confidence}%
          </span>
        </div>
        <Progress.Root className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <Progress.Indicator
            className={`h-full w-full origin-left rounded-full transition-transform duration-500 ${progressClass(confidence)}`}
            style={{ transform: `translateX(-${100 - confidence}%)` }}
          />
        </Progress.Root>
        <p className="mt-2 text-xs text-slate-600">
          Updates in real time as the agent rates each answer. Starts at 50.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

