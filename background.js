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
        if (request.msg === "content_completed") {
            //  To do something
            let category = request.data.search_term;
            console.log(category);




            var xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.open('GET', "http://givebackpact.herokuapp.com/api/categories/" + category + "/companies");
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

