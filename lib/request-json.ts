type JsonBodyResult =
  | {ok: true; data: unknown}
  | {ok: false; reason: "invalid" | "too-large"};

export async function readJsonBody(
  request: Request,
  maxBytes: number,
): Promise<JsonBodyResult> {
  const contentLength = request.headers.get("content-length");

  if (contentLength !== null) {
    const declaredBytes = Number(contentLength);

    if (Number.isFinite(declaredBytes) && declaredBytes > maxBytes) {
      return {ok: false, reason: "too-large"};
    }
  }

  let text: string;

  try {
    text = await request.text();
  } catch {
    return {ok: false, reason: "invalid"};
  }

  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return {ok: false, reason: "too-large"};
  }

  try {
    return {ok: true, data: JSON.parse(text) as unknown};
  } catch {
    return {ok: false, reason: "invalid"};
  }
}
