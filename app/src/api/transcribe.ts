const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

export async function transcribe(blob: Blob): Promise<string> {
  if (!OPENAI_KEY) {
    console.warn("[transcribe] VITE_OPENAI_API_KEY not set — returning placeholder transcript");
    return "";
  }

  const ext = blob.type.includes("mp4") ? "mp4" : blob.type.includes("ogg") ? "ogg" : "webm";
  const file = new File([blob], `cast.${ext}`, { type: blob.type || "audio/webm" });

  const fd = new FormData();
  fd.append("file", file);
  fd.append("model", "whisper-1");
  fd.append("response_format", "json");
  fd.append("language", "en");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_KEY}` },
    body: fd,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Whisper failed: ${res.status} ${msg}`);
  }
  const data = (await res.json()) as { text: string };
  return data.text ?? "";
}
