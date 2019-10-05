console.log('content script fired')

let search_term = document.getElementById("twotabsearchtextbox").value
console.log("User searched for: " + search_term)

if (search_term){
    chrome.runtime.sendMessage({
        msg: "content_completed", 
        data: {
            search_term: search_term
        }
    });
}else {
    console.log("No search term")
};