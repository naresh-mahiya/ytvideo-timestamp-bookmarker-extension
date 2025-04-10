export async function getActiveTabURL() {
    let queryOptions = { active: true, currentWindow: true };
    // tabs that are active and belong to the current window.
    let [tab] = await chrome.tabs.query(queryOptions);//returns array of matching tabs...
    // but [tab] is array destructing..first element of array///vese ek hi elemetn hoga array me cos Only one tab at a time is active per window
    return tab;
}