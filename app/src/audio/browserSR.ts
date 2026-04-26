export interface BrowserSRHandle {
  stop: () => Promise<string>;
  cancel: () => void;
}

export function startBrowserSR(
  onInterim: (text: string) => void,
): Promise<BrowserSRHandle> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: typeof SpeechRecognition = window.SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) {
      reject(new Error("Speech recognition is not supported in this browser. Try Chrome or Edge."));
      return;
    }

    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    let finalText = "";
    let interimText = "";
    let ended = false;
    let endResolve: ((s: string) => void) | null = null;

    rec.onresult = (event) => {
      interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) {
          finalText += r[0].transcript + " ";
        } else {
          interimText += r[0].transcript;
        }
      }
      onInterim((finalText + interimText).trim());
    };

    rec.onend = () => {
      ended = true;
      endResolve?.(finalText.trim());
      endResolve = null;
    };

    rec.onerror = (event) => {
      if (event.error === "no-speech") return;
      reject(new Error(`Mic error: ${event.error}`));
    };

    rec.onstart = () => {
      resolve({
        stop: () =>
          new Promise<string>((res) => {
            if (ended) { res(finalText.trim()); return; }
            endResolve = res;
            rec.stop();
          }),
        cancel: () => rec.abort(),
      });
    };

    rec.start();
  });
}
