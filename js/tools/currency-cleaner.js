/**
 * PAROT ZOHO DEVSTUDIO - Tool 16: Deluge Number, Currency & Arabic Numerals Cleaner
 * Cleans Eastern Arabic numerals (١٢٣٤٥٦٧٨٩٠) to Western digits (1234567890),
 * formats currencies, and provides rounding logic for financial Deluge scripts.
 */

window.CurrencyCleanerTool = {
    init() {
        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const inputSample = document.getElementById('num-sample');
        const modeSelect = document.getElementById('num-mode');

        [inputSample, modeSelect].forEach(el => {
            if (el) el.addEventListener('input', () => this.update());
        });
    },

    update() {
        const sample = document.getElementById('num-sample')?.value.trim() || '١٢٥٠٠.٧٥';
        const mode = document.getElementById('num-mode')?.value || 'arabic_to_western';
        const outputElem = document.getElementById('num-output');

        let script = '';

        if (mode === 'arabic_to_western') {
            script = `// ========================================================\n// Convert Eastern Arabic Numerals (١٢٣٤٥) to Standard Digits\n// Prevents .toDecimal() / .toLong() fatal exceptions in Deluge\n// ========================================================\nrawInput = "${sample}";\ncleanStr = rawInput;\n\n// Sequential character translation for Eastern Arabic digits\ncleanStr = cleanStr.replaceAll("٠", "0");\ncleanStr = cleanStr.replaceAll("١", "1");\ncleanStr = cleanStr.replaceAll("٢", "2");\ncleanStr = cleanStr.replaceAll("٣", "3");\ncleanStr = cleanStr.replaceAll("٤", "4");\ncleanStr = cleanStr.replaceAll("٥", "5");\ncleanStr = cleanStr.replaceAll("٦", "6");\ncleanStr = cleanStr.replaceAll("٧", "7");\ncleanStr = cleanStr.replaceAll("٨", "8");\ncleanStr = cleanStr.replaceAll("٩", "9");\ncleanStr = cleanStr.replaceAll("،", ".");\n\n// Safe Deluge Decimal Conversion\nparsedAmount = cleanStr.toDecimal();\ninfo "Normalized Number: " + parsedAmount;`;
        } else if (mode === 'currency_format') {
            script = `// Format Decimal as Two-Digit Currency with Symbol in Deluge\namount = 12500.5;\ncurrencySymbol = "USD $";\n\n// Round to 2 decimal places\nroundedAmount = amount.round(2);\n\n// Currency string representation\nformattedCurrency = currencySymbol + " " + roundedAmount.toString();\ninfo "Formatted Currency: " + formattedCurrency;`;
        }

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
