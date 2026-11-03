/**
 * PAROT ZOHO DEVTOOLS - Tool 5: Deluge Safe Pagination Generator
 * Generates robust pagination loops designed around Deluge's 5000 statement
 * limit and lack of while() loops.
 */

window.PaginationTool = {
    init() {
        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const typeSelect = document.getElementById('page-api-type');
        const moduleInput = document.getElementById('page-module-name');
        const maxPagesInput = document.getElementById('page-max-count');

        [typeSelect, moduleInput, maxPagesInput].forEach(elem => {
            if (elem) {
                elem.addEventListener('change', () => this.update());
                elem.addEventListener('input', () => this.update());
            }
        });
    },

    update() {
        const type = document.getElementById('page-api-type')?.value || 'crm';
        const moduleName = document.getElementById('page-module-name')?.value.trim() || 'Leads';
        const maxPages = Math.min(Math.max(parseInt(document.getElementById('page-max-count')?.value || '10', 10), 1), 30);
        const outputElem = document.getElementById('page-output');

        let script = '';

        // Generate the integer array for the loop: {1, 2, 3, ... maxPages}
        const pagesArray = Array.from({ length: maxPages }, (_, i) => i + 1).join(', ');

        if (type === 'crm') {
            script = `// ========================================================\n// Deluge Safe Pagination Loop: Zoho CRM getRecords\n// Max Safe Pages: ${maxPages} (Up to ${maxPages * 200} records)\n// ========================================================\nall${moduleName} = List();\nhasMoreRecords = true;\n\n// Loop using fixed index array to stay well below Deluge 5000 statement limit\nfor each pageIndex in {${pagesArray}}\n{\n    if(hasMoreRecords)\n    {\n        // Fetch batch of 200 (max allowed per page in Zoho CRM)\n        recordsBatch = zoho.crm.getRecords("${moduleName}", pageIndex, 200);\n        \n        if(recordsBatch != null && recordsBatch.size() > 0)\n        {\n            all${moduleName}.addAll(recordsBatch);\n            info "Fetched page " + pageIndex + ": " + recordsBatch.size() + " records";\n            \n            // If returned count is less than 200, we reached the last page\n            if(recordsBatch.size() < 200)\n            {\n                hasMoreRecords = false;\n            }\n        }\n        else\n        {\n            hasMoreRecords = false;\n        }\n    }\n}\n\ninfo "Completed. Total ${moduleName} fetched: " + all${moduleName}.size();`;
        } else if (type === 'books') {
            script = `// ========================================================\n// Deluge Safe Pagination Loop: Zoho Books\n// ========================================================\norganizationId = "YOUR_ORG_ID"; // Replace with your Zoho Books Organization ID\nallBooksRecords = List();\nhasMore = true;\n\nfor each pageIndex in {${pagesArray}}\n{\n    if(hasMore)\n    {\n        paramMap = Map();\n        paramMap.put("page", pageIndex);\n        paramMap.put("per_page", 200);\n        \n        response = zoho.books.getRecords("${moduleName.toLowerCase()}", organizationId, paramMap);\n        records = response.get("${moduleName.toLowerCase()}");\n        \n        if(records != null && records.size() > 0)\n        {\n            allBooksRecords.addAll(records);\n            info "Fetched Books page " + pageIndex + ": " + records.size() + " records";\n            \n            // Check page_context.has_more_page\n            pageContext = response.get("page_context");\n            if(pageContext != null && pageContext.get("has_more_page") == false)\n            {\n                hasMore = false;\n            }\n        }\n        else\n        {\n            hasMore = false;\n        }\n    }\n}\n\ninfo "Total Books Records: " + allBooksRecords.size();`;
        } else if (type === 'rest') {
            script = `// ========================================================\n// Deluge Safe Pagination Loop: External REST API with invokeurl\n// ========================================================\nallResults = List();\ncontinueLoop = true;\npageNumber = 1;\n\nheaders = Map();\nheaders.put("Authorization", "Bearer YOUR_TOKEN");\n\nfor each counter in {${pagesArray}}\n{\n    if(continueLoop)\n    {\n        apiUrl = "https://api.example.com/v1/items?page=" + pageNumber + "&limit=100";\n        \n        response = invokeurl\n        [\n            url: apiUrl\n            type: GET\n            headers: headers\n            detailed: true\n        ];\n        \n        if(response.get("responseCode") == 200)\n        {\n            respData = response.get("responseText").toMap();\n            items = respData.get("data");\n            \n            if(items != null && items.size() > 0)\n            {\n                allResults.addAll(items);\n                info "Page " + pageNumber + " returned " + items.size() + " items.";\n                pageNumber = pageNumber + 1;\n                \n                if(items.size() < 100)\n                {\n                    continueLoop = false;\n                }\n            }\n            else\n            {\n                continueLoop = false;\n            }\n        }\n        else\n        {\n            info "Request failed on page " + pageNumber + ": " + response.get("responseText");\n            continueLoop = false;\n        }\n    }\n}\n\ninfo "Finished pagination. Total items collected: " + allResults.size();`;
        }

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
