import { useEffect, useRef, useState } from "react";
import { useConversation, type Status } from "@11labs/react";
import { generateSystemMessage } from "@/lib/prompt";
import { type Persona } from "@/app/components/InterviewSetup";
import { toast } from "sonner";

type UseInterviewSessionArgs = {
  persona: Persona;
  harshness: number;
  jobDescription: string;
  resume: string;
  confidence: number;
  onConfidenceChange: (next: number) => void;
};

type UseInterviewSessionResult = {
  status: Status;
  isSpeaking: boolean;
  error: string | null;
};

export const useInterviewSession = ({
  persona,
  harshness,
  jobDescription,
  resume,
  confidence,
  onConfidenceChange,
}: UseInterviewSessionArgs): UseInterviewSessionResult => {
  const [error, setError] = useState<string | null>(null);
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? "";
  const startedRef = useRef(false);
  const attemptRef = useRef(0);
  const contextRef = useRef<string>("");
  const agentIdRef = useRef<string>(agentId);
  const confidenceRef = useRef<number>(confidence);

  const log = (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info("[interview-session]", ...args);
    }
  };

  useEffect(() => {
    confidenceRef.current = confidence;
  }, [confidence]);

  const clampConfidence = (value: number) => Math.max(0, Math.min(100, value));

  const {
    startSession,
    endSession,
    status,
    isSpeaking,
  } = useConversation({
    agentId,
    connectionType: "webrtc",
    clientTools: {
      rateAnswer: async ({ impact, reason }: { impact: number; reason: string }) => {
        const next = clampConfidence(confidenceRef.current + impact);
        confidenceRef.current = next;
        onConfidenceChange(next);
        log("rateAnswer", { impact, reason, next });
        toast(`${reason}`, {
          description: `Impact: ${impact > 0 ? "+" : ""}${impact}`,
          duration: 3000,
        });
        return next;
      },
    },
    onStatusChange: ({ status: nextStatus }: { status: Status }) =>
      log("status", nextStatus),
    onConnect: ({ conversationId }: { conversationId: string }) =>
      log("connected", { conversationId }),
    onDisconnect: (details: unknown) => log("disconnected", details),
    onUnhandledClientToolCall: (call: unknown) => log("unhandled tool call", call),
    onError: (message: string) => setError(message),
  });

  // Capture the prompt once to avoid restarts on prop changes/re-renders.
  if (!contextRef.current) {
    contextRef.current = generateSystemMessage({ persona, harshness, jobDescription, resume });
  }

  useEffect(() => {
    const resolvedAgentId = agentIdRef.current;

    if (!resolvedAgentId) {
      setError("Missing NEXT_PUBLIC_ELEVENLABS_AGENT_ID");
      log("missing agent id");
      return undefined;
    }
    if (startedRef.current) {
      log("session already started, skipping");
      return undefined;
    }

    startedRef.current = true;
    let active = true;

    const run = async () => {
      try {
        const attempt = attemptRef.current + 1;
        attemptRef.current = attempt;
        log("startSession", {
          attempt,
          agentId: resolvedAgentId,
          persona: persona.id,
          harshness,
          contextCached: Boolean(contextRef.current),
        });

        const promptText = contextRef.current || generateSystemMessage({ persona, harshness, jobDescription, resume });

        await startSession({
          agentId: resolvedAgentId,
          overrides: {
            agent: {
              prompt: { prompt: promptText },
              firstMessage: "Let's begin. I'll be scoring every answer in real time.",
            },
          },
        });
        log("startSession success", { attempt });
      } catch (error_: unknown) {
        if (!active) return;
        setError(error_ instanceof Error ? error_.message : "Failed to start session");
        log("startSession error", error_);
      }
    };

    void run();

    return () => {
      active = false;
      startedRef.current = false;
      log("cleanup: endSession");
      void endSession();
    };
    // Intentionally run only once; agentId/env are static for the session lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, isSpeaking, error };
};

