import { type Persona } from "@/app/components/InterviewSetup";

type SystemMessageInput = {
  persona: Persona;
  harshness: number;
  jobDescription: string;
  resume: string;
};

export const generateSystemMessage = ({
  persona,
  harshness,
  jobDescription,
  resume,
}: SystemMessageInput): string => {
  const harshnessGuidance =
    harshness >= 80
      ? "Harshness is HIGH: Penalize mistakes heavily (-15) and reward sparingly (+5)."
      : harshness >= 50
        ? "Harshness is MEDIUM: Balance critique and praise (typical impacts -10 to +5)."
        : "Harshness is LOW: Be generous with praise (+10) and lighter with penalties (-5).";

  const contextParts = [
    `Persona: ${persona.name} (${persona.role}). Style: ${persona.description}`,
    `Job description: ${jobDescription || "not provided"}`,
    `Resume/context: ${resume || "not provided"}`,
    harshnessGuidance,
    "You are an interviewer. Wait for context, then engage in an interview.",
    "After the candidate answers, internally evaluate their answer and be ready to call the rateAnswer tool.",
    "If the score drops below 20, warn them they are failing.",
  ];

  return contextParts.join("\n");
};

