function createAlarm(interval) {
  chrome.alarms.clear("autoTask", () => {
    chrome.alarms.create("autoTask", {
      periodInMinutes: interval
    });
  });
}

chrome.storage.sync.set({
  lastRun: new Date().toLocaleTimeString()
});


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["interval"], data => {
    createAlarm(data.interval || 15);
  });
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.interval) {
    createAlarm(changes.interval.newValue);
  }
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name !== "autoTask") return;

  chrome.storage.sync.get(["enabled"], data => {
    if (!data.enabled) return;

    chrome.browsingData.remove(
      {
        origins: ["https://beta.multione.digital"]
      },
      {
        cache: true,
        localStorage: true,
        indexedDB: true
      }
    );

    chrome.tabs.query(
      { url: "*://beta.multione.digital/*" },
      tabs => {
        tabs.forEach(tab => chrome.tabs.reload(tab.id));
      }
    );
  });
});
