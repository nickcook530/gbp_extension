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

    let xhr_categories = new XMLHttpRequest();
    xhr_categories.responseType = 'json';
    xhr_categories.open('GET', "http://givebackpact.herokuapp.com/api/categories/children");
    xhr_categories.onload = function() {
        if (xhr_categories.status === 200) {
            let result_array = xhr_categories.response;
            console.log("Categories retrieved by background.js from api call: ")
            console.log(result_array);

            chrome.storage.local.set({category_api_result: result_array}, function() {
                console.log("SUCCESS. Category storage by background.js complete");
            });
        }
        else {
            //alert('Request failed.  Returned status of ' + xhr_categories.status);
        }
    };
    xhr_categories.send();
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var api_category = null; // initiate to set later for use in api call
        if (request.msg === "content_completed") {
            //  Get search term from message data
            let search_term_array = request.data.search_term_array;

            getCategoryArray(api_category, search_term_array, findCompany);
        }
    }
);

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCategoryArray(api_category, search_term_array, callback) {
    let categories = [];
    chrome.storage.local.get(['category_api_result'], function(result) {
        result.category_api_result.forEach(function(category_object) {
            categories.push(category_object.name.toLowerCase());
        });

        callback(api_category, search_term_array, categories);
    });
};

function findCompany(api_category, search_term_array, categories) {
    search_term_array.forEach(function(search_word) {
        if (api_category === null) {//Use to break loop at first instance of a match. Might need a better solution long term
            console.log("api_category is undefined");
            for (let category of categories) {
                console.log("in for loop of categories, on: "+category);
                if (category.includes(search_word)) {
                    api_category = capitalizeFirstLetter(category);
                    console.log("hit break with word: "+search_word);
                    break;
                }
            };
        } else {
            console.log("skipped "+search_word+" because api_category is already defined");
        }
    });

    if (api_category !== null && api_category !== undefined) {
        let xhr_companies = new XMLHttpRequest();
        xhr_companies.responseType = 'json';
        xhr_companies.open('GET', "http://givebackpact.herokuapp.com/api/categories/" + api_category + "/companies");
        xhr_companies.onload = function() {
            if (xhr_companies.status === 200) {
                let result_array = xhr_companies.response;
                console.log("companies retrieved by background.js: ")
                console.log(result_array);

                chrome.storage.local.set({company_api_result: result_array}, function() {
                    console.log("Company storage by background.js complete");
                });
                if (result_array.length > 0) {
                    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
                    chrome.browserAction.setBadgeText({text: result_array.length.toString()});
                }else {
                    chrome.browserAction.setBadgeText({text: ''}); //might be unnecessary now that we have if loop to check if api_category is undefinded
                };
            }
            else {
                //alert('Request failed.  Returned status of ' + xhr_companies.status);
                chrome.browserAction.setBadgeText({text: ''});
            }
        };
        xhr_companies.send();
    }else{
        chrome.browserAction.setBadgeText({text: ''});
        chrome.storage.local.set({company_api_result: null}, function() {
            console.log("No applicable category found for search term(s)");
        });
    }
}