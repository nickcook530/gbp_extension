// Should eventually move this to local storage
var categories = {
    Headwear: ["hat", "beanie", "cap"],
    Footwear: ["socks", "sneakers", "boots"]
};
 
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        //call a function to handle a first install
    }else if(details.reason == "update"){
        //call a function to handle an update
    }
});

chrome.runtime.onStartup.addListener(function(){
    //Might be able to replace this with onInstalled call
    console.log("this is the startup call from background.js");
    chrome.browserAction.setBadgeText({text: ''}); //remove badge that denoted previous results

    chrome.storage.local.get(function(result){
        if (typeof result.word_synonyms === 'undefined') {
            console.log("NO stored results");
            //Add code here to pull down word synonyms from API
        }else{
            console.log("There are stored results");
            console.log(result);
        }
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var api_category; // initiate to set later for use in api call
        if (request.msg === "content_completed") {
            //  To do something
            let search_term_array = request.data.search_term_array;
            console.log("Array of searched words: ")
            console.log(search_term_array);

            search_term_array.forEach(function(search_word) {
                if (api_category === undefined) {//Use to break loop at first instance of a match. Might need a better solution long term
                    for (var category in categories) {
                        if (!categories.hasOwnProperty(category)) {
                            //The current property is not a direct property of object
                            continue;
                        }
                        //Do your logic with the property here
                        if (categories[category].includes(search_word)) {
                            api_category = category;
                            console.log("hit break with word: "+search_word);
                            break;
                        }
                    }
                } else {
                    console.log("skipped "+search_word+" because api_category is already defined");
                }
            });

            var xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.open('GET', "http://givebackpact.herokuapp.com/api/categories/" + api_category + "/companies");
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var result_array = xhr.response;
                    console.log(result_array);

                    chrome.storage.local.set({company_api_result: result_array}, function() {
                        console.log("Storage by background.js complete");
                    });
                    if (result_array.length > 0) {
                        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
                        chrome.browserAction.setBadgeText({text: result_array.length.toString()});
                    }else {
                        chrome.browserAction.setBadgeText({text: ''});
                    };
                }
                else {
                    //alert('Request failed.  Returned status of ' + xhr.status);
                    chrome.browserAction.setBadgeText({text: ''});
                }
            };
            xhr.send();
        }
    }
);

