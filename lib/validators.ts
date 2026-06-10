import {z} from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  studentAge: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(2).max(160),
  preferredLanguage: z.enum(["English", "German", "Russian", "Not sure"]).optional(),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(500).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const calWebhookSchema = z.object({
  triggerEvent: z.string().optional(),
  createdAt: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});
