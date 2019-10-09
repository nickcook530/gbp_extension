console.log('content script fired')

let search_term = document.getElementById("twotabsearchtextbox").value
search_term = search_term.toLowerCase();
console.log("User searched for: " + search_term)
let search_term_array = search_term.split(" ");
console.log(search_term_array);

if (search_term){
    chrome.runtime.sendMessage({
        msg: "content_completed", 
        data: {
            search_term_array: search_term_array
        }
    });
}else {
    console.log("No search term")
};