/**
 * PAROT ZOHO DEVTOOLS - Tool 7: Deluge String & Regex Assistant
 * Generates Deluge code for text cleanup, regex replacements, domain extraction,
 * encoding, and Deluge-specific string methods.
 */

window.StringRegexTool = {
    presets: [
        {
            id: "clean_phone",
            label: "Clean Phone Number (Keep digits only)",
            sample: "+20 (101) 234-5678 ext. 99",
            code: (s) => `// Strip non-digit characters from Phone Number\nrawPhone = "${s}";\ncleanPhone = rawPhone.replaceAll("[^0-9]", "");\ninfo "Clean Phone: " + cleanPhone; // Result: 20101234567899`
        },
        {
            id: "email_domain",
            label: "Extract Domain from Email Address",
            sample: "sohib@parotcorp.com",
            code: (s) => `// Extract Email Domain and Username in Deluge\nemailStr = "${s}";\nuserPart = emailStr.getPrefix("@");\ndomainPart = emailStr.getSuffix("@");\ninfo "User: " + userPart;\ninfo "Domain: " + domainPart;`
        },
        {
            id: "split_list",
            label: "Split CSV String into Deluge List",
            sample: "Apple, Banana, Mango, Orange",
            code: (s) => `// Split Comma-Separated String into Deluge List\ncsvString = "${s}";\nfruitList = csvString.toList(",");\nfor each fruit in fruitList\n{\n    info "Item: " + fruit.trim();\n}`
        },
        {
            id: "url_encode",
            label: "URL Encode / Decode in Deluge",
            sample: "https://parotcorp.com/search?q=Zoho Deluge & Tools",
            code: (s) => `// URL Encoding & Decoding via Deluge\nrawUrl = "${s}";\nencoded = zoho.encryption.urlEncode(rawUrl);\ndecoded = zoho.encryption.urlDecode(encoded);\ninfo "Encoded: " + encoded;\ninfo "Decoded: " + decoded;`
        },
        {
            id: "base64",
            label: "Base64 Encode / Decode",
            sample: "PAROT_ZOHO_SUPER_SECRET",
            code: (s) => `// Base64 Encoding and Decoding in Deluge\nrawString = "${s}";\nbase64Str = zoho.encryption.base64Encode(rawString);\noriginal = zoho.encryption.base64Decode(base64Str);\ninfo "Base64: " + base64Str;\ninfo "Decoded: " + original;`
        },
        {
            id: "mask_card",
            label: "Mask Sensitive String (Credit Card / SSN)",
            sample: "4150860012345678",
            code: (s) => `// Mask String leaving last 4 digits\nrawVal = "${s}";\nmasked = "************" + rawVal.subString(rawVal.length() - 4);\ninfo "Masked Value: " + masked;`
        }
    ],

    init() {
        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const opSelect = document.getElementById('str-op-select');
        const inputSample = document.getElementById('str-input-sample');

        if (opSelect) {
            opSelect.addEventListener('change', (e) => {
                const found = this.presets.find(p => p.id === e.target.value);
                if (found && inputSample) {
                    inputSample.value = found.sample;
                }
                this.update();
            });
        }

        if (inputSample) {
            inputSample.addEventListener('input', () => this.update());
        }
    },

    update() {
        const opId = document.getElementById('str-op-select')?.value || 'clean_phone';
        const sample = document.getElementById('str-input-sample')?.value || '+20 101 234 5678';
        const outputElem = document.getElementById('str-output');

        const preset = this.presets.find(p => p.id === opId) || this.presets[0];
        const script = preset.code(sample.replace(/"/g, '\\"'));

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
