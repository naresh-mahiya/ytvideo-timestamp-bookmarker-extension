//listen to any update in our tab system..and find the most recent tab i.e. we are working on
//and then check if this is a youtube page

chrome.tabs.onUpdated.addListner((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch"))  // /watch coz we want only when video is being played
    {
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);

        //send a message to our content script that a new video is loaded
        //and the video id is sent
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParameters.get("v")
        })
    }
});