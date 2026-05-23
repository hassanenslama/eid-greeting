# 🎉 Eid Greeting - موقع تهنئة العيد مع جمع البيانات

## الفكرة
موقع تهنئة بالعيد يجمع أقصى بيانات ممكنة عن كل زائر ويحفظها في Supabase.

---

## الملفات

```
/eid-greeting
  /index.html              # صفحة التهنئة
  /style.css               # التصميم (Mobile-First)
  /script.js               # جمع البيانات وإرسالها
  /supabase/
    /functions/
      /track-visitor/
        index.ts           # Edge Function لحفظ البيانات
    /schema.sql            # جدول قاعدة البيانات
```

---

## الإعدادات المطلوبة

### 1. Supabase

1. روح لـ [supabase.com](https://supabase.com) وسجل دخول (لو عندك حساب)
2. روح لـ **SQL Editor** وشغل محتوى `supabase/schema.sql`
3. من **Project Settings > API** انسخ:
   - `SUPABASE_URL`
   - `anon public` key (مش Service Role Key)

### 2. ip-api.io (اختياري للموقع الجغرافي)

1. سجل على [ip-api.io](https://ip-api.io) مجاناً
2. انسخ API Key بتاعك
3. استبدله في `script.js` في السطر اللي فيه `YOUR_IP_API_KEY`

### 3. GitHub Pages

1. أنشئ Repo جديد على GitHub اسمه `eid-greeting`
2. ارفع الملفات (index.html, style.css, script.js)
3. روح لـ **Settings > Pages > Source** واختار `main` branch
4. الموقع هيكون على: `https://[username].github.io/eid-greeting`

---

## البيانات اللي بتجمع

| الحقل | الوصف |
|-------|-------|
| IP | عنوان الـ IP |
| Country | الدولة |
| City | المدينة |
| Latitude/Longitude | إحداثيات |
| Device Type | موبايل/كمبيوتر/تابلت |
| OS | نظام التشغيل |
| Browser | المتصفح |
| Language | لغة المتصفح |
| Referrer | منين جاي |
| User Agent | معلومات الجهاز |
| Visited At | وقت الزيارة |

---

## لوحة التحكم

من Supabase Dashboard تقدر:
- تشوف كل الزوار في جدول
- تشوف إحصائيات (عدد، دول، أجهزة)
- تعمل فلتر حسب التاريخ والدولة
- تصدر البيانات CSV