/**
 * PAROT ZOHO DEVSTUDIO - Tool 15: Zoho Books Line Item & Invoice Engine
 * Constructs multi-line item invoices with taxes, discounts, and custom line items.
 */

window.BooksEngineTool = {
    items: [
        { name: "Custom Software Engineering", rate: 1200, qty: 5, discount: "5%" },
        { name: "Cloud Architecture Setup", rate: 2500, qty: 1, discount: "0%" }
    ],

    init() {
        this.bindEvents();
        this.renderItems();
        this.update();
    },

    bindEvents() {
        const addBtn = document.getElementById('books-btn-add-item');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.items.push({ name: "Consulting Hour", rate: 150, qty: 10, discount: "0%" });
                this.renderItems();
                this.update();
            });
        }
    },

    renderItems() {
        const container = document.getElementById('books-items-container');
        if (!container) return;

        container.innerHTML = '';
        this.items.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'grid grid-cols-12 gap-2 items-center p-2 bg-[#060810] border border-white/10 rounded-lg text-xs';

            row.innerHTML = `
                <div class="col-span-5">
                    <input type="text" class="w-full bg-[#0F1320] border border-white/15 text-white rounded px-2 py-1 outline-none" value="${item.name}" placeholder="Item Description">
                </div>
                <div class="col-span-2">
                    <input type="number" class="w-full bg-[#0F1320] border border-white/15 text-white rounded px-2 py-1 outline-none" value="${item.rate}" placeholder="Rate">
                </div>
                <div class="col-span-2">
                    <input type="number" class="w-full bg-[#0F1320] border border-white/15 text-white rounded px-2 py-1 outline-none" value="${item.qty}" placeholder="Qty">
                </div>
                <div class="col-span-2">
                    <input type="text" class="w-full bg-[#0F1320] border border-white/15 text-white rounded px-2 py-1 outline-none" value="${item.discount}" placeholder="Discount">
                </div>
                <div class="col-span-1 text-center">
                    <button class="text-red-400 hover:text-red-300 font-bold" data-index="${index}">✕</button>
                </div>
            `;

            const inputs = row.querySelectorAll('input');
            inputs[0].addEventListener('input', (e) => { item.name = e.target.value; this.update(); });
            inputs[1].addEventListener('input', (e) => { item.rate = parseFloat(e.target.value) || 0; this.update(); });
            inputs[2].addEventListener('input', (e) => { item.qty = parseInt(e.target.value, 10) || 1; this.update(); });
            inputs[3].addEventListener('input', (e) => { item.discount = e.target.value; this.update(); });

            row.querySelector('button').addEventListener('click', () => {
                this.items.splice(index, 1);
                this.renderItems();
                this.update();
            });

            container.appendChild(row);
        });
    },

    update() {
        const outputElem = document.getElementById('books-output');

        let script = `// ========================================================\n// Create Zoho Books Invoice with Line Items\n// ========================================================\norgId = "YOUR_BOOKS_ORG_ID"; // Replace with your Zoho Books Org ID\n\ninvoiceMap = Map();\ninvoiceMap.put("customer_id", "982000000184712");\ninvoiceMap.put("date", zoho.currentdate.toString("yyyy-MM-dd"));\ninvoiceMap.put("due_date", zoho.currentdate.addDay(14).toString("yyyy-MM-dd"));\ninvoiceMap.put("payment_terms", 14);\ninvoiceMap.put("notes", "Thank you for partnering with PAROT Corp.");\n\n// Construct Line Items\nlineItems = List();\n\n`;

        this.items.forEach((it, i) => {
            script += `item${i + 1} = Map();\n`;
            script += `item${i + 1}.put("description", "${it.name.replace(/"/g, '\\"')}");\n`;
            script += `item${i + 1}.put("rate", ${it.rate});\n`;
            script += `item${i + 1}.put("quantity", ${it.qty});\n`;
            if (it.discount && it.discount !== '0%') {
                script += `item${i + 1}.put("discount", "${it.discount}");\n`;
            }
            script += `lineItems.add(item${i + 1});\n\n`;
        });

        script += `invoiceMap.put("line_items", lineItems);\n\n// Create Invoice via zoho.books API\ncreateInvoiceResp = zoho.books.createRecord("invoices", orgId, invoiceMap);\ninfo "Invoice Creation Status: " + createInvoiceResp;`;

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
