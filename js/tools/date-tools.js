/**
 * PAROT ZOHO DEVTOOLS - Tool 3: Deluge Date & Time Swiss Knife
 * Interactive generator for Deluge date formatting, relative calculations,
 * workday adjustments, and timezone conversions.
 */

window.DateTools = {
    timezones: [
        { label: "Africa/Cairo (EET/EEST, GMT+2/3)", value: "Africa/Cairo" },
        { label: "Asia/Riyadh (KSA, GMT+3)", value: "Asia/Riyadh" },
        { label: "Asia/Dubai (UAE, GMT+4)", value: "Asia/Dubai" },
        { label: "UTC / GMT (Universal)", value: "UTC" },
        { label: "Europe/London (GMT/BST)", value: "Europe/London" },
        { label: "America/New_York (EST/EDT)", value: "America/New_York" },
        { label: "America/Los_Angeles (PST/PDT)", value: "America/Los_Angeles" },
        { label: "Asia/Kolkata (IST, GMT+5:30)", value: "Asia/Kolkata" }
    ],

    presets: [
        { id: "crm_date", label: "Zoho CRM Date (yyyy-MM-dd)", format: "yyyy-MM-dd", type: "date" },
        { id: "crm_datetime", label: "Zoho CRM DateTime (yyyy-MM-dd'T'HH:mm:ssXXX)", format: "yyyy-MM-dd'T'HH:mm:ssXXX", type: "time" },
        { id: "books_date", label: "Zoho Books (dd/MM/yyyy)", format: "dd/MM/yyyy", type: "date" },
        { id: "human_readable", label: "Human Friendly (dd MMM yyyy, hh:mm a)", format: "dd MMM yyyy, hh:mm a", type: "time" },
        { id: "timestamp_file", label: "File Name Timestamp (yyyyMMdd_HHmmss)", format: "yyyyMMdd_HHmmss", type: "time" }
    ],

    init() {
        this.bindEvents();
        this.update();
    },

    bindEvents() {
        const modeSelect = document.getElementById('date-op-mode');
        const tzSelect = document.getElementById('date-timezone');
        const presetSelect = document.getElementById('date-format-preset');
        const customFormatInput = document.getElementById('date-custom-format');
        const daysInput = document.getElementById('date-days-val');

        [modeSelect, tzSelect, presetSelect, customFormatInput, daysInput].forEach(elem => {
            if (elem) {
                elem.addEventListener('change', () => this.update());
                elem.addEventListener('input', () => this.update());
            }
        });
    },

    update() {
        const mode = document.getElementById('date-op-mode')?.value || 'format';
        const tz = document.getElementById('date-timezone')?.value || 'Africa/Cairo';
        const preset = document.getElementById('date-format-preset')?.value || 'crm_datetime';
        const customFmt = document.getElementById('date-custom-format')?.value.trim();
        const daysVal = parseInt(document.getElementById('date-days-val')?.value || '7', 10);

        const formatPattern = customFmt || (this.presets.find(p => p.id === preset)?.format || 'yyyy-MM-dd');
        const outputElem = document.getElementById('date-output');
        const previewElem = document.getElementById('date-live-preview');

        let script = '';
        let preview = '';
        const now = new Date();

        if (mode === 'format') {
            script = `// Format Current Time in Deluge with Timezone\ncurrentTimestamp = zoho.currenttime;\nformattedDate = currentTimestamp.toString("${formatPattern}", "${tz}");\ninfo "Formatted Date: " + formattedDate;`;
            preview = `Current Time (${tz}): ${now.toLocaleString()}`;
        } else if (mode === 'relative_add') {
            script = `// Add ${daysVal} Days (e.g. Due Date / Follow-up)\ncurrentDate = zoho.currentdate;\ntargetDate = currentDate.addDay(${daysVal});\nformattedTarget = targetDate.toString("${formatPattern}");\ninfo "${daysVal} Days Later: " + formattedTarget;`;
            const future = new Date();
            future.setDate(future.getDate() + daysVal);
            preview = `Calculated Date (+${daysVal} days): ${future.toDateString()}`;
        } else if (mode === 'relative_sub') {
            script = `// Subtract ${daysVal} Days (e.g. Audit window / Past records)\ncurrentDate = zoho.currentdate;\npastDate = currentDate.subDay(${daysVal});\nformattedPast = pastDate.toString("${formatPattern}");\ninfo "${daysVal} Days Ago: " + formattedPast;`;
            const past = new Date();
            past.setDate(past.getDate() - daysVal);
            preview = `Calculated Date (-${daysVal} days): ${past.toDateString()}`;
        } else if (mode === 'workday') {
            script = `// Calculate ${daysVal} Business Days (Skips Saturdays & Sundays)\nstartDate = zoho.currentdate;\nworkDayDate = startDate.workday(${daysVal});\ninfo "Workday Result: " + workDayDate;`;
            preview = `Working days computation excluding weekends`;
        } else if (mode === 'month_bounds') {
            script = `// Calculate First & Last Day of Current Month in Deluge\ntoday = zoho.currentdate;\nfirstDay = today.subDay(today.getDay() - 1); // 1st of month\nnextMonth = today.addMonth(1);\nlastDay = nextMonth.subDay(nextMonth.getDay()); // Last day of month\n\ninfo "First Day of Month: " + firstDay.toString("yyyy-MM-dd");\ninfo "Last Day of Month: " + lastDay.toString("yyyy-MM-dd");`;
            preview = `Start and End of current month`;
        } else if (mode === 'diff') {
            script = `// Calculate Days Between Two Dates in Deluge\nstartDate = "2026-10-01".toDate("yyyy-MM-dd");\nendDate = zoho.currentdate;\ndifferenceInDays = daysBetween(startDate, endDate);\ninfo "Days Elapsed: " + differenceInDays;`;
            preview = `Days difference between start date and now`;
        }

        if (outputElem) {
            outputElem.textContent = script;
            if (window.Prism) Prism.highlightElement(outputElem);
        }

        if (previewElem) {
            previewElem.textContent = preview;
        }
    }
};
