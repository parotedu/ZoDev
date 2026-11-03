/**
 * PAROT ZOHO DEVSTUDIO - Tool 14: Zoho Desk Ticket & Comment Builder
 * Generates Deluge code to create support tickets, assign departments,
 * attach customer contacts, and post internal agent comments.
 */

window.DeskBuilderTool = {
    init() {
        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const prioritySelect = document.getElementById('desk-priority');
        const channelSelect = document.getElementById('desk-channel');
        const addCommentCheckbox = document.getElementById('desk-include-comment');

        [prioritySelect, channelSelect, addCommentCheckbox].forEach(el => {
            if (el) el.addEventListener('change', () => this.update());
        });
    },

    update() {
        const priority = document.getElementById('desk-priority')?.value || 'High';
        const channel = document.getElementById('desk-channel')?.value || 'Web';
        const includeComment = document.getElementById('desk-include-comment')?.checked ?? true;
        const outputElem = document.getElementById('desk-output');

        let script = `// ========================================================\n// Create Zoho Desk Ticket via Deluge\n// ========================================================\norgId = "YOUR_DESK_ORG_ID"; // Replace with your Zoho Desk Org ID\ndepartmentId = "YOUR_DEPARTMENT_ID";\n\nticketMap = Map();\nticketMap.put("subject", "Urgent Enterprise Support Request");\nticketMap.put("description", "Client requested immediate assistance with CRM-ERP integration.");\nticketMap.put("departmentId", departmentId);\nticketMap.put("priority", "${priority}");\nticketMap.put("channel", "${channel}");\nticketMap.put("status", "Open");\nticketMap.put("email", "client@example.com");\nticketMap.put("phone", "+201012345678");\n\n// Create Ticket in Desk\ncreateTicketResp = zoho.desk.create("Tickets", orgId, ticketMap);\ninfo "Desk Ticket Created: " + createTicketResp;\n\nnewTicketId = createTicketResp.get("id");\n`;

        if (includeComment) {
            script += `\nif(newTicketId != null)\n{\n    // Add Private Agent Comment / Internal Note\n    commentMap = Map();\n    commentMap.put("content", "Ticket automatically generated via PAROT API webhook.");\n    commentMap.put("isPublic", "false"); // Set to true for customer-facing reply\n    \n    commentResp = zoho.desk.addComment(orgId, newTicketId, commentMap);\n    info "Internal Note Added: " + commentResp;\n}`;
        }

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
