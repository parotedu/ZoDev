# 🦜 PAROT Zoho DevTools

<div align="center">
  <img src="./assets/logo.png" alt="PAROT Logo" width="96" height="96" />
  <h3>الترسانة الذكية السحابية لمطوري زوهو ومهندسي ديلوج</h3>
  <p><strong>The Ultimate Serverless Swiss-Army Knife for Zoho Creators & Deluge Developers</strong></p>
  <p>Built with ❤️ by <a href="https://parotcorp.com"><strong>PAROT Corp</strong></a></p>

  <p>
    <a href="#-tools-overview">الأدوات المتوفرة</a> •
    <a href="#-features">المميزات</a> •
    <a href="#-github-pages-deployment">طريقة الرفع على GitHub Pages</a> •
    <a href="#-local-usage">التشغيل المحلي</a>
  </p>
</div>

---

## 🌟 نبذة عن المشروع (About)

تم تصميم **PAROT Zoho DevTools** بروح وهوية **[parotcorp.com](https://parotcorp.com)** ليكون موقعاً خفيفاً وسريعاً جداً يعمل **100% Client-Side بدون أي سيرفر خارجي** (Privacy-First)، مخصص للنشر المباشر والمجاني على **GitHub Pages**.

هدف الموقع هو حل أكثر المشاكل اليومية إرهاقاً لمطوري Zoho CRM, Zoho Books, Zoho Desk, Zoho Creator، وعلى رأسها استخراج البيانات وربط الـ JSON وكتابة دوال Deluge المعقدة.

---

## 🛠️ الأدوات المتوفرة في المنصة (8 أدوات متكاملة)

### 1. ⚡ **JSON to Deluge Interactive Explorer & Mapper (الأداة الرئيسية)**
* **الشجرة التفاعلية**: الصق أي JSON (رد API، استجابة CRM، أو Webhook) لتظهر لك شجرة تفاعلية ملونة تبين أنواع البيانات (`Map`, `List`, `String`, `Number`, `Boolean`).
* **الضغط للربط (Click-to-Map)**: اضغط على أي مفتاح أو قيمة ليظهر لك كود الاستخراج بلغة Deluge فوراً (مثال: `response.get("data").get(0).get("contact").get("email")`).
* **أنماط استخراج متعددة**:
  * تسلسل كلاسيكي (`.get()`).
  * آمن ومحمي ضد القيم الفارغة (`Null-Safe with Checks`).
  * تحويل نوع البيانات صراحة (`.toLong()`, `.toString()`, `.toDate()`, `.toDecimal()`).
* **توليد سكريبت الـ CRM المتعدد (Batch Field Mapping)**: حدد مربعات الاختيار بجانب أي حقول تريدها، وسيقوم الموقع بتوليد كود إنشاء السجل بالكامل (`zoho.crm.createRecord`) بضغطة زر واحدة.
* **البناء العكسي (JSON to Deluge Constructor)**: حوّل الـ JSON كاملاً إلى كود بناء `Map()` و `List()` في ديلوج لتجربة الأكواد محلياً.

### 2. 🌐 **cURL to Deluge `invokeurl` Converter**
* حوّل أي أمر `curl` من Postman أو وثائق الـ APIs إلى كود دالة `invokeurl` في Deluge.
* يدعم الـ Headers، الـ Query Parameters، الـ Bearer Tokens، الـ Basic Auth، وتضمين اسم الـ Zoho Connection مع فحص الـ HTTP Status Code وحماية الأخطاء.

### 3. 📅 **Deluge Date & Time Swiss Knife**
* مولد تفاعلي لمعالجة وتنسيق التواريخ في Deluge بدون الحاجة لحفظ الدوال.
* يدعم تحويل المناطق الزمنية (`Africa/Cairo`, `Asia/Riyadh`, `UTC`, `America/New_York`...).
* حسابات التواريخ النسبية (+/- أيام)، أيام العمل الرسمية (`.workday()`) التي تتخطى العطلات، وحساب أول وآخر يوم في الشهر الحالي.

### 4. 🔍 **Zoho CRM COQL Studio**
* صمم استعلامات CRM Object Query Language بصرياً للموديولات (`Leads`, `Contacts`, `Accounts`, `Deals`, `Invoices`).
* منشئ شروط البحث (`where`) مع المعاملات المختلفة (`=`, `!=`, `like`, `is null`, `is not null`).
* **توليد حلقة الـ Pagination التلقائية**: توليد سكريبت Deluge جاهز يجلب آلاف السجلات عبر الـ Offset (0, 200, 400...) بأمان تام.

### 5. 🔄 **Deluge Safe Pagination Generator**
* حل مشكلة الـ **5,000 Statements Limit** الشهيرة في Deluge.
* توليد حلقات تكرار ذكية ومحمية لجلب السجلات من Zoho CRM, Zoho Books, أو أي REST API خارجي.

### 6. 📦 **Zoho Webhook & Function Unpacker**
* تجهيز وتفكيك كائن `crmAPIRequest` لدوال الـ Standalone Functions والـ Webhooks.
* قراءة الـ Headers، والـ Query Params، وفك تشفير الـ Body (`.toMap()`)، مع كود التحقق من المفتاح السري (`x-api-key`).

### 7. ✂️ **Deluge String & Regex Helper**
* تنظيف أرقام الهواتف (استخراج الأرقام فقط عبر regex).
* استخراج اسم المستخدم والنطاق من البريد الإلكتروني (`getPrefix`, `getSuffix`).
* تقسيم النصوص (`.toList(",")`) وتشفير الروابط (`urlEncode`) وتشفير Base64.

### 8. 💎 **Deluge Snippet Vault (خزينة الأكواد الجاهزة)**
* كنز من الأكواد الجاهزة للاستخدام والنسخ الفوري:
  * رفع وتحميل المرفقات وربطها بسجلات CRM (`zoho.crm.attachFile`).
  * إرسال إيميلات HTML احترافية مع أزرار وتصميم متجاوب عبر `sendmail`.
  * إنشاء فواتير Zoho Books مع بنود متعددة (Line Items).
  * حماية الدوال عبر Try-Catch وإرسال تنبيه فوري للإيميل في حال حدوث خطأ.
  * توليد توقيع HMAC-SHA256 لمصادقة الـ Webhooks.

---

## 🎨 التصميم والهوية البصرية (Design Language)

الموقع مصمم بنفس روح وهوية شركة **[PAROT Corp](https://parotcorp.com)**:
* **Cyberpunk Glassmorphism**: بطاقات زجاجية عائمة بتأثير `backdrop-blur` وخلفيات نيون شبكية (`bg-cyber-grid`).
* **لوحة الألوان الرسمية**:
  * Purple: `#8B5CF6`
  * Pink: `#EC4899`
  * Blue: `#3B82F6`
  * Cyan: `#06B6D4`
  * Darker Background: `#020617`
* **دعم ثنائي اللغة (Bilingual AR / EN)**: زر تحويل فوري بين العربية والإنجليزية مع تعديل الخطوط واتجاه الصفحة (`rtl` / `ltr`) تلقائياً.
* **Preloader مستقبلي**: نفس لودر الحلقات الدائرية النيون المميز لموقع Parot Corp.

---

## 🚀 طريقة الرفع على GitHub Pages (Deployment)

المشروع مصمم ليعمل مباشرة بدون أي أدوات بناء (Zero-Build Step):

### الطريقة الأولى: الرفع عبر GitHub Actions (تلقائياً)
1. قم بإنشاء مستودع جديد على حسابك في GitHub (مثلاً: `parot-zoho-devtools`).
2. ارفع ملفات هذا المجلد إلى المستودع:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Parot Zoho DevTools"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
3. ادخل على **Settings** في مستودعك على GitHub -> ثم **Pages**.
4. تحت خانة **Build and deployment -> Source** اختر **GitHub Actions**.
5. سيتم تشغيل ملف `.github/workflows/deploy.yml` تلقائياً ويصبح موقعك متاحاً على الإنترنت خلال ثوانٍ!

### الطريقة الثانية: الرفع المباشر من Branch
1. بعد رفع الملفات إلى المستودع، ادخل على **Settings** -> **Pages**.
2. تحت **Source** اختر **Deploy from a branch**.
3. اختر فرع `main` والمجلد `/ (root)`.
4. اضغط **Save** وسيكون موقعك جاهزاً!

---

## 💻 التشغيل المحلي (Local Usage)

بما أن الموقع لا يحتاج لسيرفر، يمكنك تشغيله بأي من الطرق التالية:
* **مباشرة**: اضغط مرتين على ملف `index.html` في جهازك ليفتح في المتصفح فوراً!
* **عبر أي Local Server**:
  ```bash
  npx serve .
  # أو باستخدام بايثون:
  python3 -m http.server 8000
  ```

---

## 🔒 الخصوصية والأمان (Privacy First)

* جميع العمليات وتفكيك الـ JSON ومعالجة الأكواد تتم **محلياً بنسبة 100% داخل متصفح المستخدم**.
* لا يتم إرسال أي كود، بيانات عملاء، أو روابط API إلى أي سيرفر خارجي إطلاقاً.

---

<div align="center">
  <p>© 2026 <strong>PAROT Corp</strong>. All rights reserved.</p>
</div>
