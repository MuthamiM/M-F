/**
 * Plays a double beep notification sound using the Web Audio API.
 * Since this is generated dynamically, it requires no static assets
 * and plays reliably in the background once the page has user interaction.
 */
export function playNotificationBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // Smooth fade out to avoid clicks
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = audioCtx.currentTime;
    // Play a friendly, crisp high-pitched double chirp
    playNote(880, now, 0.12);      // A5
    playNote(1174.66, now + 0.15, 0.2); // D6
  } catch (e) {
    console.warn("Audio Context alert blocked or not supported yet:", e);
  }
}
