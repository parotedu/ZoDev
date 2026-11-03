/**
 * PAROT ZOHO DEVSTUDIO - Tool 13: Deluge Statement Limit Throttler & Pause Helper
 * Calculates statement consumption, generates safe break conditions, and
 * prevents the dreaded 5000 Deluge statement execution ceiling.
 */

window.StatementThrottlerTool = {
    init() {
        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const estStatements = document.getElementById('throttle-stmts-per-loop');
        const batchSize = document.getElementById('throttle-batch-size');

        [estStatements, batchSize].forEach(el => {
            if (el) el.addEventListener('input', () => this.update());
        });
    },

    update() {
        const stmtsPerLoop = parseInt(document.getElementById('throttle-stmts-per-loop')?.value || '15', 10);
        const batchSize = parseInt(document.getElementById('throttle-batch-size')?.value || '200', 10);
        const outputElem = document.getElementById('throttle-output');

        const totalEstimated = stmtsPerLoop * batchSize;
        const maxSafeIterations = Math.floor(4000 / stmtsPerLoop);

        let script = `// ========================================================\n// Deluge Statement Throttler & Safeguard\n// Estimated Statements Per Loop: ${stmtsPerLoop}\n// Max Safe Records per execution: ${maxSafeIterations} (Cap: 4,000 of 5,000 limit)\n// ========================================================\nprocessedCount = 0;\nsafetyCap = ${maxSafeIterations};\n\nfor each record in recordList\n{\n    // Check if we are approaching the 5000 statement limit\n    if(processedCount >= safetyCap)\n    {\n        info "Reached safety threshold of " + safetyCap + " records. Halting loop to prevent Deluge timeout.";\n        // Optionally schedule next batch or notify admin\n        break;\n    }\n    \n    // --- Your Processing Statements Here (${stmtsPerLoop} statements) ---\n    recordId = record.get("id");\n    phone = record.get("Phone");\n    if(!isNull(phone))\n    {\n        // update record logic\n    }\n    \n    processedCount = processedCount + 1;\n}\n\ninfo "Successfully processed " + processedCount + " records safely.";`;

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
