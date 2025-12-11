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
        <h1 className="text-2xl font-semibold text-slate-900">Pick your interviewer</h1>
        <p className="text-sm text-slate-600">
          Choose a persona, set harshness, and provide context before starting.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {personas.map((persona) => {
          const isSelected = persona.id === selectedPersona.id;
          return (
            <div
              key={persona.id}
              className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-center"
            >
              <button
                type="button"
                onClick={() => onSelectPersona(persona)}
                className={clsx(
                  "flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 shadow-sm transition hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2",
                  isSelected && "ring-2 ring-indigo-500 ring-offset-2",
                )}
              >
                <span className="text-lg font-semibold text-slate-700">
                  {persona.name.split(" ")[0]}
                </span>
              </button>
              <div>
                <p className="text-base font-semibold text-slate-900">{persona.role}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{persona.description}</p>
              <p className="text-[11px] font-semibold text-indigo-600">
                Default harshness: {persona.defaultHarshness}%
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Harshness</p>
          <span
            className={clsx(
              "rounded-full px-2 py-1 text-xs font-semibold",
              harshness >= 80
                ? "bg-red-500/20 text-red-700"
                : harshness >= 50
                  ? "bg-amber-500/20 text-amber-700"
                  : "bg-emerald-500/20 text-emerald-700",
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
          <Slider.Track className="relative h-1 flex-1 rounded-full bg-slate-200">
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
          <Slider.Thumb className="block h-4 w-4 rounded-full border border-slate-300 bg-white shadow-lg shadow-slate-300/50 focus:outline-none" />
        </Slider.Root>
        <p className="text-xs text-slate-600">
          Higher harshness penalizes mistakes more severely and rewards sparingly.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900" htmlFor="job-description">
            Job Description
          </label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(event) => onJobDescriptionChange(event.target.value)}
            placeholder="Paste the role summary so the interviewer can tailor questions."
            className="min-h-[140px] w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900" htmlFor="resume">
            Resume / Highlights
          </label>
          <textarea
            id="resume"
            value={resume}
            onChange={(event) => onResumeChange(event.target.value)}
            placeholder="Paste key bullets or your resume text for context."
            className="min-h-[140px] w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Ready to start?</p>
          <p className="text-xs text-slate-600">
            Score initializes at 50. You can end the session anytime.
          </p>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-600 sm:w-auto"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}

