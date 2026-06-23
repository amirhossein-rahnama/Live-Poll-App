import { z } from "zod";

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 5;
export const QUESTION_MAX = 280;
export const OPTION_MAX = 120;

export const createPollSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(QUESTION_MAX, `Question must be ${QUESTION_MAX} characters or fewer`),
  options: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Options cannot be empty")
        .max(OPTION_MAX, `Each option must be ${OPTION_MAX} characters or fewer`),
    )
    .min(MIN_OPTIONS, `Provide at least ${MIN_OPTIONS} options`)
    .max(MAX_OPTIONS, `Provide at most ${MAX_OPTIONS} options`)
    .refine(
      (opts) => new Set(opts.map((o) => o.toLowerCase())).size === opts.length,
      { message: "Options must be unique" },
    ),
});

export const voteSchema = z.object({
  optionId: z.string().min(1, "optionId is required"),
});

export type CreatePollInput = z.infer<typeof createPollSchema>;

export function formatZodIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join("."),
    message: issue.message,
  }));
}
