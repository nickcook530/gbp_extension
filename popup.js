window.onload = function() {
    console.log("window.onload running");

    let stored_data;
    chrome.storage.local.get(['test_term'], function(result) {
        console.log("stored data: " + result.test_term);
        stored_data = result.test_term;

        let parent = document.getElementById("companies");
        let para = document.createElement("p");
        let node = document.createTextNode(stored_data);
        para.appendChild(node);
        parent.appendChild(para);
    });
};