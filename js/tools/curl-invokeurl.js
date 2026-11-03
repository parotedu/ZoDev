/**
 * PAROT ZOHO DEVTOOLS - Tool 2: cURL to Deluge `invokeurl` Converter
 * Parses standard cURL commands and generates complete, production-ready
 * Deluge `invokeurl` blocks with headers, parameters, and response handlers.
 */

window.CurlInvokeurlTool = {
    presets: {
        stripe_charge: `curl https://api.stripe.com/v1/charges \\
  -u sk_test_51MzAbc1234567890: \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_visa \\
  -d description="Charge for PAROT Services"`,

        json_post: `curl -X POST "https://api.example.com/v1/leads" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json" \\
  -d '{"first_name":"Sohib","last_name":"Khaled","company":"PAROT Corp","email":"sohib@parotcorp.com"}'`,

        zoho_api: `curl "https://www.zohoapis.com/crm/v6/Leads/search?email=sohib@parotcorp.com" \\
  -H "Authorization: Zoho-oauthtoken 1000.abcd1234efgh5678..."`
    },

    init() {
        this.bindEvents();
        const inputArea = document.getElementById('curl-input');
        if (inputArea && !inputArea.value) {
            inputArea.value = this.presets.json_post;
            this.convert();
        }
    },

    bindEvents() {
        const inputArea = document.getElementById('curl-input');
        const connInput = document.getElementById('curl-connection-name');
        const detailedCheckbox = document.getElementById('curl-detailed');
        const presetSelect = document.getElementById('curl-preset-select');
        const clearBtn = document.getElementById('curl-btn-clear');

        if (inputArea) {
            inputArea.addEventListener('input', () => this.convert());
        }
        if (connInput) {
            connInput.addEventListener('input', () => this.convert());
        }
        if (detailedCheckbox) {
            detailedCheckbox.addEventListener('change', () => this.convert());
        }
        if (presetSelect) {
            presetSelect.addEventListener('change', (e) => {
                if (this.presets[e.target.value]) {
                    inputArea.value = this.presets[e.target.value];
                    this.convert();
                }
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                inputArea.value = '';
                document.getElementById('curl-output').textContent = '// Paste a cURL command above to generate invokeurl';
            });
        }
    },

    parseCurl(rawCurl) {
        let text = rawCurl.trim();
        // Remove line continuations \
        text = text.replace(/\\\r?\n/g, ' ');

        let method = 'GET';
        let url = '';
        const headers = [];
        let data = '';
        let auth = null;

        // Tokenize respecting quotes
        const tokens = [];
        const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            tokens.push(match[1] || match[2] || match[0]);
        }

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token === 'curl') continue;

            if (token === '-X' || token === '--request') {
                method = tokens[++i]?.toUpperCase() || 'GET';
            } else if (token === '-H' || token === '--header') {
                const headerVal = tokens[++i];
                if (headerVal) {
                    const colonIdx = headerVal.indexOf(':');
                    if (colonIdx > -1) {
                        const hKey = headerVal.substring(0, colonIdx).trim();
                        const hVal = headerVal.substring(colonIdx + 1).trim();
                        headers.push({ key: hKey, value: hVal });
                    }
                }
            } else if (token === '-d' || token === '--data' || token === '--data-raw' || token === '--data-binary') {
                const bodyPart = tokens[++i] || '';
                data = data ? `${data}&${bodyPart}` : bodyPart;
                if (method === 'GET') method = 'POST';
            } else if (token === '-u' || token === '--user') {
                auth = tokens[++i];
            } else if (!token.startsWith('-') && !url) {
                url = token;
            }
        }

        return { method, url, headers, data, auth };
    },

    convert() {
        const rawCurl = document.getElementById('curl-input').value.trim();
        const connName = document.getElementById('curl-connection-name')?.value.trim();
        const isDetailed = document.getElementById('curl-detailed')?.checked ?? true;
        const outputElem = document.getElementById('curl-output');

        if (!rawCurl) {
            outputElem.textContent = '// Paste a cURL command above to generate Deluge invokeurl';
            return;
        }

        try {
            const parsed = this.parseCurl(rawCurl);
            const script = this.generateDelugeScript(parsed, connName, isDetailed);
            outputElem.textContent = script;
            if (window.Prism) {
                Prism.highlightElement(outputElem);
            }
        } catch (err) {
            outputElem.textContent = `// Error parsing cURL: ${err.message}`;
        }
    },

    generateDelugeScript(parsed, connectionName, isDetailed) {
        const { method, url, headers, data, auth } = parsed;
        let lines = [];

        lines.push(`// ========================================================`);
        lines.push(`// Deluge invokeurl Generated by PAROT Zoho DevTools`);
        lines.push(`// Method: ${method} | Endpoint: ${url}`);
        lines.push(`// ========================================================\n`);

        // Headers
        if (headers.length > 0 || auth) {
            lines.push(`headers = Map();`);
            if (auth) {
                lines.push(`// Basic Authentication`);
                lines.push(`headers.put("Authorization", "Basic " + zoho.encryption.base64Encode("${auth}"));`);
            }
            headers.forEach(h => {
                // If using connection, user might skip Bearer token
                if (connectionName && h.key.toLowerCase() === 'authorization') {
                    lines.push(`// Note: Authorization header omitted because Zoho Connection "${connectionName}" handles it`);
                } else {
                    lines.push(`headers.put("${h.key}", "${h.value.replace(/"/g, '\\"')}");`);
                }
            });
            lines.push('');
        }

        // Body / Parameters
        let hasParams = false;
        let isJsonBody = false;

        if (data) {
            hasParams = true;
            // Check if data is valid JSON
            try {
                const jsonObj = JSON.parse(data);
                isJsonBody = true;
                lines.push(`// Request JSON Payload`);
                lines.push(`payload = Map();`);
                for (const [k, v] of Object.entries(jsonObj)) {
                    if (typeof v === 'string') {
                        lines.push(`payload.put("${k}", "${v.replace(/"/g, '\\"')}");`);
                    } else if (typeof v === 'object' && v !== null) {
                        lines.push(`payload.put("${k}", ${JSON.stringify(v)});`);
                    } else {
                        lines.push(`payload.put("${k}", ${v});`);
                    }
                }
                lines.push('');
            } catch (e) {
                // Not JSON, probably URL encoded form data or raw text
                const params = new URLSearchParams(data);
                const entries = Array.from(params.entries());
                if (entries.length > 0 && data.includes('=')) {
                    lines.push(`// Request Form Parameters`);
                    lines.push(`payload = Map();`);
                    entries.forEach(([k, v]) => {
                        lines.push(`payload.put("${k}", "${v.replace(/"/g, '\\"')}");`);
                    });
                    lines.push('');
                } else {
                    lines.push(`// Raw String Payload`);
                    lines.push(`payload = "${data.replace(/"/g, '\\"')}";\n`);
                }
            }
        }

        // invokeurl block
        lines.push(`response = invokeurl`);
        lines.push(`[`);
        lines.push(`    url: "${url}"`);
        lines.push(`    type: ${method}`);

        if (connectionName) {
            lines.push(`    connection: "${connectionName}"`);
        }

        if (headers.length > 0 || auth) {
            lines.push(`    headers: headers`);
        }

        if (hasParams) {
            if (isJsonBody) {
                lines.push(`    parameters: payload.toString()`);
            } else {
                lines.push(`    parameters: payload`);
            }
        }

        if (isDetailed) {
            lines.push(`    detailed: true`);
        }

        lines.push(`];\n`);

        // Response validation logic
        if (isDetailed) {
            lines.push(`// Response Logging and Validation`);
            lines.push(`httpCode = response.get("responseCode");`);
            lines.push(`responseText = response.get("responseText");`);
            lines.push(`info "HTTP Status Code: " + httpCode;\n`);
            lines.push(`if(httpCode == 200 || httpCode == 201)`);
            lines.push(`{`);
            lines.push(`    resultData = responseText.toMap();`);
            lines.push(`    info "API Response Data: " + resultData;`);
            lines.push(`}`);
            lines.push(`else`);
            lines.push(`{`);
            lines.push(`    info "API Request Failed with status " + httpCode + ": " + responseText;`);
            lines.push(`}`);
        } else {
            lines.push(`info "Response: " + response;`);
        }

        return lines.join('\n');
    }
};
