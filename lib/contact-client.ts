export async function submitContact(
  payload: Record<string, FormDataEntryValue>,
) {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {"Content-Type": "application/json"},
    });

    return response.ok;
  } catch {
    return false;
  }
}
