/* 单词发音 — Web Speech API（不可用时静默降级） */
window.Speak = (function () {
  const supported = typeof window.speechSynthesis !== 'undefined' &&
    typeof window.SpeechSynthesisUtterance !== 'undefined';

  function say(text) {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.85;
      const voice = window.speechSynthesis.getVoices().find(v => /^en(-|_)/i.test(v.lang));
      if (voice) u.voice = voice;
      window.speechSynthesis.speak(u);
    } catch (e) { /* 静默 */ }
  }

  if (supported) window.speechSynthesis.getVoices(); // 触发音色列表加载
  return { say, supported };
})();
