/**
 * PAROT ZOHO DEVSTUDIO - Tool 10: Deluge JSON ↔ XML Converter
 * Converts between JSON and XML and generates Deluge parsing / creation snippets.
 */

window.JsonXmlTool = {
    init() {
        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const inputArea = document.getElementById('jsonxml-input');
        const modeSelect = document.getElementById('jsonxml-mode');

        if (inputArea) inputArea.addEventListener('input', () => this.update());
        if (modeSelect) modeSelect.addEventListener('change', () => this.update());
    },

    update() {
        const input = document.getElementById('jsonxml-input')?.value.trim() || '{\n  "lead": {\n    "name": "Sohib Khaled",\n    "company": "PAROT Corp",\n    "email": "sohib@parotcorp.com"\n  }\n}';
        const mode = document.getElementById('jsonxml-mode')?.value || 'json_to_xml';
        const outputElem = document.getElementById('jsonxml-output');

        let script = '';

        if (mode === 'json_to_xml') {
            script = `// Convert Deluge Map to XML Document
payloadMap = Map();
leadData = Map();
leadData.put("name", "Sohib Khaled");
leadData.put("company", "PAROT Corp");
leadData.put("email", "sohib@parotcorp.com");
payloadMap.put("lead", leadData);

// Deluge built-in .toXML() method
xmlOutput = payloadMap.toXML();
info "Generated XML:\\n" + xmlOutput;

// Sending XML in invokeurl:
// headers = Map();
// headers.put("Content-Type", "application/xml");
// response = invokeurl [ url: "https://api.erp.com/xml", type: POST, parameters: xmlOutput, headers: headers ];`;
        } else {
            script = `// Parse Incoming XML Payload in Deluge
xmlString = "<root><lead><name>Sohib Khaled</name><company>PAROT Corp</company><email>sohib@parotcorp.com</email></lead></root>";

// Convert XML directly to Deluge Map using getJSON()
parsedMap = xmlString.getJSON();
info "Parsed Map from XML: " + parsedMap;

// Extract values safely
leadNode = parsedMap.get("root").get("lead");
leadName = leadNode.get("name");
leadCompany = leadNode.get("company");
info "Extracted: " + leadName + " (" + leadCompany + ")";`;
        }

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
