/**
 * PAROT ZOHO DEVTOOLS - Tool 8: Deluge Production Snippet Vault
 * Curated, production-tested Deluge snippets with category filtering and instant copy.
 */

window.SnippetVaultTool = {
    snippets: [
        {
            id: "upsert_lead",
            category: "crm",
            title: "Search & Upsert Lead (Find or Create by Email)",
            desc: "Searches Zoho CRM for a Lead by email. If found, updates the record; if not found, creates a new Lead.",
            tags: ["CRM", "Leads", "Upsert", "Workflow"],
            code: `// Upsert Lead by Email Address
leadEmail = "client@example.com";
leadMap = Map();
leadMap.put("First_Name", "Tariq");
leadMap.put("Last_Name", "Mansour");
leadMap.put("Company", "Acme Tech");
leadMap.put("Email", leadEmail);

// 1. Search existing records by Email
searchRecords = zoho.crm.searchRecords("Leads", "(Email:equals:" + leadEmail + ")");

if(searchRecords != null && searchRecords.size() > 0)
{
    existingLeadId = searchRecords.get(0).get("id");
    updateResp = zoho.crm.updateRecord("Leads", existingLeadId, leadMap);
    info "Lead updated successfully with ID: " + existingLeadId;
}
else
{
    createResp = zoho.crm.createRecord("Leads", leadMap);
    info "New Lead created successfully with ID: " + createResp.get("id");
}`
        },
        {
            id: "attach_file_crm",
            category: "crm",
            title: "Download Remote File & Attach to CRM Record",
            desc: "Downloads a file from an external URL (e.g. PDF invoice or contract) and attaches it directly to a Zoho CRM record.",
            tags: ["CRM", "Attachment", "Files", "invokeurl"],
            code: `// Download file from URL and attach to CRM Lead
leadId = "415086000003423001";
fileUrl = "https://parotcorp.com/assets/sample-contract.pdf";

// 1. Fetch file as binary stream
fileResponse = invokeurl
[
    url: fileUrl
    type: GET
];

// 2. Attach downloaded file to CRM record
attachResponse = zoho.crm.attachFile("Leads", leadId, fileResponse);
info "Attachment Status: " + attachResponse;`
        },
        {
            id: "send_html_mail",
            category: "utility",
            title: "Send Polished HTML Email via sendmail",
            desc: "Dispatches a styled HTML email to a customer with custom header, logo, and action button.",
            tags: ["Email", "HTML", "sendmail", "Notification"],
            code: `// Send Styled HTML Email via Deluge sendmail
recipientEmail = "client@example.com";
recipientName = "Valued Customer";

htmlMessage = "<div style='font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #ffffff; border-radius: 12px;'>";
htmlMessage = htmlMessage + "<h2 style='color: #8B5CF6; margin-top: 0;'>Welcome to PAROT Ecosystem!</h2>";
htmlMessage = htmlMessage + "<p>Dear " + recipientName + ",</p>";
htmlMessage = htmlMessage + "<p>Your account has been successfully configured. Click below to access your dashboard:</p>";
htmlMessage = htmlMessage + "<p style='margin: 24px 0;'><a href='https://parotcorp.com' style='background: #EC4899; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Open Dashboard</a></p>";
htmlMessage = htmlMessage + "<p style='font-size: 12px; color: #94a3b8;'>PAROT Corp • Software & AI Solutions</p>";
htmlMessage = htmlMessage + "</div>";

sendmail
[
    from: zoho.adminuserid
    to: recipientEmail
    subject: "Welcome to PAROT - Getting Started"
    message: htmlMessage
];

info "Email dispatched to: " + recipientEmail;`
        },
        {
            id: "try_catch_alert",
            category: "utility",
            title: "Safe Try-Catch Block with Admin Alert",
            desc: "Wraps sensitive Deluge logic in a Try-Catch block and automatically alerts the admin with error message and timestamp if a failure occurs.",
            tags: ["Try-Catch", "Error Handling", "Stability"],
            code: `// Bulletproof Deluge Try-Catch Pattern
try 
{
    // Place sensitive business logic here
    testMap = Map();
    // Simulate error or execute critical CRM update
    zoho.crm.updateRecord("Leads", "INVALID_ID_TEST", testMap);
}
catch (e)
{
    errorMessage = "Deluge Error in Function: " + e.toString();
    info errorMessage;
    
    // Dispatch alert to DevOps / Admin
    sendmail
    [
        from: zoho.adminuserid
        to: "sohib@parotcorp.com"
        subject: "🚨 Deluge Script Exception Alert"
        message: "An unexpected exception occurred at " + zoho.currenttime + ":<br><pre>" + errorMessage + "</pre>"
    ];
}`
        },
        {
            id: "books_create_invoice",
            category: "books",
            title: "Create Zoho Books Invoice with Line Items",
            desc: "Constructs a multi-item invoice and submits it to Zoho Books API with taxes and payment terms.",
            tags: ["Zoho Books", "Invoice", "Finance"],
            code: `// Create Zoho Books Invoice with Line Items
organizationId = "YOUR_BOOKS_ORG_ID";

invoiceMap = Map();
invoiceMap.put("customer_id", "982000000184712");
invoiceMap.put("date", zoho.currentdate.toString("yyyy-MM-dd"));
invoiceMap.put("due_date", zoho.currentdate.addDay(14).toString("yyyy-MM-dd"));
invoiceMap.put("notes", "Thank you for partnering with PAROT Corp.");

// Add Line Items
lineItems = List();

item1 = Map();
item1.put("item_id", "982000000091234");
item1.put("name", "Custom Software Engineering");
item1.put("rate", 1200.00);
item1.put("quantity", 5);
lineItems.add(item1);

item2 = Map();
item2.put("item_id", "982000000091235");
item2.put("name", "Cloud Migration Consulting");
item2.put("rate", 1500.00);
item2.put("quantity", 1);
lineItems.add(item2);

invoiceMap.put("line_items", lineItems);

// Execute Zoho Books API call
createInvoiceResp = zoho.books.createRecord("invoices", organizationId, invoiceMap);
info "Invoice Created: " + createInvoiceResp;`
        },
        {
            id: "desk_ticket",
            category: "desk",
            title: "Create Zoho Desk Support Ticket",
            desc: "Creates a support ticket in Zoho Desk assigned to a specific department and priority level.",
            tags: ["Zoho Desk", "Support", "Tickets"],
            code: `// Create Zoho Desk Ticket
orgId = "YOUR_DESK_ORG_ID";
departmentId = "YOUR_DEPARTMENT_ID";

ticketData = Map();
ticketData.put("subject", "Urgent API Integration Support");
ticketData.put("description", "Customer requested urgent webhook configuration check.");
ticketData.put("departmentId", departmentId);
ticketData.put("priority", "High");
ticketData.put("status", "Open");
ticketData.put("email", "client@example.com");

ticketResponse = zoho.desk.create("Tickets", orgId, ticketData);
info "Desk Ticket Created: " + ticketResponse;`
        },
        {
            id: "hmac_signature",
            category: "utility",
            title: "HMAC-SHA256 Webhook Signature Validator",
            desc: "Generates or verifies an HMAC-SHA256 signature to securely authenticate webhooks (e.g. Shopify, Stripe, GitHub).",
            tags: ["Security", "HMAC", "Crypto", "Webhook"],
            code: `// HMAC-SHA256 Signature Verification in Deluge
secretKey = "PAROT_WEBHOOK_SECRET_KEY";
payloadBody = '{"event":"payment_received","amount":500}';

// Compute HMAC-SHA256 Hex Digest
computedHash = zoho.encryption.hmacSha256(payloadBody, secretKey);
info "Computed Signature: " + computedHash;

// In a standalone function, compare computedHash with incoming header
// if(computedHash == incomingHeaderSignature) { ... proceed ... }`
        }
    ],

    activeCategory: 'all',
    searchQuery: '',

    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        const searchInput = document.getElementById('snippet-search-input');
        const filterPills = document.querySelectorAll('.snippet-filter-pill');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.render();
            });
        }

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.activeCategory = pill.dataset.category;
                this.render();
            });
        });
    },

    render() {
        const container = document.getElementById('snippet-cards-container');
        if (!container) return;

        const filtered = this.snippets.filter(snip => {
            const matchCategory = this.activeCategory === 'all' || snip.category === this.activeCategory;
            const matchSearch = !this.searchQuery || 
                snip.title.toLowerCase().includes(this.searchQuery) || 
                snip.desc.toLowerCase().includes(this.searchQuery) ||
                snip.tags.some(t => t.toLowerCase().includes(this.searchQuery));
            return matchCategory && matchSearch;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="col-span-full py-12 text-center text-slate-500 italic">No snippets found matching "${this.searchQuery}"</div>`;
            return;
        }

        container.innerHTML = '';
        filtered.forEach(snip => {
            const card = document.createElement('div');
            card.className = 'studio-card p-4 flex flex-col justify-between group';

            const top = document.createElement('div');
            top.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="type-badge bg-purple-500/20 text-purple-300 border border-purple-500/30">${snip.category.toUpperCase()}</span>
                    <button class="snippet-copy-btn btn-secondary text-xs flex items-center gap-1.5" data-code="${encodeURIComponent(snip.code)}">
                        <i data-lucide="copy" class="w-3 h-3"></i>
                        <span>Copy</span>
                    </button>
                </div>
                <h4 class="text-sm font-bold text-white group-hover:text-parot-pink transition-colors mb-1">${snip.title}</h4>
                <p class="text-xs text-slate-400 mb-2.5 leading-relaxed">${snip.desc}</p>
                <div class="flex flex-wrap gap-1 mb-2.5">
                    ${snip.tags.map(t => `<span class="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">#${t}</span>`).join('')}
                </div>
            `;

            const codePreview = document.createElement('pre');
            codePreview.className = 'code-output-box text-xs max-h-40 overflow-y-auto mb-1';
            codePreview.textContent = snip.code;

            card.appendChild(top);
            card.appendChild(codePreview);
            container.appendChild(card);
        });

        // Bind copy buttons
        container.querySelectorAll('.snippet-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = decodeURIComponent(btn.dataset.code);
                window.App?.copyToClipboard(code, btn);
            });
        });

        if (window.lucide) {
            try { window.lucide.createIcons(); } catch(e) {}
        }
    }
};
