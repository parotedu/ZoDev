/**
 * PAROT ZOHO DEVTOOLS - Tool 6: Zoho Webhook & Function Unpacker
 * Generates Deluge boilerplate for unpacking `crmAPIRequest`, query parameters,
 * headers, authorization checks, and structured responses.
 */

window.WebhookUnpackerTool = {
    init() {
        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const typeSelect = document.getElementById('webhook-type');
        const authCheckbox = document.getElementById('webhook-check-token');
        const tokenInput = document.getElementById('webhook-token-value');

        [typeSelect, authCheckbox, tokenInput].forEach(elem => {
            if (elem) {
                elem.addEventListener('change', () => this.update());
                elem.addEventListener('input', () => this.update());
            }
        });
    },

    update() {
        const type = document.getElementById('webhook-type')?.value || 'crm_standalone';
        const checkAuth = document.getElementById('webhook-check-token')?.checked ?? true;
        const secretToken = document.getElementById('webhook-token-value')?.value.trim() || 'PAROT_SECRET_TOKEN_2026';
        const outputElem = document.getElementById('webhook-output');

        let script = '';

        if (type === 'crm_standalone') {
            script = `// ========================================================\n// Zoho CRM Standalone Function (API Endpoint)\n// Deluge Parameter: crmAPIRequest (Map)\n// ========================================================\n\n// 1. Unpack Request Headers\nheaders = crmAPIRequest.get("headers");\ninfo "Incoming Headers: " + headers;\n`;

            if (checkAuth) {
                script += `\n// 2. Secret Token Authentication Check\nclientSecret = "";\nif(!isNull(headers))\n{\n    clientSecret = headers.get("x-api-key");\n}\n\nif(clientSecret != "${secretToken}")\n{\n    errorResponse = Map();\n    errorResponse.put("status", "error");\n    errorResponse.put("message", "Unauthorized: Invalid or missing x-api-key header.");\n    return {"code": 401, "message": errorResponse.toString()};\n}\n`;
            }

            script += `\n// 3. Unpack URL Query Parameters\nqueryParams = crmAPIRequest.get("params");\ninfo "Query Params: " + queryParams;\n\n// 4. Unpack & Parse Body Payload\nrawBody = crmAPIRequest.get("body");\nbodyMap = Map();\n\nif(!isNull(rawBody))\n{\n    if(rawBody.startsWith("{") || rawBody.startsWith("["))\n    {\n        bodyMap = rawBody.toMap();\n    }\n}\n\ninfo "Parsed Body: " + bodyMap;\n\n// 5. Process Business Logic (e.g. Create Lead)\nleadName = bodyMap.get("name");\nleadEmail = bodyMap.get("email");\n\n// 6. Return Structured JSON Response\nresponseMap = Map();\nresponseMap.put("status", "success");\nresponseMap.put("message", "Payload processed successfully");\nresponseMap.put("timestamp", zoho.currenttime.toString("yyyy-MM-dd HH:mm:ss"));\n\nreturn {"code": 200, "message": responseMap.toString()};`;

        } else if (type === 'crm_workflow') {
            script = `// ========================================================\n// Zoho CRM Workflow / Blueprint Webhook Handler\n// Deluge Parameters: leadId (BigInt / String)\n// ========================================================\n\n// Validate Input Record ID\nif(isNull(leadId))\n{\n    info "Error: Missing leadId parameter.";\n    return;\n}\n\n// 1. Fetch CRM Record Details\nleadRecord = zoho.crm.getRecordById("Leads", leadId);\n\nif(leadRecord.get("id") != null)\n{\n    fullName = leadRecord.get("Full_Name");\n    email = leadRecord.get("Email");\n    info "Processing Lead: " + fullName + " (" + email + ")";\n    \n    // 2. Update Record or Trigger Sync\n    updateData = Map();\n    updateData.put("Webhook_Processed", true);\n    updateData.put("Processed_Time", zoho.currenttime.toString("yyyy-MM-dd'T'HH:mm:ssXXX"));\n    \n    updateResp = zoho.crm.updateRecord("Leads", leadId, updateData);\n    info "Update Status: " + updateResp;\n}\nelse\n{\n    info "Lead not found for ID: " + leadId;\n}`;

        } else if (type === 'creator_form') {
            script = `// ========================================================\n// Zoho Creator On-Success / Workflow Webhook Dispatcher\n// ========================================================\n\npayload = Map();\npayload.put("record_id", input.ID);\npayload.put("full_name", input.Full_Name);\npayload.put("email", input.Email_Address);\npayload.put("event", "CREATOR_RECORD_SUBMITTED");\n\nheaders = Map();\nheaders.put("Content-Type", "application/json");\nheaders.put("X-PAROT-Source", "ZohoCreator");\n\nwebhookResponse = invokeurl\n[\n    url: "https://your-webhook-endpoint.com/listener"\n    type: POST\n    parameters: payload.toString()\n    headers: headers\n    detailed: true\n];\n\ninfo "Webhook Dispatch Status: " + webhookResponse.get("responseCode");`;
        }

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
