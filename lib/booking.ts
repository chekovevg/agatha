export const introBookingHref = "/book?type=intro";

export function lessonBookingHref(subject?: string) {
  const params = new URLSearchParams({type: "lesson"});
  if (subject) params.set("subject", subject);
  return `/book?${params}`;
}
