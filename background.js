chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "content_completed") {
            //  To do something
            console.log(request.data.search_term);
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.open('GET', 'http://givebackpact.herokuapp.com/api/categories/Footwear/companies');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var jsonResponse = xhr.response
                    console.log(jsonResponse);
                    //alert('RESPONSE: ' + jsonResponse);
                    chrome.storage.local.set({test_term: "potato chip"}, function() {
                        console.log("Storage by background.js complete");
                    });
                }
                else {
                    alert('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();
        }
    }
);

