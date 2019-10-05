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

                    chrome.storage.local.set({api_result: result_array}, function() {
                        console.log("Storage by background.js complete");
                    });
                    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
                    chrome.browserAction.setBadgeText({text: result_array.length.toString()});
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

