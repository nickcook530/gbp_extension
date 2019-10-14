window.onload = function() {
    console.log("window.onload running");

    let companies;
    chrome.storage.local.get(['company_api_result'], function(result) {
        companies = result.company_api_result;
        console.log("popup.js retrieved data:")
        console.log(companies);
        
        
        if (companies !== null && typeof companies !== "undefined") {
            let description_parent = document.getElementById("description");
            let description_para = document.createElement("p");
            let description_node = document.createTextNode("Take the pact! Before you buy, take a look at one of these companies that give back: ");
            description_para.appendChild(description_node);
            description_parent.appendChild(description_para);
            
            companies.forEach(company => {
                let list_parent = document.getElementById("company_list");
                let company_li = document.createElement("li");
                let hyperlink = document.createElement("a");
                let name_node = document.createTextNode(company.name);
                hyperlink.appendChild(name_node);
                hyperlink.href = company.website_url
                hyperlink.setAttribute('target', '_blank');
                company_li.appendChild(hyperlink);
                list_parent.appendChild(company_li);
            });
        }else{
            let description_parent = document.getElementById("description");
            let description_para = document.createElement("p");
            let description_node = document.createTextNode("No results found. Click the link below to see a full list of charitable companies.");
            description_para.appendChild(description_node);
            description_parent.appendChild(description_para);
        }
    });
};