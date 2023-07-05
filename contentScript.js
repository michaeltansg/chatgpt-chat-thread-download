if (window.contentScriptInjected !== true) { // Prevents the content script from being injected multiple times.
  window.contentScriptInjected = true;

  chrome.runtime.onMessage.addListener(({ action }, sender, sendResponse) => {
    if (action === 'download_chat_thread') {
        // The follow XPath expression is used to find the chat thread in the DOM.
        // It is the section of the ChatGPT UI that contains the current chat thread.
        // The SelectorGadget Chrome extension was used to find this XPath expression.
        // It can be broken if OpenAI changes their ChatGPT UI's HTML structure.
        // If this happens, use SelectorGadget to find the new XPath expression and update the xpathExpression variable.
        const xpathExpression = '//*[contains(concat( " ", @class, " " ), concat( " ", "border-b", " " ))]';
        const elements = document.evaluate(xpathExpression, document, null, XPathResult.ANY_TYPE, null);
  
        let data = '';
        let node;
        while (node = elements.iterateNext()) {
            data += node.outerHTML + '\n';
        }
  
        download(data, `${document.title} - ${formattedDateTimeCode()}.html`);
    }
  });
  
  function download(data, filename) {
    const blob = new Blob([data], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(url);
  }

  function formattedDateTimeCode() {
    const date = new Date();

    return date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0') +
        String(date.getHours()).padStart(2, '0') +
        String(date.getMinutes()).padStart(2, '0') +
        String(date.getSeconds()).padStart(2, '0');
  }
}
