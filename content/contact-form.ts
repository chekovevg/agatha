export const contactSourceOptions = [
  "Google or another search engine",
  "Lessonface",
  "Recommendation",
  "Social media",
  "Another website or profile",
  "Other",
] as const;

export const contactFormContent = {
  name: "Name",
  email: "Email",
  studentAge: "Student age",
  subject: "Subject",
  preferredLanguage: "Preferred language",
  preferredLanguageOptions: ["English", "German", "Russian", "Not sure"],
  source: "How did you find Agatha? (optional)",
  sourceNotProvided: "Not provided",
  message: "Message",
  submit: "Send message",
  sending: "Sending...",
  success: "Thank you. Your message has been sent.",
  error: "Something went wrong. Please try again or use the booking link.",
} as const;
