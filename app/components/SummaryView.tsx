type TranscriptEntry = {
  speaker: "ai" | "user";
  message: string;
};

type FeedbackEntry = {
  impact: number;
  reason: string;
  score: number;
};

type SummaryViewProps = {
  personaName: string;
  harshness: number;
  finalScore: number;
  transcript: TranscriptEntry[];
  feedback: FeedbackEntry[];
  onRestart: () => void;
};

export default function SummaryView({
  personaName,
  harshness,
  finalScore,
  transcript,
  feedback,
  onRestart,
}: SummaryViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Interview Summary</p>
          <p className="text-xs text-slate-600">
            Persona: {personaName} · Harshness {harshness}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900">
            Final Score: {finalScore}%
          </span>
          <button
            type="button"
            onClick={onRestart}
            className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Start New Interview
          </button>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">Transcript</p>
        <div className="space-y-3">
          {transcript.length === 0 ? (
            <p className="text-xs text-slate-600">No transcript captured.</p>
          ) : (
            transcript.map((entry, index) => (
              <div
                key={`${entry.speaker}-${index}-${entry.message.slice(0, 8)}`}
                className="rounded-xl bg-slate-50 px-3 py-2"
              >
                <p className="text-[11px] font-semibold text-slate-500 uppercase">
                  {entry.speaker === "ai" ? "Interviewer" : "You"}
                </p>
                <p className="text-sm text-slate-900">{entry.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">Comments & Score Changes</p>
        <div className="space-y-3">
          {feedback.length === 0 ? (
            <p className="text-xs text-slate-600">No feedback recorded.</p>
          ) : (
            feedback.map((item, index) => (
              <div
                key={`${item.reason}-${index}-${item.impact}`}
                className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{item.reason}</p>
                  <span
                    className={`text-xs font-semibold ${
                      item.impact >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {item.impact >= 0 ? "+" : ""}
                    {item.impact} → {item.score}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

