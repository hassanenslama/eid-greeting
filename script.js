(function() {
    'use strict';

    // 🔗 تصحيح إعدادات Supabase وتطابق معرف المشروع
    const SUPABASE_URL = 'https://aegzgcspwonwdltwfwqf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZ3pnY3Nwd29ud2RsdHdmd3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODI5NDcsImV4cCI6MjA5NTA1ODk0N30.y59qyfIB4bawGCevemVdoCi_CGUK7Zm-akK5TFuNB_c';

    let customGeneratedLink = '';

    // عناصر الصفحة (DOM Elements)
    const mainGreetingTitle = document.getElementById('mainGreetingTitle');
    const senderNameDisplay = document.getElementById('senderName');
    const inputForm = document.getElementById('inputForm');
    const shareControls = document.getElementById('shareControls');
    const visitorNameInput = document.getElementById('visitorNameInput');
    const toast = document.getElementById('toast');

    // 📋 قراءة البارامتر وتحديث الواجهة تلقائياً عند تحميل الصفحة
    function checkUrlParams() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const nameParam = urlParams.get('name');
            const forCrush = urlParams.get('for') === 'you';
            
            if (forCrush) {
                // 💖 الميزة الرومانسية السرية (Easter Egg)
                mainGreetingTitle.innerHTML = `تهنئة من القلب ✨`;
                senderNameDisplay.innerHTML = `إلى التي تسكن الروح دائماً.. 💛`;
                document.title = `كل عام وأنتِ عيدي 💖`;
                
                // تغيير رمز القمر إلى قلب وردي متوهج ونابض
                const moonElement = document.querySelector('.moon');
                if (moonElement) {
                    moonElement.innerHTML = '💖';
                    moonElement.style.filter = 'drop-shadow(0 0 25px rgba(255, 105, 180, 0.85))';
                }
                
                // تخصيص الرسالة بنص رومانسي غامض
                const messageBox = document.querySelector('.message');
                if (messageBox) {
                    messageBox.innerHTML = `
                        <p class="fade-in-text" style="color: #ff69b4; font-weight: 700; font-size: 1.35rem; text-shadow: 0 0 10px rgba(255, 105, 180, 0.15);">كل عام وأنتِ عيدي لقلبي 💖</p>
                        <p class="fade-in-text">تقبل الله منا ومنكِ صالح الأعمال وغفر لنا</p>
                        <p class="fade-in-text">وأعاد الله عليكِ العيد بالسلام والبهجة العميقة</p>
                    `;
                }
            } else if (nameParam && nameParam.trim() !== '') {
                const cleanName = decodeURIComponent(nameParam).trim();
                // تحديث كارت التهنئة باسم المرسل
                mainGreetingTitle.innerHTML = `تهنئة خاصة ✨`;
                senderNameDisplay.innerHTML = `يتقدم <strong>${escapeHTML(cleanName)}</strong> بأجمل التهاني بمناسبة العيد!`;
                document.title = `تهنئة خاصة من ${escapeHTML(cleanName)} 🌙 | عيد أضحى مبارك`;
            } else {
                // الكارت الافتراضي
                mainGreetingTitle.innerHTML = `عيد أضحى مبارك`;
                senderNameDisplay.innerHTML = `كل عام وأنتم بخير`;
            }
        } catch (e) {
            console.error('Error reading URL parameters:', e);
        }
    }

    // ✨ توليد كارت تهنئة مخصص
    function generateCustomGreeting() {
        const nameVal = visitorNameInput.value.trim();
        
        if (nameVal === '') {
            showToast('⚠️ يرجى كتابة اسمك أولاً لصنع الكارت!');
            visitorNameInput.focus();
            return;
        }

        if (nameVal.length > 35) {
            showToast('⚠️ الاسم طويل جداً، يرجى كتابة اسم أقصر.');
            return;
        }

        // توليد الرابط المخصص
        const origin = window.location.origin + window.location.pathname;
        customGeneratedLink = `${origin}?name=${encodeURIComponent(nameVal)}`;

        // تحديث محتوى الكارت محلياً ليرى المستخدم النتيجة فوراً
        mainGreetingTitle.innerHTML = `تهنئة خاصة ✨`;
        senderNameDisplay.innerHTML = `يتقدم <strong>${escapeHTML(nameVal)}</strong> بأجمل التهاني بمناسبة العيد!`;

        // إخفاء نموذج الإدخال وإظهار لوحة المشاركة
        inputForm.style.display = 'none';
        shareControls.style.display = 'block';
        
        showToast('🎉 تم توليد كارت التهنئة الخاص بك بنجاح!');
    }

    // 💬 مشاركة الكارت عبر الواتساب
    function shareOnWhatsApp() {
        if (!customGeneratedLink) return;
        
        const nameVal = visitorNameInput.value.trim() || 'صديقك';
        const messageText = `كل عام وأنتم بخير! 🎉 بمناسبة العيد المبارك، تفضل بزيارة بطاقة التهنئة الخاصة بي الموجهة لكم بصحبة أرق الأمنيات 🌙✨:\n\n${customGeneratedLink}`;
        
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
        window.open(whatsappUrl, '_blank');
    }

    // 🔗 نسخ رابط التهنئة المخصص
    async function copyGreetingLink() {
        if (!customGeneratedLink) return;

        const copyBtnText = document.getElementById('copyBtnText');
        const copyIcon = document.getElementById('copyIcon');

        try {
            await navigator.clipboard.writeText(customGeneratedLink);
            
            // تغيير واجهة الزر مؤقتاً لتأكيد النسخ
            showToast('📋 تم نسخ رابط التهنئة بنجاح! شاركه الآن.');
            copyBtnText.innerText = 'تم النسخ! ✅';
            copyIcon.innerText = '';
            
            setTimeout(() => {
                copyBtnText.innerText = 'نسخ الرابط';
                copyIcon.innerText = '🔗';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
            // حل بديل في حال لم يعمل Clipboard API في بعض المتصفحات القديمة
            const tempInput = document.createElement('input');
            tempInput.value = customGeneratedLink;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            showToast('📋 تم نسخ رابط التهنئة بنجاح!');
        }
    }

    // 🔄 إعادة تهيئة الكارت لصنع كارت جديد باسم آخر
    function resetGreeting() {
        visitorNameInput.value = '';
        customGeneratedLink = '';
        
        // مسح البارامتر من الرابط بدون إعادة تحميل الصفحة (لمسة احترافية)
        try {
            window.history.pushState({}, document.title, window.location.pathname);
        } catch (e) {
            console.warn('History pushState failed:', e);
        }
        
        // إرجاع كارت التهنئة لحالته الافتراضية
        checkUrlParams();
        
        // إرجاع الواجهة
        shareControls.style.display = 'none';
        inputForm.style.display = 'block';
    }

    // 🔔 إظهار إشعار Toast ذكي وسريع
    function showToast(message) {
        toast.innerHTML = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    // دالة مساعدة لتأمين النصوص المدخلة ضد الهجمات البرمجية XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // -------------------------------------------------------------
    // 🕵️‍♂️ جزء تتبع وجمع بيانات الزوار (Visitor Tracking Logic)
    // -------------------------------------------------------------
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
        if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
        return 'desktop';
    }

    function getOS() {
        const ua = navigator.userAgent;
        if (/windows phone/i.test(ua)) return 'Windows Phone';
        if (/windows/i.test(ua)) return 'Windows';
        if (/android/i.test(ua)) return 'Android';
        if (/ios|iphone|ipad|ipod/i.test(ua)) return 'iOS';
        if (/macintosh|mac os x/i.test(ua)) return 'MacOS';
        if (/linux/i.test(ua)) return 'Linux';
        return 'Unknown';
    }

    function getBrowser() {
        const ua = navigator.userAgent;
        if (/edg/i.test(ua)) return 'Edge';
        if (/chrome/i.test(ua) && /safari/i.test(ua)) return 'Chrome';
        if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
        if (/firefox/i.test(ua)) return 'Firefox';
        if (/opera|opr/i.test(ua)) return 'Opera';
        if (/msie|trident/i.test(ua)) return 'Internet Explorer';
        return 'Unknown';
    }

    // دالة لحقن تهنئة المدينة بلطف وتفاعلية رومانسية
    function injectCityGreeting(city) {
        try {
            const messageBox = document.querySelector('.message');
            if (messageBox) {
                if (document.querySelector('.city-greeting')) return;

                const cityElement = document.createElement('p');
                cityElement.className = 'fade-in-text city-greeting';
                cityElement.innerHTML = `✨ سلامٌ خاص وتهنئة نرسلها لأحبابنا في <strong>${escapeHTML(city)}</strong> 🌙`;
                messageBox.appendChild(cityElement);
            }
        } catch (e) {
            console.warn('Error injecting city greeting:', e);
        }
    }

    async function trackVisitor() {
        // منع تسجيل الزيارات المتكررة لنفس الشخص خلال نفس جلسة المتصفح
        if (sessionStorage.getItem('visitor_tracked')) {
            console.log('Visitor already tracked in this session.');
            return;
        }

        try {
            // حفظ علامة التتبع فوراً لمنع أي طلبات متوازية مكررة
            sessionStorage.setItem('visitor_tracked', 'true');

            // التحقق من معرّف الحب السري في الرابط
            const urlParams = new URLSearchParams(window.location.search);
            const isCrush = urlParams.get('for') === 'you';

            const visitorData = {
                ip: null,
                country: null,
                city: null,
                latitude: null,
                longitude: null,
                device_type: getDeviceType(),
                os: getOS(),
                browser: getBrowser(),
                language: navigator.language || 'Unknown',
                referrer: isCrush ? 'Special Crush Link' : (document.referrer || 'Direct'),
                user_agent: navigator.userAgent,
                visited_at: new Date().toISOString()
            };

            try {
                // جلب عنوان الـ IP مجاناً وبسرعة عالية
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                if (ipResponse.ok) {
                    const ipData = await ipResponse.json();
                    visitorData.ip = ipData.ip;

                    try {
                        // جلب البيانات الجغرافية بالـ IP
                        const geoResponse = await fetch(`https://get.geojs.io/v1/ip/geo/${ipData.ip}.json`);
                        if (geoResponse.ok) {
                            const geoData = await geoResponse.json();
                            visitorData.country = geoData.country || 'Unknown';
                            visitorData.city = geoData.city || 'Unknown';
                            visitorData.latitude = geoData.latitude ? parseFloat(geoData.latitude) : null;
                            visitorData.longitude = geoData.longitude ? parseFloat(geoData.longitude) : null;

                            // حقن تهنئة المدينة ديناميكياً لإحداث التفاعل والشك اللطيف
                            if (geoData.city && geoData.city !== 'Unknown') {
                                injectCityGreeting(geoData.city);
                            }
                        }
                    } catch (geoErr) {
                        console.warn('Geo lookup failed:', geoErr);
                    }
                }
            } catch (ipErr) {
                console.warn('IP lookup failed:', ipErr);
            }

            // إرسال البيانات بشكل صامت لقاعدة البيانات عبر واجهة REST
            const response = await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify(visitorData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn('Failed to track visitor:', response.status, errorText);
            }
        } catch (error) {
            console.warn('Tracking error:', error);
        }
    }

    // ربط الدوال بنافذة المتصفح لتكون متاحة للـ HTML (إصلاح مشكلة الـ Scope في IIFE)
    window.generateCustomGreeting = generateCustomGreeting;
    window.shareOnWhatsApp = shareOnWhatsApp;
    window.copyGreetingLink = copyGreetingLink;
    window.resetGreeting = resetGreeting;

    // تشغيل الأحداث عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            checkUrlParams();
            trackVisitor();
        });
    } else {
        checkUrlParams();
        trackVisitor();
    }
})();