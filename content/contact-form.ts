export const contactStudentAgeOptions = ["Adult", "Child (7–14)"] as const;

export const contactSubjectOptions = [
  "Flute",
  "Recorder",
  "Piccolo",
  "Music Theory",
  "Solfege",
] as const;

export const contactFormContent = {
  name: "Name",
  email: "Email",
  studentAge: "Student age",
  studentAgePlaceholder: "Select age group",
  subject: "Subject",
  subjectPlaceholder: "Select a class",
  message: "Message",
  submit: "Send message",
  sending: "Sending...",
  success: "Thank you. Your message has been sent.",
  error: "Something went wrong. Please try again or use the booking link.",
} as const;
