/**
 * PAROT ZOHO DEVSTUDIO - Tool 11: Deluge Map & Payload Comparator (Diff)
 * Compares two JSON/Map payloads and generates Deluge code that updates
 * ONLY changed or newly added fields in Zoho CRM.
 */

window.PayloadDiffTool = {
    init() {
        this.bindEvents();
        this.compare();
    },

    bindEvents() {
        const oldInput = document.getElementById('diff-old-json');
        const newInput = document.getElementById('diff-new-json');
        const btnCompare = document.getElementById('diff-btn-run');

        [oldInput, newInput].forEach(el => {
            if (el) el.addEventListener('input', () => this.compare());
        });

        if (btnCompare) {
            btnCompare.addEventListener('click', () => this.compare());
        }
    },

    compare() {
        const oldStr = document.getElementById('diff-old-json')?.value.trim();
        const newStr = document.getElementById('diff-new-json')?.value.trim();
        const outputElem = document.getElementById('diff-output');
        const summaryElem = document.getElementById('diff-summary');

        if (!oldStr || !newStr) return;

        try {
            const oldObj = JSON.parse(oldStr);
            const newObj = JSON.parse(newStr);

            const modified = [];
            const added = [];
            const removed = [];

            // Find modified and added
            for (const [k, v] of Object.entries(newObj)) {
                if (!(k in oldObj)) {
                    added.push({ key: k, newVal: v });
                } else if (JSON.stringify(oldObj[k]) !== JSON.stringify(v)) {
                    modified.push({ key: k, oldVal: oldObj[k], newVal: v });
                }
            }

            for (const k of Object.keys(oldObj)) {
                if (!(k in newObj)) {
                    removed.push(k);
                }
            }

            if (summaryElem) {
                summaryElem.innerHTML = `
                    <span class="text-emerald-400 font-bold">+${added.length} Added</span> • 
                    <span class="text-amber-400 font-bold">~${modified.length} Modified</span> • 
                    <span class="text-rose-400 font-bold">-${removed.length} Removed</span>
                `;
            }

            // Generate Deluge script
            let script = `// ========================================================\n// Deluge Smart CRM Updater (Updates ONLY Changed Fields)\n// Prevents redundant workflow execution and saves API limits\n// ========================================================\nrecordId = "415086000003423001";\nupdateMap = Map();\n\n`;

            if (modified.length === 0 && added.length === 0) {
                script += `// No differences detected between payloads.\ninfo "Payloads are identical. Skipping CRM update.";`;
            } else {
                if (added.length > 0) {
                    script += `// Newly Added Fields:\n`;
                    added.forEach(item => {
                        script += `updateMap.put("${item.key}", ${typeof item.newVal === 'string' ? `"${item.newVal}"` : item.newVal});\n`;
                    });
                    script += `\n`;
                }

                if (modified.length > 0) {
                    script += `// Modified Fields:\n`;
                    modified.forEach(item => {
                        script += `// Old: ${JSON.stringify(item.oldVal)} -> New: ${JSON.stringify(item.newVal)}\nupdateMap.put("${item.key}", ${typeof item.newVal === 'string' ? `"${item.newVal}"` : item.newVal});\n`;
                    });
                    script += `\n`;
                }

                script += `if(updateMap.size() > 0)\n{\n    info "Updating " + updateMap.size() + " fields in Zoho CRM...";\n    response = zoho.crm.updateRecord("Leads", recordId, updateMap);\n    info "Update Response: " + response;\n}\nelse\n{\n    info "No fields changed. Skipped update.";\n}`;
            }

            if (outputElem) {
                outputElem.textContent = script;
                if (window.Prism) Prism.highlightElement(outputElem);
            }
        } catch (e) {
            if (outputElem) outputElem.textContent = `// Error parsing JSON: ${e.message}`;
        }
    }
};
