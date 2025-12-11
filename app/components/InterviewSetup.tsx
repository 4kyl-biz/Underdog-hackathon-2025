import * as Slider from "@radix-ui/react-slider";
import clsx from "clsx";

export type Persona = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  defaultHarshness: number;
};

type InterviewSetupProps = {
  personas: Persona[];
  selectedPersona: Persona;
  harshness: number;
  jobDescription: string;
  resume: string;
  onSelectPersona: (persona: Persona) => void;
  onHarshnessChange: (value: number) => void;
  onJobDescriptionChange: (value: string) => void;
  onResumeChange: (value: string) => void;
  onStart: () => void;
};

export default function InterviewSetup({
  personas,
  selectedPersona,
  harshness,
  jobDescription,
  resume,
  onSelectPersona,
  onHarshnessChange,
  onJobDescriptionChange,
  onResumeChange,
  onStart,
}: InterviewSetupProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Configure your interviewer</h1>
        <p className="text-sm text-slate-400">
          Choose a persona, set harshness, and provide context before starting.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {personas.map((persona) => {
          const isSelected = persona.id === selectedPersona.id;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => onSelectPersona(persona)}
              className={clsx(
                "flex flex-col gap-2 rounded-xl border px-4 py-3 text-left transition hover:border-indigo-400/70 hover:bg-slate-800/50",
                isSelected ? "border-indigo-500 bg-slate-800/50 shadow-lg shadow-indigo-500/20" : "border-slate-800/80 bg-slate-900/60",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{persona.avatar}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{persona.name}</p>
                  <p className="text-xs text-slate-400">{persona.role}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">{persona.description}</p>
              <p className="text-[11px] font-semibold text-indigo-300">
                Default harshness: {persona.defaultHarshness}%
              </p>
            </button>
          );
        })}
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Harshness</p>
          <span
            className={clsx(
              "rounded-full px-2 py-1 text-xs font-semibold",
              harshness >= 80
                ? "bg-red-500/20 text-red-200"
                : harshness >= 50
                  ? "bg-amber-500/20 text-amber-200"
                  : "bg-emerald-500/20 text-emerald-200",
            )}
          >
            {harshness}%
          </span>
        </div>
        <Slider.Root
          className="relative flex h-8 w-full touch-none select-none items-center"
          value={[harshness]}
          min={0}
          max={100}
          step={1}
          onValueChange={([value]) => onHarshnessChange(value)}
        >
          <Slider.Track className="relative h-1 flex-1 rounded-full bg-slate-800">
            <Slider.Range
              className={clsx(
                "absolute h-full rounded-full",
                harshness >= 80
                  ? "bg-red-400"
                  : harshness >= 50
                    ? "bg-amber-300"
                    : "bg-emerald-400",
              )}
            />
          </Slider.Track>
          <Slider.Thumb className="block h-4 w-4 rounded-full border border-slate-950 bg-white shadow-lg shadow-black/50 focus:outline-none" />
        </Slider.Root>
        <p className="text-xs text-slate-400">
          Higher harshness penalizes mistakes more severely and rewards sparingly.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white" htmlFor="job-description">
            Job Description
          </label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(event) => onJobDescriptionChange(event.target.value)}
            placeholder="Paste the role summary so the interviewer can tailor questions."
            className="min-h-[140px] w-full resize-none rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-white" htmlFor="resume">
            Resume / Highlights
          </label>
          <textarea
            id="resume"
            value={resume}
            onChange={(event) => onResumeChange(event.target.value)}
            placeholder="Paste key bullets or your resume text for context."
            className="min-h-[140px] w-full resize-none rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Ready to start?</p>
          <p className="text-xs text-slate-400">
            Score initializes at 70. You can end the session anytime.
          </p>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-indigo-500/30 transition hover:opacity-95 sm:w-auto"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}

