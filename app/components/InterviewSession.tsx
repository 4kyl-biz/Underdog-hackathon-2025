import * as Progress from "@radix-ui/react-progress";
import { X } from "lucide-react";
import { type Persona } from "./InterviewSetup";

type InterviewSessionProps = {
  persona: Persona;
  harshness: number;
  confidence: number;
  onEnd: () => void;
};

const progressClass = (value: number) => {
  if (value >= 80) return "bg-emerald-400";
  if (value >= 50) return "bg-amber-300";
  return "bg-red-400";
};

export default function InterviewSession({
  persona,
  harshness,
  confidence,
  onEnd,
}: InterviewSessionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-lg">
            {persona.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{persona.name}</p>
            <p className="text-xs text-slate-400">
              {persona.role} · Harshness {harshness}%
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onEnd}
          className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:border-red-400 hover:bg-red-500/20"
        >
          <X size={14} />
          End Interview
        </button>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Confidence Score</p>
          <span className="text-sm font-semibold text-white">{confidence}%</span>
        </div>
        <Progress.Root className="relative h-4 w-full overflow-hidden rounded-full bg-slate-800">
          <Progress.Indicator
            className={`h-full w-full origin-left rounded-full transition-transform duration-300 ${progressClass(confidence)}`}
            style={{ transform: `translateX(-${100 - confidence}%)` }}
          />
        </Progress.Root>
        <p className="text-xs text-slate-400">
          Updates in real time as the agent rates each answer. Starts at 70 by spec.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-800/80 bg-slate-900/40 p-6 text-center">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/50 via-cyan-400/40 to-emerald-400/40 blur-3xl" />
        <p className="text-sm font-semibold text-white">Voice session placeholder</p>
        <p className="text-xs text-slate-400">
          Orb/visualizer will appear here once ElevenLabs is connected.
        </p>
      </div>
    </div>
  );
}

