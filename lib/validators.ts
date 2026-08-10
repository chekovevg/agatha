import {z} from "zod";

export const contactSchema = z.object({
  email: z.string().trim().email().max(180),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(500).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const calWebhookSchema = z.object({
  triggerEvent: z.string().optional(),
  createdAt: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});
