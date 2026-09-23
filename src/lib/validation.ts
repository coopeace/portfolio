import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Operator name must be at least 2 characters." })
    .max(100, { message: "Name must not exceed 100 characters." })
    .trim(),
  email: z
    .string()
    .email({ message: "Please provide a valid communication frequency (email address)." })
    .max(150, { message: "Email must not exceed 150 characters." })
    .trim(),
  message: z
    .string()
    .min(10, { message: "Transmission message must be at least 10 characters." })
    .max(2000, { message: "Transmission payload must not exceed 2000 characters." })
    .trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ContactApiResponse {
  success: boolean;
  message: string;
  status: "VALIDATED_AND_LOGGED" | "VALIDATION_FAILED";
  timestamp: string;
  fallbackUrl?: string;
  errors?: Record<string, string[]>;
}
