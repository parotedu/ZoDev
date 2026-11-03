/**
 * PAROT ZOHO DEVTOOLS - Bilingual Translations (EN / AR)
 * Matches parotcorp.com brand tone & terminology
 */

window.translations = {
    en: {
        brand: "PAROT",
        sub_brand: "Zoho DevSuite",
        tagline: "Ultimate Developer Swiss Knife for Zoho Creators & Deluge Engineers",
        lang_btn: "AR",
        search_placeholder: "Search tools or snippets... (Press /)",

        // Navigation Tabs
        nav_json_deluge: "JSON to Deluge Mapper",
        nav_curl_invokeurl: "cURL to invokeurl",
        nav_date_tools: "Deluge Date & Time",
        nav_coql_builder: "CRM COQL Studio",
        nav_pagination: "Pagination Generator",
        nav_webhook: "Webhook Unpacker",
        nav_string_regex: "String & Regex Helper",
        nav_snippets: "Deluge Snippet Vault",

        // Hero Banner
        hero_badge: "100% Client-Side • Serverless • Privacy-First",
        hero_title_1: "Accelerate Your",
        hero_title_2: "Zoho & Deluge Development",
        hero_subtitle: "Zero server lag. Paste any JSON, cURL, or query and generate production-ready Deluge scripts in seconds.",
        
        // Common Buttons & Labels
        btn_copy: "Copy Code",
        btn_copied: "Copied!",
        btn_clear: "Clear",
        btn_format: "Format JSON",
        btn_minify: "Minify",
        btn_generate: "Generate Deluge",
        btn_preset: "Load Sample",
        btn_select_all: "Select All Fields",
        btn_deselect_all: "Deselect All",
        btn_export: "Export Script",
        label_root_var: "Root Variable Name",
        label_output_var: "Target Variable Name",
        label_mode: "Extraction Mode",
        label_options: "Options",
        label_results: "Generated Deluge Script",

        // Tool 1: JSON to Deluge
        t1_title: "JSON to Deluge Interactive Explorer & Mapper",
        t1_desc: "Inspect any JSON payload, click any key or value to instantly generate accurate Deluge extraction code, or select multiple keys to build full Zoho CRM mapping records.",
        t1_input_label: "Paste JSON Payload",
        t1_tree_label: "Interactive JSON Explorer (Click any node to map)",
        t1_batch_title: "Batch Field Mapping (Zoho CRM Record Builder)",
        t1_batch_desc: "Selected fields will be mapped into a Deluge Map ready for zoho.crm.createRecord or updateRecord.",
        t1_module_label: "Target CRM Module",
        t1_mode_chain: "Standard Chaining (.get())",
        t1_mode_safe: "Null-Safe with Checks",
        t1_mode_typed: "Explicit Type Casting",
        t1_constructor_tab: "Reverse: JSON to Deluge Map/List Constructor",
        t1_empty_tree: "Paste valid JSON above to explore nodes",

        // Tool 2: cURL to invokeurl
        t2_title: "cURL to Deluge `invokeurl` Converter",
        t2_desc: "Convert standard cURL requests from Postman or documentation into robust Deluge `invokeurl` blocks with headers, params, connection, and error handling.",
        t2_input_placeholder: "curl -X POST 'https://api.example.com/v1/resource' \\\n -H 'Authorization: Bearer YOUR_TOKEN' \\\n -H 'Content-Type: application/json' \\\n -d '{\"name\":\"Acme Corp\"}'",
        t2_conn_label: "Zoho Connection Name (Optional)",
        t2_conn_placeholder: "e.g., zohocrm_conn or stripe_connection",
        t2_detailed_label: "Include `detailed: true` (recommended for status codes)",

        // Tool 3: Date & Time Tools
        t3_title: "Deluge Date & Time Swiss Knife",
        t3_desc: "Effortlessly generate Deluge date formatters, relative date calculations, timezone shifts, and duration math without memorizing syntax.",
        t3_mode_format: "Date Formatting",
        t3_mode_relative: "Relative Dates & Add/Sub",
        t3_mode_diff: "Date Difference & Workdays",
        t3_timezone_label: "Target Timezone",
        t3_format_preset_label: "Format Preset",
        t3_custom_format_label: "Custom Pattern",

        // Tool 4: COQL Studio
        t4_title: "Zoho CRM COQL Query Builder & Runner",
        t4_desc: "Build CRM Object Query Language (COQL) queries with visual criteria, order by, and generate both direct Deluge scripts and auto-pagination loops.",
        t4_module_select: "CRM Module",
        t4_columns_label: "Fields (comma-separated)",
        t4_criteria_builder: "Where Criteria",
        t4_add_condition: "+ Add Condition",
        t4_pagination_loop: "Generate Full Pagination Loop (Offset Loop)",

        // Tool 5: Pagination Generator
        t5_title: "Deluge Pagination Loop Generator",
        t5_desc: "Avoid the dreaded 5000 Deluge statement limit. Generate safe, tested pagination loops for Zoho CRM, Books, Desk, or generic REST APIs.",
        t5_type_crm: "Zoho CRM (getRecords with Page Index)",
        t5_type_coql: "Zoho CRM COQL (Offset by 200)",
        t5_type_books: "Zoho Books (page & per_page)",
        t5_type_rest: "Generic REST API (Page Token or Offset)",

        // Tool 6: Webhook Unpacker
        t6_title: "Zoho Webhook & Function Argument Unpacker",
        t6_desc: "Generate the unpacking boilerplate for Zoho CRM Workflow webhooks, Standalone Functions (`crmAPIRequest`), or Creator callbacks.",

        // Tool 7: String & Regex
        t7_title: "Deluge String & Regex Assistant",
        t7_desc: "Test strings, phone numbers, emails, and extract substrings using Deluge's unique methods (`getPrefix`, `getSuffix`, `replaceAll`, `toList`).",

        // Tool 8: Snippet Vault
        t8_title: "Deluge Production Snippets Vault",
        t8_desc: "Handcrafted, battle-tested Deluge snippets for common Zoho integration challenges. One-click copy.",
        t8_category_crm: "Zoho CRM",
        t8_category_books: "Zoho Books",
        t8_category_desk: "Zoho Desk",
        t8_category_utility: "Utilities & Security",

        // Footer
        footer_built_by: "Engineered with passion by",
        footer_company: "PAROT Corp",
        footer_rights: "All rights reserved. Free & Open Source for Zoho Developers worldwide.",
        footer_visit: "Visit parotcorp.com"
    },
    ar: {
        brand: "PAROT",
        sub_brand: "مجموعة أدوات زوهو",
        tagline: "الترسانة الذكية لمطوري زوهو ومهندسي لغة ديلوج (Deluge)",
        lang_btn: "EN",
        search_placeholder: "ابحث في الأدوات أو الأكواد... (اضغط /)",

        // Navigation Tabs
        nav_json_deluge: "محول JSON إلى Deluge",
        nav_curl_invokeurl: "تحويل cURL إلى invokeurl",
        nav_date_tools: "أدوات التواريخ والوقت",
        nav_coql_builder: "استوديو استعلامات COQL",
        nav_pagination: "مولد الـ Pagination الآمن",
        nav_webhook: "مفكك بيانات الـ Webhook",
        nav_string_regex: "معالجة النصوص و Regex",
        nav_snippets: "مكتبة أكواد Deluge الجاهزة",

        // Hero Banner
        hero_badge: "يعمل 100% داخل المتصفح • بدون سيرفر • خصوصية تامة للأكواد",
        hero_title_1: "طوّر واكتب أكواد",
        hero_title_2: "Zoho & Deluge بسرعة الصاروخ",
        hero_subtitle: "ودّاعاً لتضييع الوقت في كتابة دوال get() وتفكيك الـ JSON يدوياً. حوّل البيانات والطلبات إلى كود ديلوج جاهز للإنتاج فوراً وبضغطة زر.",

        // Common Buttons & Labels
        btn_copy: "نسخ الكود",
        btn_copied: "تم النسخ بنجاح! ✓",
        btn_clear: "مسح",
        btn_format: "تنسيق JSON",
        btn_minify: "ضغط",
        btn_generate: "توليد كود Deluge",
        btn_preset: "تحميل نموذج تجريبي",
        btn_select_all: "تحديد كل الحقول",
        btn_deselect_all: "إلغاء تحديد الكل",
        btn_export: "تصدير السكريبت",
        label_root_var: "اسم المتغير الرئيسي (Root)",
        label_output_var: "اسم المتغير الهدف",
        label_mode: "نمط الاستخراج",
        label_options: "خيارات إضافية",
        label_results: "كود Deluge المتولد",

        // Tool 1: JSON to Deluge
        t1_title: "مستكشف ومحول JSON التفاعلي إلى ديلوج",
        t1_desc: "ضع أي JSON من الـ API، اضغط على أي قيمة في الشجرة التفاعلية ليظهر لك كود الاستخراج فوراً، أو حدد حقول متعددة لبناء سكريبت Mapping متكامل لـ Zoho CRM.",
        t1_input_label: "الصق الـ JSON هنا",
        t1_tree_label: "شجرة الـ JSON التفاعلية (اضغط على أي عنصر لربطه)",
        t1_batch_title: "توليد سكريبت إنشاء سجل (Record Mapping)",
        t1_batch_desc: "الحقول المحددة سيتم تحويلها إلى خريطة Map() جاهزة للدوال zoho.crm.createRecord أو updateRecord.",
        t1_module_label: "الموديول المستهدف في CRM",
        t1_mode_chain: "تسلسل كلاسيكي (.get())",
        t1_mode_safe: "آمن مع فحص القيم الفارغة (Null-Safe)",
        t1_mode_typed: "تحويل نوع البيانات صراحة (Type Casting)",
        t1_constructor_tab: "العكس: تحويل الـ JSON إلى بناء Map/List في ديلوج",
        t1_empty_tree: "الصق كود JSON صحيح في الأعلى لتظهر لك الشجرة التفاعلية",

        // Tool 2: cURL to invokeurl
        t2_title: "محول أوامر cURL إلى دالة `invokeurl` في Deluge",
        t2_desc: "حوّل أوامر cURL من Postman أو وثائق الـ APIs الخارجية إلى كود invokeurl منظم مع الـ Headers والـ Parameters وحماية الأخطاء.",
        t2_input_placeholder: "curl -X POST 'https://api.example.com/v1/resource' \\\n -H 'Authorization: Bearer YOUR_TOKEN' \\\n -H 'Content-Type: application/json' \\\n -d '{\"name\":\"Acme Corp\"}'",
        t2_conn_label: "اسم الـ Connection في زوهو (اختياري)",
        t2_conn_placeholder: "مثال: zohocrm_conn أو my_stripe_conn",
        t2_detailed_label: "تضمين `detailed: true` (موصى به لقراءة Status Code)",

        // Tool 3: Date & Time Tools
        t3_title: "أداة التواريخ والوقت الشاملة في Deluge",
        t3_desc: "تنسيق التواريخ، إضافة وطرح الأيام والشهور، حساب أيام العمل، وتحويل المناطق الزمنية بدون الحاجة لحفظ دوال ديلوج المعقدة.",
        t3_mode_format: "تنسيق التاريخ والوقت",
        t3_mode_relative: "عمليات التواريخ النسبية (+/- أيام)",
        t3_mode_diff: "الفرق بين تاريخين وأيام العمل",
        t3_timezone_label: "المنطقة الزمنية",
        t3_format_preset_label: "نموذج التنسيق",
        t3_custom_format_label: "صيغة مخصصة",

        // Tool 4: COQL Studio
        t4_title: "استوديو استعلامات COQL لـ Zoho CRM",
        t4_desc: "صمم استعلامات CRM Object Query Language بسهولة بصرية، مع شروط البحث والترتيب، وتوليد سكريبت الـ Deluge مع حلقة التكرار التلقائية.",
        t4_module_select: "الموديول في CRM",
        t4_columns_label: "الحقول المطلوبة (مفصولة بفاصلة)",
        t4_criteria_builder: "شروط البحث (Where)",
        t4_add_condition: "+ إضافة شرط جديد",
        t4_pagination_loop: "توليد حلقة الـ Pagination التلقائية (Offset Loop)",

        // Tool 5: Pagination Generator
        t5_title: "مولد حلقات التكرار (Pagination) الآمنة",
        t5_desc: "احمِ سكريبتاتك من تجاوز حد الـ 5000 عبارة برمجية في زوهو ديلوج. سكريبتات جاهزة للتعامل مع آلاف السجلات بأمان.",
        t5_type_crm: "سجلات CRM (عبر رقم الصفحة Page)",
        t5_type_coql: "استعلامات COQL (عبر Offset كل 200 سجل)",
        t5_type_books: "نظام Zoho Books (page & per_page)",
        t5_type_rest: "REST API خارجي (Token أو Offset)",

        // Tool 6: Webhook Unpacker
        t6_title: "مفكك بيانات الـ Webhook ودوال الـ Standalone",
        t6_desc: "توليد كود فك وقراءة البيانات القادمة من الـ Webhook أو كائن `crmAPIRequest` مع الـ Headers و Query Params و Body.",

        // Tool 7: String & Regex
        t7_title: "مساعد معالجة النصوص و Regex في Deluge",
        t7_desc: "اختبر واستخرج النصوص، نظّف أرقام الهواتف، واستخرج النطاق من البريد الإلكتروني باستخدام دوال ديلوج الخاصة.",

        // Tool 8: Snippet Vault
        t8_title: "خزينة أكواد Deluge الجاهزة للإنتاج",
        t8_desc: "مجموعة منتقاة من أقوى أكواد ديلوج لحل التحديات اليومية (رفع المرفقات، إرسال الإيميلات، إنشاء الفواتير، التشفير).",
        t8_category_crm: "Zoho CRM",
        t8_category_books: "Zoho Books",
        t8_category_desk: "Zoho Desk",
        t8_category_utility: "أدوات وحماية",

        // Footer
        footer_built_by: "تم التطوير بكل فخر بواسطة",
        footer_company: "PAROT Corp",
        footer_rights: "جميع الحقوق محفوظة. أداة مجانية ومفتوحة المصدر لجميع مطوري زوهو.",
        footer_visit: "زيارة موقع parotcorp.com"
    }
};
