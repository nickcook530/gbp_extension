window.onload = function() {
    console.log("window.onload running");

    let companies;
    chrome.storage.local.get(['api_result'], function(result) {
        companies = result.api_result;
        console.log("popup.js retrieved data:")
        console.log(companies);
        
        let parent = document.getElementById("companies");
        companies.forEach(company => {
            let company_div = document.createElement("div");
            let hyperlink = document.createElement("a");
            let node = document.createTextNode(company.name);
            hyperlink.appendChild(node);
            hyperlink.href = company.website_url
            hyperlink.setAttribute('target', '_blank');
            company_div.appendChild(hyperlink);
            parent.appendChild(company_div);
        });
    });
};