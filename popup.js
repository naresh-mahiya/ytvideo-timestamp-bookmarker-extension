import { getActiveTab } from './utils.js'

//this is called in view booksmarks
const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div")

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    controlsElement.className = "bookmark-controls";

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    setBookmarkAttributes("play", onPlay, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement)

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarksElement.appendChild(newBookmarkElement);
}

//view bookamrks
const viewBookmarks = (currentBookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks")
    bookmarksElement.innerHTML = "";
    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    }
    else {
        bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
}

//on play
const onPlay = async (e) => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getActiveTab();

    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime
    })
}


//on delete
const onDelete = async (e) => {
    const activeTab = await getActiveTab();
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");

    //try these from github clone repo
    // const elementToDelete = document.getElementById("bookmark-" + bookmarkTime);
    // elementToDelete.parentNode.removeChild(elementToDelete);

    // Send message to content script to delete the bookmark
    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        value: bookmarkTime
    }, (updatedBookmarks) => {
        // Update the view with the new bookmarks list
        requestAnimationFrame(() => {
            viewBookmarks(updatedBookmarks);

        })
    });
}


//set bookmark attribute
const setBookmarkAttributes = (src, eventListner, controlParentElement) => {
    const controlElement = document.createElement("img");
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListner);
    controlParentElement.appendChild(controlElement);
}


document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTab();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const currentVideo = urlParameters.get("v"); //get Returns the first value associated to the given search parameter

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

            //view bookmarks
            viewBookmarks(currentVideoBookmarks);
        })
    }
    else {
        //not a youtube video page
        const container = document.getElementsByClassName("container")[0]
        container.innerHTML = '<div class="title">This is not a youtube video page</div>'
    }

    // If user is on YT but now watching a video
    if (activeTab.url.includes("youtube.com/") && !activeTab.url.includes("/watch")) {
        popupTitle.textContent = 'Great!';
        bookmarks.innerHTML = '<i class=row id="noBookmarks">You are on YouTube. <br> Start watching a video to save your bookmarks!</i>';
    }

})