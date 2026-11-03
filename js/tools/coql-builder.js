/**
 * PAROT ZOHO DEVTOOLS - Tool 4: Zoho CRM COQL (CRM Object Query Language) Studio
 * Visual builder for COQL queries with automated Deluge runner and pagination loops.
 */

window.CoqlBuilderTool = {
    modules: [
        { name: "Leads", defaultCols: "First_Name, Last_Name, Email, Phone, Company, Lead_Status" },
        { name: "Contacts", defaultCols: "First_Name, Last_Name, Email, Phone, Account_Name" },
        { name: "Accounts", defaultCols: "Account_Name, Phone, Website, Annual_Revenue" },
        { name: "Deals", defaultCols: "Deal_Name, Amount, Stage, Closing_Date, Account_Name" },
        { name: "Invoices", defaultCols: "Subject, Grand_Total, Status, Due_Date, Account_Name" }
    ],

    conditions: [
        { field: "Lead_Status", operator: "=", value: "Contacted", logic: "and" }
    ],

    init() {
        this.bindEvents();
        this.renderConditions();
        this.update();
    },

    bindEvents() {
        const moduleSelect = document.getElementById('coql-module');
        const columnsInput = document.getElementById('coql-columns');
        const orderByInput = document.getElementById('coql-orderby');
        const orderDir = document.getElementById('coql-orderdir');
        const limitInput = document.getElementById('coql-limit');
        const loopCheckbox = document.getElementById('coql-pagination-loop');
        const addCondBtn = document.getElementById('coql-btn-add-cond');

        if (moduleSelect) {
            moduleSelect.addEventListener('change', (e) => {
                const found = this.modules.find(m => m.name === e.target.value);
                if (found && columnsInput) {
                    columnsInput.value = found.defaultCols;
                }
                this.update();
            });
        }

        [columnsInput, orderByInput, orderDir, limitInput, loopCheckbox].forEach(elem => {
            if (elem) {
                elem.addEventListener('input', () => this.update());
                elem.addEventListener('change', () => this.update());
            }
        });

        if (addCondBtn) {
            addCondBtn.addEventListener('click', () => {
                this.conditions.push({ field: "Email", operator: "is not null", value: "", logic: "and" });
                this.renderConditions();
                this.update();
            });
        }
    },

    renderConditions() {
        const container = document.getElementById('coql-conditions-container');
        if (!container) return;

        container.innerHTML = '';
        this.conditions.forEach((cond, index) => {
            const row = document.createElement('div');
            row.className = 'flex flex-wrap items-center gap-2 py-1.5 px-2 bg-white/5 rounded-lg border border-white/10 text-xs';

            // Logic operator (if not first)
            if (index > 0) {
                const logicSelect = document.createElement('select');
                logicSelect.className = 'bg-slate-900 border border-white/20 text-parot-pink rounded px-2 py-1 font-semibold';
                logicSelect.innerHTML = `<option value="and" ${cond.logic === 'and' ? 'selected' : ''}>AND</option><option value="or" ${cond.logic === 'or' ? 'selected' : ''}>OR</option>`;
                logicSelect.addEventListener('change', (e) => {
                    cond.logic = e.target.value;
                    this.update();
                });
                row.appendChild(logicSelect);
            }

            // Field Input
            const fieldInput = document.createElement('input');
            fieldInput.type = 'text';
            fieldInput.className = 'bg-slate-900 border border-white/20 text-white rounded px-2 py-1 flex-1 min-w-[120px] font-mono';
            fieldInput.placeholder = 'Field API Name';
            fieldInput.value = cond.field;
            fieldInput.addEventListener('input', (e) => {
                cond.field = e.target.value.trim();
                this.update();
            });

            // Operator
            const opSelect = document.createElement('select');
            opSelect.className = 'bg-slate-900 border border-white/20 text-white rounded px-2 py-1';
            const ops = ['=', '!=', 'like', 'is null', 'is not null', '>', '<', '>=', '<='];
            opSelect.innerHTML = ops.map(op => `<option value="${op}" ${cond.operator === op ? 'selected' : ''}>${op}</option>`).join('');
            opSelect.addEventListener('change', (e) => {
                cond.operator = e.target.value;
                this.update();
            });

            // Value Input (hidden if is null / is not null)
            const valInput = document.createElement('input');
            valInput.type = 'text';
            valInput.className = `bg-slate-900 border border-white/20 text-white rounded px-2 py-1 flex-1 min-w-[120px] font-mono ${cond.operator.includes('null') ? 'hidden' : ''}`;
            valInput.placeholder = 'Value (e.g. Contacted or %Corp%)';
            valInput.value = cond.value;
            valInput.addEventListener('input', (e) => {
                cond.value = e.target.value;
                this.update();
            });

            // Delete Condition
            const delBtn = document.createElement('button');
            delBtn.className = 'text-red-400 hover:text-red-300 font-bold px-2 py-1 hover:bg-white/10 rounded';
            delBtn.innerHTML = '✕';
            delBtn.title = 'Remove condition';
            delBtn.addEventListener('click', () => {
                this.conditions.splice(index, 1);
                this.renderConditions();
                this.update();
            });

            row.appendChild(fieldInput);
            row.appendChild(opSelect);
            row.appendChild(valInput);
            row.appendChild(delBtn);

            container.appendChild(row);
        });
    },

    buildQueryString() {
        const moduleName = document.getElementById('coql-module')?.value || 'Leads';
        const cols = document.getElementById('coql-columns')?.value.trim() || 'First_Name, Last_Name, Email';
        const orderBy = document.getElementById('coql-orderby')?.value.trim();
        const orderDir = document.getElementById('coql-orderdir')?.value || 'desc';
        const limitVal = parseInt(document.getElementById('coql-limit')?.value || '200', 10);

        let query = `select ${cols} from ${moduleName}`;

        if (this.conditions.length > 0) {
            const condStrings = this.conditions.map((c, i) => {
                let part = '';
                if (i > 0) part += `${c.logic} `;
                if (c.operator.includes('null')) {
                    part += `(${c.field} ${c.operator})`;
                } else if (c.operator === 'like') {
                    part += `(${c.field} like '${c.value}')`;
                } else {
                    const isNum = !isNaN(Number(c.value)) && c.value.trim() !== '';
                    const formattedVal = isNum ? c.value : `'${c.value}'`;
                    part += `(${c.field} ${c.operator} ${formattedVal})`;
                }
                return part;
            });
            query += ` where ${condStrings.join(' ')}`;
        }

        if (orderBy) {
            query += ` order by ${orderBy} ${orderDir}`;
        }

        query += ` limit ${limitVal}`;
        return query;
    },

    update() {
        const query = this.buildQueryString();
        const isLoop = document.getElementById('coql-pagination-loop')?.checked;
        const moduleName = document.getElementById('coql-module')?.value || 'Leads';
        const outputElem = document.getElementById('coql-output');

        let script = '';

        if (!isLoop) {
            script = `// ========================================================\n// Single Page COQL Query (Max 200 records)\n// ========================================================\nqueryMap = Map();\nqueryMap.put("select_query", "${query.replace(/"/g, '\\"')}");\n\ncoqlResponse = zoho.crm.coql(queryMap);\nrecordList = coqlResponse.get("data");\n\nif(recordList != null && recordList.size() > 0)\n{\n    info "Fetched " + recordList.size() + " records from ${moduleName}.";\n    for each record in recordList\n    {\n        info record.get("id");\n    }\n}\nelse\n{\n    info "No records matched the criteria or error: " + coqlResponse;\n}`;
        } else {
            // Full Pagination Loop
            const baseQueryWithoutLimit = query.replace(/\s+limit\s+\d+$/i, '');
            script = `// ========================================================\n// Automated COQL Pagination Loop (Fetches ALL records)\n// Safely iterates offsets (0, 200, 400...) up to safety cap\n// ========================================================\nallRecords = List();\nhasMore = true;\noffsetIndex = 0;\nsafetyCounter = 0; // Prevent infinite loop limit\n\nfor each counter in {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}\n{\n    if(hasMore)\n    {\n        queryStr = "${baseQueryWithoutLimit.replace(/"/g, '\\"')}" + " limit " + offsetIndex + ", 200";\n        queryMap = Map();\n        queryMap.put("select_query", queryStr);\n        \n        response = zoho.crm.coql(queryMap);\n        batchData = response.get("data");\n        \n        if(batchData != null && batchData.size() > 0)\n        {\n            allRecords.addAll(batchData);\n            info "Fetched batch at offset " + offsetIndex + " (" + batchData.size() + " records)";\n            \n            // If returned less than 200, this is the last page\n            if(batchData.size() < 200)\n            {\n                hasMore = false;\n            }\n            else\n            {\n                offsetIndex = offsetIndex + 200;\n            }\n        }\n        else\n        {\n            hasMore = false;\n        }\n    }\n}\n\ninfo "Total ${moduleName} retrieved: " + allRecords.size();`;
        }

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
