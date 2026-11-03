/**
 * PAROT ZOHO DEVTOOLS - Tool 1: JSON to Deluge Interactive Explorer & Mapper
 * Allows interactive exploration of JSON, click-to-map to Deluge,
 * batch CRM record mapping, and Deluge constructor generation.
 */

window.JsonDelugeTool = {
    // Current parsed state
    parsedData: null,
    selectedNode: null,
    checkedNodes: new Set(), // Set of path strings for batch mapping
    rootVarName: "response",
    targetModule: "Leads",
    activeMode: "chain", // 'chain', 'safe', 'typed', 'constructor'

    // Sample Presets
    presets: {
        crm_lead: {
            data: [
                {
                    id: "415086000003423001",
                    First_Name: "Sohib",
                    Last_Name: "Khaled",
                    Company: "PAROT Corp",
                    Email: "sohib@parotcorp.com",
                    Phone: "+201012345678",
                    Lead_Source: "Website Form",
                    Annual_Revenue: 250000.50,
                    Owner: {
                        name: "Sales Admin",
                        id: "415086000000287001",
                        email: "admin@parotcorp.com"
                    },
                    Tags: ["VIP", "Enterprise", "Q4"],
                    Address_Information: {
                        City: "Cairo",
                        Country: "Egypt",
                        Zip_Code: "11511"
                    },
                    Email_Opt_Out: false
                }
            ],
            info: {
                per_page: 200,
                count: 1,
                page: 1,
                more_records: false
            }
        },
        books_invoice: {
            code: 0,
            message: "success",
            invoice: {
                invoice_number: "INV-2026-089",
                customer_name: "Acme Middle East",
                customer_id: "982000000184712",
                date: "2026-11-02",
                due_date: "2026-11-16",
                currency_code: "USD",
                line_items: [
                    {
                        item_id: "982000000091234",
                        name: "Custom Software Engineering",
                        rate: 1500.00,
                        quantity: 10,
                        item_total: 15000.00
                    },
                    {
                        item_id: "982000000091235",
                        name: "Cloud Architecture Setup",
                        rate: 2500.00,
                        quantity: 1,
                        item_total: 2500.00
                    }
                ],
                sub_total: 17500.00,
                tax_total: 2450.00,
                total: 19950.00,
                status: "sent"
            }
        },
        webhook_payload: {
            event: "payment.succeeded",
            timestamp: 1793579000,
            data: {
                charge_id: "ch_3N8k2aLkd8912",
                amount: 49900,
                currency: "usd",
                customer: {
                    id: "cus_P827364",
                    email: "client@enterprise.com",
                    name: "Tariq Mansour"
                },
                metadata: {
                    zoho_crm_deal_id: "41508600000987654",
                    invoice_ref: "PAROT-9921"
                }
            }
        }
    },

    init() {
        this.bindEvents();
        // Load default preset on initialization
        this.loadPreset('crm_lead');
    },

    bindEvents() {
        const inputArea = document.getElementById('json-input');
        const rootVarInput = document.getElementById('json-root-var');
        const moduleSelect = document.getElementById('json-target-module');
        const formatBtn = document.getElementById('json-btn-format');
        const minifyBtn = document.getElementById('json-btn-minify');
        const clearBtn = document.getElementById('json-btn-clear');
        const presetSelect = document.getElementById('json-preset-select');
        const selectAllBtn = document.getElementById('json-btn-select-all');
        const deselectAllBtn = document.getElementById('json-btn-deselect-all');
        const modeButtons = document.querySelectorAll('.json-mode-btn');

        if (inputArea) {
            inputArea.addEventListener('input', () => this.handleInputChange());
        }

        if (rootVarInput) {
            rootVarInput.addEventListener('input', (e) => {
                this.rootVarName = e.target.value.trim() || 'response';
                this.updateDelugeOutput();
            });
        }

        if (moduleSelect) {
            moduleSelect.addEventListener('change', (e) => {
                this.targetModule = e.target.value;
                this.updateDelugeOutput();
            });
        }

        if (formatBtn) {
            formatBtn.addEventListener('click', () => this.formatJson());
        }

        if (minifyBtn) {
            minifyBtn.addEventListener('click', () => this.minifyJson());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                inputArea.value = '';
                this.parsedData = null;
                this.selectedNode = null;
                this.checkedNodes.clear();
                this.renderTree();
                this.updateDelugeOutput();
            });
        }

        if (presetSelect) {
            presetSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.loadPreset(e.target.value);
                }
            });
        }

        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => this.selectAllLeaves());
        }

        if (deselectAllBtn) {
            deselectAllBtn.addEventListener('click', () => {
                this.checkedNodes.clear();
                this.renderTree();
                this.updateDelugeOutput();
            });
        }

        modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeMode = btn.dataset.mode;
                this.updateDelugeOutput();
            });
        });
    },

    loadPreset(presetKey) {
        if (!this.presets[presetKey]) return;
        const inputArea = document.getElementById('json-input');
        inputArea.value = JSON.stringify(this.presets[presetKey], null, 2);
        this.handleInputChange();
    },

    formatJson() {
        const inputArea = document.getElementById('json-input');
        try {
            const parsed = JSON.parse(inputArea.value);
            inputArea.value = JSON.stringify(parsed, null, 2);
            this.handleInputChange();
            window.App?.showToast('JSON Formatted successfully', 'success');
        } catch (err) {
            window.App?.showToast('Invalid JSON: ' + err.message, 'error');
        }
    },

    minifyJson() {
        const inputArea = document.getElementById('json-input');
        try {
            const parsed = JSON.parse(inputArea.value);
            inputArea.value = JSON.stringify(parsed);
            this.handleInputChange();
            window.App?.showToast('JSON Minified', 'success');
        } catch (err) {
            window.App?.showToast('Invalid JSON: ' + err.message, 'error');
        }
    },

    handleInputChange() {
        const input = document.getElementById('json-input').value.trim();
        const errorBox = document.getElementById('json-error-msg');
        const treeContainer = document.getElementById('json-tree-container');

        if (!input) {
            this.parsedData = null;
            this.selectedNode = null;
            this.checkedNodes.clear();
            errorBox.classList.add('hidden');
            treeContainer.innerHTML = `<div class="text-gray-400 text-sm italic py-8 text-center" data-i18n="t1_empty_tree">Paste valid JSON above to explore nodes</div>`;
            this.updateDelugeOutput();
            return;
        }

        try {
            this.parsedData = JSON.parse(input);
            errorBox.classList.add('hidden');
            this.renderTree();
            // Default select the first interesting leaf or root if nothing selected
            if (!this.selectedNode) {
                this.autoSelectFirstLeaf(this.parsedData, []);
            }
            this.updateDelugeOutput();
        } catch (err) {
            errorBox.textContent = `⚠️ Syntax Error: ${err.message}`;
            errorBox.classList.remove('hidden');
        }
    },

    autoSelectFirstLeaf(obj, path) {
        if (obj === null || typeof obj !== 'object') {
            this.selectedNode = { path, value: obj, type: this.getType(obj) };
            return;
        }
        for (const [key, val] of Object.entries(obj)) {
            const newPath = [...path, Array.isArray(obj) ? Number(key) : key];
            if (val === null || typeof val !== 'object') {
                this.selectedNode = { path: newPath, value: val, type: this.getType(val) };
                return;
            } else {
                this.autoSelectFirstLeaf(val, newPath);
                if (this.selectedNode) return;
            }
        }
    },

    getType(val) {
        if (val === null) return 'null';
        if (Array.isArray(val)) return 'list';
        if (typeof val === 'object') return 'map';
        return typeof val; // 'string', 'number', 'boolean'
    },

    renderTree() {
        const treeContainer = document.getElementById('json-tree-container');
        if (!this.parsedData) return;

        treeContainer.innerHTML = '';
        const rootElement = document.createElement('div');
        rootElement.className = 'font-mono text-sm leading-relaxed';
        this.buildTreeNode(this.parsedData, [], rootElement, true);
        treeContainer.appendChild(rootElement);
    },

    buildTreeNode(data, path, container, isRoot = false) {
        const type = this.getType(data);
        const pathStr = JSON.stringify(path);
        const isSelected = this.selectedNode && JSON.stringify(this.selectedNode.path) === pathStr;

        if (type === 'map' || type === 'list') {
            const isArray = type === 'list';
            const entries = Object.entries(data);
            const count = entries.length;

            const nodeRow = document.createElement('div');
            nodeRow.className = `tree-node-row ${isSelected ? 'selected' : ''}`;

            // Left side: toggle + key/index
            const leftSide = document.createElement('div');
            leftSide.className = 'flex items-center gap-1.5';

            // Caret toggle
            const toggle = document.createElement('span');
            toggle.className = 'text-slate-500 hover:text-white transition-colors text-xs font-bold inline-block w-4 text-center select-none';
            toggle.textContent = '▼';

            leftSide.appendChild(toggle);

            if (!isRoot) {
                const lastKey = path[path.length - 1];
                const labelSpan = document.createElement('span');
                labelSpan.className = isArray ? 'text-parot-blue font-semibold' : 'json-key';
                labelSpan.textContent = typeof lastKey === 'number' ? `[${lastKey}]` : `"${lastKey}": `;
                leftSide.appendChild(labelSpan);
            }

            // Type Badge
            const badge = document.createElement('span');
            badge.className = `type-badge ${isArray ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}`;
            badge.textContent = isArray ? `List (${count})` : `Map (${count})`;

            nodeRow.appendChild(leftSide);
            nodeRow.appendChild(badge);

            // Click node to select as target
            nodeRow.addEventListener('click', (e) => {
                if (e.target === toggle) return;
                this.selectNode(path, data, type);
            });

            container.appendChild(nodeRow);

            // Children container
            const childrenWrapper = document.createElement('div');
            childrenWrapper.className = 'pl-4 border-l border-white/10 ml-2 my-0.5';

            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isCollapsed = childrenWrapper.classList.toggle('hidden');
                toggle.textContent = isCollapsed ? '▶' : '▼';
            });

            entries.forEach(([key, childVal]) => {
                const childPath = [...path, isArray ? Number(key) : key];
                this.buildTreeNode(childVal, childPath, childrenWrapper);
            });

            container.appendChild(childrenWrapper);
        } else {
            // Leaf node (primitive value)
            const nodeRow = document.createElement('div');
            nodeRow.className = `tree-node-row group ${isSelected ? 'selected' : ''}`;

            const leftContent = document.createElement('div');
            leftContent.className = 'flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap';

            // Checkbox for batch mapping
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'w-3.5 h-3.5 rounded border-white/20 text-parot-purple bg-[#05060A] cursor-pointer flex-shrink-0';
            checkbox.checked = this.checkedNodes.has(pathStr);
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                if (checkbox.checked) {
                    this.checkedNodes.add(pathStr);
                } else {
                    this.checkedNodes.delete(pathStr);
                }
                this.updateDelugeOutput();
            });

            // Key name
            const lastKey = path[path.length - 1];
            const keySpan = document.createElement('span');
            keySpan.className = typeof lastKey === 'number' ? 'text-parot-blue font-semibold' : 'json-key';
            keySpan.textContent = typeof lastKey === 'number' ? `[${lastKey}]: ` : `"${lastKey}": `;

            // Value representation
            const valSpan = document.createElement('span');
            valSpan.className = `json-${type} truncate max-w-xs md:max-w-md`;
            valSpan.textContent = type === 'string' ? `"${data}"` : String(data);

            leftContent.appendChild(checkbox);
            leftContent.appendChild(keySpan);
            leftContent.appendChild(valSpan);

            // Right side: Type badge
            const rightContent = document.createElement('div');
            rightContent.className = 'flex items-center gap-1.5 flex-shrink-0';

            const typeBadge = document.createElement('span');
            typeBadge.className = `type-badge ${
                type === 'string' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                type === 'number' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                type === 'boolean' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' :
                'bg-slate-500/20 text-slate-300 border border-slate-500/30'
            }`;
            typeBadge.textContent = type;

            rightContent.appendChild(typeBadge);

            nodeRow.appendChild(leftContent);
            nodeRow.appendChild(rightContent);

            nodeRow.addEventListener('click', (e) => {
                if (e.target === checkbox) return;
                this.selectNode(path, data, type);
            });

            container.appendChild(nodeRow);
        }
    },

    selectNode(path, value, type) {
        this.selectedNode = { path, value, type };
        this.renderTree();
        this.updateDelugeOutput();
    },

    selectAllLeaves() {
        this.checkedNodes.clear();
        const traverse = (obj, path) => {
            if (obj === null || typeof obj !== 'object') {
                this.checkedNodes.add(JSON.stringify(path));
                return;
            }
            for (const [k, v] of Object.entries(obj)) {
                traverse(v, [...path, Array.isArray(obj) ? Number(k) : k]);
            }
        };
        if (this.parsedData) {
            traverse(this.parsedData, []);
        }
        this.renderTree();
        this.updateDelugeOutput();
    },

    generatePathExpression(path, rootVar = this.rootVarName) {
        if (!path || path.length === 0) return rootVar;
        let expr = rootVar;
        for (const segment of path) {
            if (typeof segment === 'number') {
                expr += `.get(${segment})`;
            } else {
                expr += `.get("${segment}")`;
            }
        }
        return expr;
    },

    generateDelugeOutput() {
        if (!this.parsedData) {
            return '// Paste JSON to generate Deluge code';
        }

        // If user chose constructor mode:
        if (this.activeMode === 'constructor') {
            return this.generateDelugeConstructor(this.parsedData, this.rootVarName);
        }

        // Check if there are checked nodes for Batch CRM Mapping
        if (this.checkedNodes.size > 0) {
            return this.generateBatchMappingScript();
        }

        // Otherwise generate single node extraction
        if (!this.selectedNode) {
            return '// Click any node in the JSON tree to generate its Deluge extraction script';
        }

        return this.generateSingleNodeScript(this.selectedNode);
    },

    generateSingleNodeScript(node) {
        const { path, value, type } = node;
        const lastKey = path.length > 0 ? path[path.length - 1] : 'val';
        // Clean variable name for Deluge
        const varName = (typeof lastKey === 'number' ? `item_${lastKey}` : String(lastKey))
            .replace(/[^a-zA-Z0-9_]/g, '') || 'extractedVal';

        const pathExpr = this.generatePathExpression(path);

        if (this.activeMode === 'chain') {
            return `// Extract "${lastKey}" from ${this.rootVarName}\n${varName} = ${pathExpr};\ninfo "${varName}: " + ${varName};`;
        }

        if (this.activeMode === 'typed') {
            let cast = '';
            if (type === 'number') {
                cast = Number.isInteger(value) ? '.toLong()' : '.toDecimal()';
            } else if (type === 'string') {
                cast = '.toString()';
            } else if (type === 'boolean') {
                cast = '';
            } else if (type === 'list') {
                cast = '.toList()';
            } else if (type === 'map') {
                cast = '.toMap()';
            }
            return `// Type-Cast extraction for "${lastKey}" (${type})\n${varName} = ${pathExpr}${cast};\ninfo "${varName} (" + ${varName} + ") [Type: ${type}]";`;
        }

        if (this.activeMode === 'safe') {
            // Generate robust nested safe checks for Deluge
            let script = `// Null-Safe extraction for "${lastKey}"\n${varName} = null;\n`;
            let currentPath = [];
            let indent = '';

            for (let i = 0; i < path.length; i++) {
                const seg = path[i];
                const currentExpr = this.generatePathExpression(currentPath);
                if (typeof seg === 'number') {
                    script += `${indent}if(!isNull(${currentExpr}) && ${currentExpr}.size() > ${seg})\n${indent}{\n`;
                } else {
                    script += `${indent}if(!isNull(${currentExpr}) && ${currentExpr}.containsKey("${seg}"))\n${indent}{\n`;
                }
                indent += '    ';
                currentPath.push(seg);
            }

            script += `${indent}${varName} = ${pathExpr};\n`;

            for (let i = path.length - 1; i >= 0; i--) {
                indent = indent.slice(4);
                script += `${indent}}\n`;
            }

            script += `info "${varName}: " + ${varName};`;
            return script;
        }

        return `${varName} = ${pathExpr};`;
    },

    generateBatchMappingScript() {
        const sortedPaths = Array.from(this.checkedNodes)
            .map(p => JSON.parse(p))
            .sort((a, b) => a.join('.').localeCompare(b.join('.')));

        const mapVar = `${this.targetModule.toLowerCase().replace(/[^a-z0-9]/g, '')}Map`;

        let lines = [];
        lines.push(`// =========================================================`);
        lines.push(`// PAROT Zoho CRM Record Mapping Generator`);
        lines.push(`// Target Module: ${this.targetModule}`);
        lines.push(`// Total Mapped Fields: ${sortedPaths.length}`);
        lines.push(`// =========================================================\n`);
        lines.push(`${mapVar} = Map();`);

        sortedPaths.forEach(path => {
            const rawKey = path[path.length - 1];
            const crmFieldKey = String(rawKey).replace(/\s+/g, '_');
            const pathExpr = this.generatePathExpression(path);
            lines.push(`${mapVar}.put("${crmFieldKey}", ${pathExpr});`);
        });

        lines.push(`\n// Create Record in Zoho CRM`);
        lines.push(`createResponse = zoho.crm.createRecord("${this.targetModule}", ${mapVar});`);
        lines.push(`info "CRM Response: " + createResponse;`);
        lines.push(`\nif(createResponse.get("id") != null)`);
        lines.push(`{`);
        lines.push(`    info "Successfully created record with ID: " + createResponse.get("id");`);
        lines.push(`}`);
        lines.push(`else`);
        lines.push(`{`);
        lines.push(`    info "Error creating ${this.targetModule}: " + createResponse;`);
        lines.push(`}`);

        return lines.join('\n');
    },

    generateDelugeConstructor(obj, varName = "myMap") {
        let code = [];
        code.push(`// Construct Deluge Map/List representation`);
        let counter = 1;

        const serialize = (val, currentVar) => {
            const t = this.getType(val);
            if (t === 'map') {
                code.push(`${currentVar} = Map();`);
                for (const [k, v] of Object.entries(val)) {
                    if (this.getType(v) === 'map' || this.getType(v) === 'list') {
                        const subVar = `sub_${k.replace(/[^a-zA-Z0-9]/g, '_')}_${counter++}`;
                        serialize(v, subVar);
                        code.push(`${currentVar}.put("${k}", ${subVar});`);
                    } else if (this.getType(v) === 'string') {
                        code.push(`${currentVar}.put("${k}", "${v.replace(/"/g, '\\"')}");`);
                    } else {
                        code.push(`${currentVar}.put("${k}", ${v === null ? 'null' : v});`);
                    }
                }
            } else if (t === 'list') {
                code.push(`${currentVar} = List();`);
                val.forEach(item => {
                    if (this.getType(item) === 'map' || this.getType(item) === 'list') {
                        const itemVar = `item_${counter++}`;
                        serialize(item, itemVar);
                        code.push(`${currentVar}.add(${itemVar});`);
                    } else if (this.getType(item) === 'string') {
                        code.push(`${currentVar}.add("${item.replace(/"/g, '\\"')}");`);
                    } else {
                        code.push(`${currentVar}.add(${item === null ? 'null' : item});`);
                    }
                });
            }
        };

        serialize(obj, varName);
        code.push(`info ${varName};`);
        return code.join('\n');
    },

    updateDelugeOutput() {
        const outputElem = document.getElementById('json-deluge-output');
        const breadcrumbElem = document.getElementById('json-active-path');
        const selectedBadge = document.getElementById('json-selected-badge');
        const batchBadge = document.getElementById('json-batch-count');

        if (batchBadge) {
            batchBadge.textContent = this.checkedNodes.size;
            batchBadge.parentElement.classList.toggle('hidden', this.checkedNodes.size === 0);
        }

        if (breadcrumbElem) {
            if (this.checkedNodes.size > 0) {
                breadcrumbElem.textContent = `Batch Selection: ${this.checkedNodes.size} fields selected for CRM mapping`;
            } else if (this.selectedNode) {
                breadcrumbElem.textContent = this.generatePathExpression(this.selectedNode.path);
            } else {
                breadcrumbElem.textContent = 'None selected';
            }
        }

        if (selectedBadge && this.selectedNode) {
            selectedBadge.textContent = this.selectedNode.type.toUpperCase();
            selectedBadge.className = `badge-tag ${
                this.selectedNode.type === 'string' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                this.selectedNode.type === 'number' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                this.selectedNode.type === 'boolean' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' :
                'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`;
        }

        if (outputElem) {
            const script = this.generateDelugeOutput();
            outputElem.textContent = script;
            // Trigger Prism highlighting if loaded
            if (window.Prism) {
                Prism.highlightElement(outputElem);
            }
        }
    }
};
