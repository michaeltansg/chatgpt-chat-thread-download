chrome.action.onClicked.addListener(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"]
    }, () => {
      chrome.tabs.sendMessage(tab.id, { action: 'download_chat_thread' });
    });
});
