/**
 * PAROT ZOHO DEVSTUDIO - Tool 12: Deluge HMAC & Cryptographic Signer
 * Generates Deluge HMAC-SHA256, SHA256, MD5, and Base64 signatures for
 * authenticating incoming webhooks (Shopify, Stripe, Meta, GitHub).
 */

window.HmacSignerTool = {
    init() {
        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const algoSelect = document.getElementById('hmac-algo');
        const secretInput = document.getElementById('hmac-secret');
        const payloadInput = document.getElementById('hmac-payload');

        [algoSelect, secretInput, payloadInput].forEach(el => {
            if (el) el.addEventListener('input', () => this.update());
        });
    },

    update() {
        const algo = document.getElementById('hmac-algo')?.value || 'hmac_sha256';
        const secret = document.getElementById('hmac-secret')?.value.trim() || 'PAROT_SECRET_KEY_123';
        const payload = document.getElementById('hmac-payload')?.value.trim() || '{"event":"charge.successful","amount":1500}';
        const outputElem = document.getElementById('hmac-output');

        let script = '';

        if (algo === 'hmac_sha256') {
            script = `// ========================================================\n// Deluge HMAC-SHA256 Signature Verification\n// Standard authentication for Shopify, Stripe, GitHub webhooks\n// ========================================================\nsecretKey = "${secret.replace(/"/g, '\\"')}";\nrawPayload = '${payload.replace(/'/g, "\\'")}';\n\n// Compute HMAC-SHA256 Digest via Deluge\ncomputedSignature = zoho.encryption.hmacSha256(rawPayload, secretKey);\ninfo "Computed Hash: " + computedSignature;\n\n// Example: Compare with incoming webhook header\n// incomingHeader = crmAPIRequest.get("headers").get("x-hub-signature-256");\n// if(computedSignature == incomingHeader)\n// {\n//     info "Signature verified! Processing payload...";\n// }\n// else\n// {\n//     return {"code": 401, "message": "Invalid Webhook Signature"};\n// }`;
        } else if (algo === 'md5') {
            script = `// Compute MD5 Hash in Deluge\ninputString = "${payload.replace(/"/g, '\\"')}";\nmd5Hash = zoho.encryption.md5(inputString);\ninfo "MD5 Hash: " + md5Hash;`;
        } else if (algo === 'sha256') {
            script = `// Compute SHA-256 Hash in Deluge\ninputString = "${payload.replace(/"/g, '\\"')}";\nsha256Hash = zoho.encryption.sha256(inputString);\ninfo "SHA-256 Hash: " + sha256Hash;`;
        }

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }
    }
};
