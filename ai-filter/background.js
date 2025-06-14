browser.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "aiFilter:test") {
    return browser.experiments.aiFilter.classify(msg);
  }
});
