import * as Progress from "@radix-ui/react-progress";
import { X } from "lucide-react";
import { useInterviewSession } from "@/lib/hooks/useInterviewSession";
import { type Persona } from "./InterviewSetup";

type InterviewSessionProps = {
  persona: Persona;
  harshness: number;
  confidence: number;
  jobDescription: string;
  resume: string;
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

export default function InterviewSession({
  persona,
  harshness,
  confidence,
  jobDescription,
  resume,
  onEnd,
}: InterviewSessionProps) {
  const { status, isSpeaking, error } = useInterviewSession({
    persona,
    harshness,
    jobDescription,
    resume,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              {persona.name.split(" ")[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{persona.name}</p>
            <p className="text-xs text-slate-600">
              {persona.role} · Harshness {harshness}%
            </p>
            <p className="text-[11px] font-semibold text-slate-600">
              {statusLabel[status]} {isSpeaking ? "· Agent speaking" : "· Listening"}
            </p>
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

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Confidence Score</p>
          <span className="text-sm font-semibold text-slate-900">{confidence}%</span>
        </div>
        <Progress.Root className="relative h-4 w-full overflow-hidden rounded-full bg-slate-200">
          <Progress.Indicator
            className={`h-full w-full origin-left rounded-full transition-transform duration-300 ${progressClass(confidence)}`}
            style={{ transform: `translateX(-${100 - confidence}%)` }}
          />
        </Progress.Root>
        <p className="text-xs text-slate-600">
          Updates in real time as the agent rates each answer. Starts at 70 by spec.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/30 via-cyan-400/20 to-emerald-400/20 blur-3xl" />
        <p className="text-sm font-semibold text-slate-900">
          Voice session connected to ElevenLabs agent.
        </p>
        <p className="text-xs text-slate-600">
          Orb/visualizer placeholder. Speaking indicator shows above.
        </p>
      </div>
    </div>
  );
}

