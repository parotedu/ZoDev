/**
 * PAROT ZOHO DEVSTUDIO - Tool 9: Zoho CRM Search Criteria Builder
 * Builds CRM search criteria strings e.g. "((Email:equals:xxx) and (Status:equals:yyy))"
 * for zoho.crm.searchRecordsByCriteria.
 */

window.CriteriaBuilderTool = {
    criteriaRows: [
        { field: "Email", comparator: "equals", value: "client@example.com", logic: "and" },
        { field: "Lead_Source", comparator: "equals", value: "Website", logic: "and" }
    ],

    init() {
        this.bindEvents();
        this.renderRows();
        this.update();
    },

    bindEvents() {
        const moduleSelect = document.getElementById('crit-module');
        const addBtn = document.getElementById('crit-btn-add');

        if (moduleSelect) {
            moduleSelect.addEventListener('change', () => this.update());
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.criteriaRows.push({ field: "Annual_Revenue", comparator: "greater_than", value: "50000", logic: "and" });
                this.renderRows();
                this.update();
            });
        }
    },

    renderRows() {
        const container = document.getElementById('crit-rows-container');
        if (!container) return;

        container.innerHTML = '';
        this.criteriaRows.forEach((row, index) => {
            const rowElem = document.createElement('div');
            rowElem.className = 'flex flex-wrap items-center gap-2 p-2 bg-[#060810] border border-white/10 rounded-lg text-xs';

            if (index > 0) {
                const logicSelect = document.createElement('select');
                logicSelect.className = 'bg-[#0F1320] border border-white/15 text-parot-pink rounded px-2 py-1 font-semibold outline-none';
                logicSelect.innerHTML = `<option value="and" ${row.logic === 'and' ? 'selected' : ''}>AND</option><option value="or" ${row.logic === 'or' ? 'selected' : ''}>OR</option>`;
                logicSelect.addEventListener('change', (e) => {
                    row.logic = e.target.value;
                    this.update();
                });
                rowElem.appendChild(logicSelect);
            }

            const fieldInput = document.createElement('input');
            fieldInput.type = 'text';
            fieldInput.className = 'bg-[#0F1320] border border-white/15 text-white rounded px-2.5 py-1 flex-1 min-w-[120px] font-mono outline-none';
            fieldInput.placeholder = 'Field API Name';
            fieldInput.value = row.field;
            fieldInput.addEventListener('input', (e) => {
                row.field = e.target.value.trim();
                this.update();
            });

            const compSelect = document.createElement('select');
            compSelect.className = 'bg-[#0F1320] border border-white/15 text-white rounded px-2 py-1 outline-none';
            const comps = [
                { id: "equals", label: "equals" },
                { id: "starts_with", label: "starts_with" },
                { id: "contains", label: "contains" },
                { id: "not_equal", label: "not_equal" },
                { id: "greater_than", label: "greater_than" },
                { id: "less_than", label: "less_than" }
            ];
            compSelect.innerHTML = comps.map(c => `<option value="${c.id}" ${row.comparator === c.id ? 'selected' : ''}>${c.label}</option>`).join('');
            compSelect.addEventListener('change', (e) => {
                row.comparator = e.target.value;
                this.update();
            });

            const valInput = document.createElement('input');
            valInput.type = 'text';
            valInput.className = 'bg-[#0F1320] border border-white/15 text-white rounded px-2.5 py-1 flex-1 min-w-[120px] font-mono outline-none';
            valInput.placeholder = 'Value';
            valInput.value = row.value;
            valInput.addEventListener('input', (e) => {
                row.value = e.target.value;
                this.update();
            });

            const delBtn = document.createElement('button');
            delBtn.className = 'text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded hover:bg-white/5';
            delBtn.textContent = '✕';
            delBtn.addEventListener('click', () => {
                this.criteriaRows.splice(index, 1);
                this.renderRows();
                this.update();
            });

            rowElem.appendChild(fieldInput);
            rowElem.appendChild(compSelect);
            rowElem.appendChild(valInput);
            rowElem.appendChild(delBtn);

            container.appendChild(rowElem);
        });
    },

    buildCriteriaString() {
        if (this.criteriaRows.length === 0) return '()';
        if (this.criteriaRows.length === 1) {
            const r = this.criteriaRows[0];
            return `(${r.field}:${r.comparator}:${r.value})`;
        }

        let result = `(${this.criteriaRows[0].field}:${this.criteriaRows[0].comparator}:${this.criteriaRows[0].value})`;
        for (let i = 1; i < this.criteriaRows.length; i++) {
            const r = this.criteriaRows[i];
            result = `(${result} ${r.logic} (${r.field}:${r.comparator}:${r.value}))`;
        }
        return result;
    },

    update() {
        const moduleName = document.getElementById('crit-module')?.value || 'Leads';
        const criteria = this.buildCriteriaString();
        const outputElem = document.getElementById('crit-output');

        const script = `// Zoho CRM Search by Criteria
criteriaString = "${criteria}";
info "Executing Criteria: " + criteriaString;

// Search records in CRM module "${moduleName}"
matchingRecords = zoho.crm.searchRecordsByCriteria("${moduleName}", criteriaString);

if(matchingRecords != null && matchingRecords.size() > 0)
{
    info "Found " + matchingRecords.size() + " matching records in ${moduleName}:";
    for each record in matchingRecords
    {
        info "ID: " + record.get("id");
    }
}
else
{
    info "No records found matching criteria.";
}`;

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
