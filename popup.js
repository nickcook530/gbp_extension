window.onload = function() {
    console.log("window.onload running");

    let companies;
    chrome.storage.local.get(['company_api_result'], function(result) {
        companies = result.company_api_result;
        console.log("popup.js retrieved data:")
        console.log(companies);
        
        let parent = document.getElementById("company_list");
        if (typeof companies !== "undefined") {
            companies.forEach(company => {
                //let company_div = document.createElement("div");
                let company_li = document.createElement("li");
                let hyperlink = document.createElement("a");
                let node = document.createTextNode(company.name);
                hyperlink.appendChild(node);
                hyperlink.href = company.website_url
                hyperlink.setAttribute('target', '_blank');
                company_li.appendChild(hyperlink);
                parent.appendChild(company_li);
            });
        }
    });
};