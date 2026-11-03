/**
 * PAROT ZOHO DEVSTUDIO - Tool 18: Zoho CRM Lead Deduplication & Merge Script
 * Generates Deluge script to search duplicate Leads by Phone or Email,
 * merge missing fields, and log a history note to prevent duplicate clutter.
 */

window.LeadDedupTool = {
    init() {
        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const matchField = document.getElementById('dedup-match-field');
        if (matchField) {
            matchField.addEventListener('change', () => this.update());
        }
    },

    update() {
        const matchBy = document.getElementById('dedup-match-field')?.value || 'email';
        const outputElem = document.getElementById('dedup-output');

        let script = '';

        if (matchBy === 'email') {
            script = `// ========================================================\n// Zoho CRM Lead Deduplication by Email\n// Searches for existing lead; updates if found, creates if new\n// ========================================================\nincomingEmail = "lead@example.com";\nincomingPhone = "+201012345678";\nincomingFirstName = "Sohib";\nincomingLastName = "Khaled";\nincomingCompany = "PAROT Corp";\n\n// 1. Search existing Leads by Email\nexistingLeads = zoho.crm.searchRecords("Leads", "(Email:equals:" + incomingEmail + ")");\n\nif(existingLeads != null && existingLeads.size() > 0)\n{\n    // Match found! Merge data into Master Lead\n    masterLead = existingLeads.get(0);\n    masterLeadId = masterLead.get("id");\n    info "Duplicate lead detected. Master Record ID: " + masterLeadId;\n    \n    updatePayload = Map();\n    // Only update empty phone if master record lacks it\n    if(isNull(masterLead.get("Phone")))\n    {\n        updatePayload.put("Phone", incomingPhone);\n    }\n    updatePayload.put("Lead_Source", "Re-engagement Web Form");\n    \n    updateResp = zoho.crm.updateRecord("Leads", masterLeadId, updatePayload);\n    info "Master Lead Updated: " + updateResp;\n    \n    // Add Audit Note\n    noteMap = Map();\n    noteMap.put("Note_Title", "Duplicate Ingestion Merged");\n    noteMap.put("Note_Content", "Incoming form submission merged into existing record on " + zoho.currenttime);\n    noteMap.put("Parent_Id", masterLeadId);\n    noteMap.put("se_module", "Leads");\n    zoho.crm.createRecord("Notes", noteMap);\n}\nelse\n{\n    // No duplicate found. Create brand new Lead\n    newLead = Map();\n    newLead.put("First_Name", incomingFirstName);\n    newLead.put("Last_Name", incomingLastName);\n    newLead.put("Company", incomingCompany);\n    newLead.put("Email", incomingEmail);\n    newLead.put("Phone", incomingPhone);\n    \n    createResp = zoho.crm.createRecord("Leads", newLead);\n    info "New Lead created with ID: " + createResp.get("id");\n}`;
        } else {
            script = `// ========================================================\n// Zoho CRM Lead Deduplication by Phone Number\n// ========================================================\nincomingPhone = "+201012345678";\ncleanPhone = incomingPhone.replaceAll("[^0-9]", "");\n\n// Search by phone\nexistingLeads = zoho.crm.searchRecords("Leads", "(Phone:equals:" + cleanPhone + ")");\n\nif(existingLeads != null && existingLeads.size() > 0)\n{\n    masterId = existingLeads.get(0).get("id");\n    info "Duplicate Lead matched by Phone. Master ID: " + masterId;\n}\nelse\n{\n    info "Unique phone number. Proceeding with new Lead creation...";\n}`;
        }

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
