let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (voicesReady) return voicesReady;
  voicesReady = new Promise((resolve) => {
    const v = window.speechSynthesis.getVoices();
    if (v.length) return resolve(v);
    const handler = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
  });
  return voicesReady;
}

export async function speak(text: string, opts: { rate?: number; pitch?: number } = {}): Promise<void> {
  if (!("speechSynthesis" in window)) return;
  const voices = await loadVoices();
  const voice =
    voices.find((v) => /en-(US|GB)/i.test(v.lang) && /female|samantha|kate|google/i.test(v.name)) ||
    voices.find((v) => /en-/i.test(v.lang)) ||
    voices[0];

  return new Promise<void>((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.rate = opts.rate ?? 0.9;
    u.pitch = opts.pitch ?? 1.0;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

export async function speakSequence(lines: string[], gapMs = 350): Promise<void> {
  for (const line of lines) {
    await speak(line);
    await new Promise((r) => setTimeout(r, gapMs));
  }
}

export function cancelSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
