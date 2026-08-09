import {z} from "zod";

import {
  contactStudentAgeOptions,
  contactSubjectOptions,
} from "@/content/contact-form";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  studentAge: z.enum(contactStudentAgeOptions),
  subject: z.enum(contactSubjectOptions),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(500).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const calWebhookSchema = z.object({
  triggerEvent: z.string().optional(),
  createdAt: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});
