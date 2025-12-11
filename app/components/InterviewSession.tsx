import { useEffect, useMemo, useState } from "react";
import * as Progress from "@radix-ui/react-progress";
import { useConversation, type Status } from "@11labs/react";
import { X } from "lucide-react";
import { generateSystemMessage } from "@/lib/prompt";
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

const statusLabel: Record<Status, string> = {
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
  const [error, setError] = useState<string | null>(null);
  const systemMessage = useMemo(
    () => generateSystemMessage({ persona, harshness, jobDescription, resume }),
    [persona, harshness, jobDescription, resume],
  );

  const {
    startSession,
    endSession,
    status,
    isSpeaking,
  } = useConversation({
    agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? "",
    connectionType: "websocket",
    onError: (message) => setError(message),
  });

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        await startSession({
          overrides: {
            agent: {
              prompt: { prompt: systemMessage },
              firstMessage: "Let's begin. I'll be scoring every answer in real time.",
            },
          },
        });
      } catch (error_: unknown) {
        if (!active) return;
        setError(error_ instanceof Error ? error_.message : "Failed to start session");
      }
    };
    void run();

    return () => {
      active = false;
      void endSession();
    };
  }, [startSession, endSession, systemMessage]);

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
            <p className="text-[11px] font-semibold text-slate-400">
              {statusLabel[status]} {isSpeaking ? "· Agent speaking" : "· Listening"}
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

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-800/80 bg-slate-900/40 p-6 text-center">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/50 via-cyan-400/40 to-emerald-400/40 blur-3xl" />
        <p className="text-sm font-semibold text-white">
          Voice session connected to ElevenLabs agent.
        </p>
        <p className="text-xs text-slate-400">
          Orb/visualizer placeholder. Speaking indicator shows above.
        </p>
      </div>
    </div>
  );
}

