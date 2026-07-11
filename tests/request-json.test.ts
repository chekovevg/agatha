import {describe, expect, it} from "vitest";

import {readJsonBody} from "@/lib/request-json";

function request(body: string, contentLength?: number) {
  return new Request("http://localhost/api", {
    method: "POST",
    headers:
      contentLength === undefined
        ? {"content-type": "application/json"}
        : {
            "content-length": String(contentLength),
            "content-type": "application/json",
          },
    body,
  });
}

describe("readJsonBody", () => {
  it("returns parsed JSON within the byte limit", async () => {
    await expect(readJsonBody(request('{"ok":true}'), 32)).resolves.toEqual({
      ok: true,
      data: {ok: true},
    });
  });

  it("rejects malformed JSON", async () => {
    await expect(readJsonBody(request("{"), 32)).resolves.toEqual({
      ok: false,
      reason: "invalid",
    });
  });

  it("rejects a declared body larger than the limit before parsing", async () => {
    await expect(readJsonBody(request("{}", 100), 32)).resolves.toEqual({
      ok: false,
      reason: "too-large",
    });
  });

  it("measures actual UTF-8 bytes when content-length is absent", async () => {
    const body = JSON.stringify({message: "😀😀😀😀"});

    await expect(readJsonBody(request(body), 20)).resolves.toEqual({
      ok: false,
      reason: "too-large",
    });
  });
});
