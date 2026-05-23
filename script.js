(function() {
    'use strict';

    // 🔗 تصحيح إعدادات Supabase وتطابق معرف المشروع
    const SUPABASE_URL = 'https://aegzgcspwonwdltwfwqf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZ3pnY3Nwd29ud2RsdHdmd3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODI5NDcsImV4cCI6MjA5NTA1ODk0N30.y59qyfIB4bawGCevemVdoCi_CGUK7Zm-akK5TFuNB_c';

    let currentActivePhrase = '';

    // عناصر الصفحة (DOM Elements)
    const mainGreetingTitle = document.getElementById('mainGreetingTitle');
    const senderNameDisplay = document.getElementById('senderName');
    const toast = document.getElementById('toast');

    // 📋 قراءة البارامتر وتحديث الواجهة تلقائياً عند تحميل الصفحة
    function checkUrlParams() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const nameParam = urlParams.get('name');
            const forCrush = urlParams.get('for') === 'you';
            
            if (forCrush) {
                // 💖 الميزة الرومانسية السرية (Easter Egg - تم تغيير النصوص لتصبح غامضة وحيادية بالكامل بين الولد والبنت)
                mainGreetingTitle.innerHTML = `تهنئة من القلب ✨`;
                senderNameDisplay.innerHTML = `إلى من يسكن الروح دائماً.. 💛`;
                document.title = `كل عام وأنت عيدي 💖`;
                
                // إظهار بالون الحب السري فوق الخروف الكيوت
                const crushBalloon = document.getElementById('crushBalloon');
                if (crushBalloon) crushBalloon.style.display = 'block';
                
                // تغيير نص الفقاعة الافتراضي
                const bubble = document.getElementById('sheepBubble');
                if (bubble) bubble.innerText = "مااااء.. كل عام وأنت عيدي 💖";
                currentActivePhrase = "مااااء.. كل عام وأنت عيدي 💖";
                
                // تخصيص الرسالة بنص رومانسي غامض
                const messageBox = document.querySelector('.message');
                if (messageBox) {
                    messageBox.innerHTML = `
                        <p class="fade-in-text" style="color: #ff69b4; font-weight: 700; font-size: 1.35rem; text-shadow: 0 0 10px rgba(255, 105, 180, 0.15);">كل عام وأنت عيدي لقلبي 💖</p>
                        <p class="fade-in-text">تقبل الله منا ومنك صالح الأعمال وغفر لنا</p>
                        <p class="fade-in-text">وأعاد الله عليك العيد بالسلام والبهجة العميقة</p>
                    `;
                }
            } else if (nameParam && nameParam.trim() !== '') {
                const cleanName = decodeURIComponent(nameParam).trim();
                // تحديث كارت التهنئة باسم المرسل
                mainGreetingTitle.innerHTML = `تهنئة خاصة ✨`;
                senderNameDisplay.innerHTML = `يتقدم <strong>${escapeHTML(cleanName)}</strong> بأجمل التهاني بمناسبة العيد!`;
                document.title = `تهنئة خاصة من ${escapeHTML(cleanName)} 🌙 | عيد أضحى مبارك`;
                currentActivePhrase = "مااااء.. اضغط عليا عندي ليك مفاجأة سحرية! 🐑✨";
            } else {
                // الكارت الافتراضي
                mainGreetingTitle.innerHTML = `عيد أضحى مبارك`;
                senderNameDisplay.innerHTML = `كل عام وأنت بخير 💛`;
                currentActivePhrase = "مااااء.. اضغط عليا عندي ليك مفاجأة سحرية! 🐑✨";
            }
        } catch (e) {
            console.error('Error reading URL parameters:', e);
        }
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
        
        // التحقق الدقيق والفوري من متصفح بريف (Brave) لمنع التخفي كـ Chrome
        if (navigator.brave && typeof navigator.brave.isBrave === 'function') {
            return 'Brave';
        }
        
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
        // منع الزيارات المتكررة السريعة (خلال أقل من 5 دقائق) لتفادي التكرار عند التحديث،
        // ولكن السماح بتسجيل الزيارة مجدداً إذا خرج المستخدم وعاد بعد أكثر من 5 دقائق!
        const lastTracked = sessionStorage.getItem('last_tracked_time');
        const now = Date.now();
        if (lastTracked && (now - parseInt(lastTracked)) < 300000) {
            console.log('Visitor tracked less than 5 minutes ago. Ignoring duplicate.');
            return;
        }

        try {
            // حفظ وقت التتبع الحالي
            sessionStorage.setItem('last_tracked_time', now.toString());

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

    // 🐑 منطق تفاعل خروف العيد التفاعلي (Interactive CSS Sheep)
    let bubbleTimeout;

    function makeSheepBleat() {
        const sheep = document.getElementById('sheepBody');
        const bubble = document.getElementById('sheepBubble');
        if (!sheep || !bubble) return;

        // إضافة حركة الاهتزاز الكيوت عن طريق التكبير والتدوير المؤقت
        sheep.classList.remove('wiggle');
        void sheep.offsetWidth; // Trigger reflow
        sheep.classList.add('wiggle');

        // تحديد عبارات خروف العيد (عادية ورومانسية حيادية وغامضة)
        const urlParams = new URLSearchParams(window.location.search);
        const forCrush = urlParams.get('for') === 'you';
        
        let phrases = [];
        if (forCrush) {
            phrases = [
                "مااااء.. Expecto Patronum! أنت الباتروناس لقلبي 💖",
                "مااااء.. أمورتينتيا! (جرعة الحب السحرية) 🧪💖",
                "مااااء.. لوموس! لتضيء قلبي 🪄✨",
                "مااااء.. Smooth Criminal! سرقت قلبي 💖",
                "مااااء.. HEE-HEE! 🕺💕"
            ];
        } else {
            phrases = [
                "مااااء.. Expecto Patronum! 🪄✨",
                "مااااء.. Wingardium Leviosa! 🎈",
                "مااااء.. HEE-HEE! 🕺⚡",
                "مااااء.. Smooth Criminal! 🕴️",
                "مااااء.. عيد أضحى مبارك! 🐑"
            ];
        }

        // اختيار عبارة عشوائية وحفظها للشرح
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        currentActivePhrase = randomPhrase;
        
        // عرض العبارة مع تلميح النقر للشرح
        bubble.innerHTML = randomPhrase + '<br><span style="font-size: 0.65rem; color: #abb8c3; display: block; margin-top: 4px; font-weight: normal; font-style: italic;">(اضغط للشرح 💡)</span>';

        // إظهار الفقاعة الكلامية
        bubble.classList.add('show');

        // إخفاء الفقاعة بعد 4.5 ثانية تلقائياً لترك وقت أطول للقراءة
        clearTimeout(bubbleTimeout);
        bubbleTimeout = setTimeout(() => {
            bubble.classList.remove('show');
        }, 4500);
    }

    // شرح التعاويذ والعبارات عند الضغط على الفقاعة (حيادية بالكامل ولد/بنت لإثارة الغموض)
    function explainActivePhrase() {
        const bubble = document.getElementById('sheepBubble');
        if (!bubble || !currentActivePhrase) return;

        // إلغاء مؤقت الاختفاء التلقائي ليقرأ المستخدم الشرح براحته
        clearTimeout(bubbleTimeout);

        // خريطة الشروحات والتعاويذ السحرية التفاعلية
        const explanations = {
            "مااااء.. اضغط عليا عندي ليك مفاجأة سحرية! 🐑✨": "اضغط على الخروف اللطيف ليطلق تعاويذه السحرية الخاصة بهاري بوتر أو صرخات مايكل جاكسون الحماسية! 🪄🕺",
            "مااااء.. كل عام وأنت عيدي 💖": "كل عام وأنت عيدي وسعادتي الدائمة وسر البهجة المستمرة في قلبي دائماً وأبداً! 💖✨",
            "مااااء.. Expecto Patronum! 🪄✨": "تعويذة حماية سحرية لطرد أي طاقة سلبية وجلب البهجة والسرور لعامك! 🛡️✨",
            "مااااء.. Wingardium Leviosa! 🎈": "تعويذة الطفو والتحليق السحرية.. لجعل قلبك خفيفاً، سعيداً وطائراً كالبالون! 🎈✨",
            "مااااء.. HEE-HEE! 🕺⚡": "الصرخة الحماسية الشهيرة لملك البوب مايكل جاكسون لتنشر الفرح والبهجة والرقص! 🕺🎵",
            "مااااء.. Smooth Criminal! 🕴️": "أغنية مايكل جاكسون الشهيرة.. هل أنت مستعد لتحدي الصعاب وسرقة فرحة العيد؟ 🕺🔥",
            "مااااء.. عيد أضحى مبارك! 🐑": "التهنئة الكلاسيكية الجميلة بعيد الأضحى المبارك بصوت خروفنا الكيوت! 🐏💛",
            "مااااء.. Expecto Patronum! أنت الباتروناس لقلبي 💖": "في القصة، الباتروناس هو منبع الأمان والحب الخالص المطلق والسعادة.. وأنت كذلك لقلبي دائماً 💖",
            "مااااء.. أمورتينتيا! (جرعة الحب السحرية) 🧪💖": "أقوى جرعة حب سحرية في العالم بأسره.. تأثير حبك ورؤيتك أقوى من أي سحر 🧪💕",
            "مااااء.. لوموس! لتضيء قلبي 🪄✨": "تعويذة الإضاءة السحرية.. فوجودك في حياتي يضيء قلبي وعالمي بالكامل 🌟💛",
            "مااااء.. Smooth Criminal! سرقت قلبي 💖": "لقد تسللت بنعومة فائقة وسرقت قلبي بالكامل دون أن أشعر بأي ذنب! 🕵️‍♀️💘",
            "مااااء.. HEE-HEE! 🕺💕": "رقصة فرح دافئة وسعيدة بمناسبة رؤية ابتسامتك في هذا العيد السعيد! 🕺🌸"
        };

        const explanation = explanations[currentActivePhrase] || "صوت خروف العيد يعبر عن الفرح والسرور والبركة! 🐑💛";
        bubble.innerHTML = `<span style="color: var(--gold-main); font-weight: 700;">💡 الشرح:</span> <span style="font-size: 0.85rem; font-weight: normal;">${explanation}</span>`;
    }

    // 🎁 منطق صندوق الهدايا السحري (Magical Gift Box Logic)
    function openMagicGift() {
        const giftBox = document.getElementById('magicGiftBox');
        const scroll = document.getElementById('magicScroll');
        const interactionBox = document.getElementById('interactionBox');
        if (!giftBox || !scroll) return;

        // حساب إحداثيات مركز الصندوق لتفجير الـ Confetti منه
        const rect = giftBox.getBoundingClientRect();
        const containerRect = interactionBox.getBoundingClientRect();
        const startX = rect.left - containerRect.left + rect.width / 2;
        const startY = rect.top - containerRect.top + rect.height / 2;

        // إطلاق الانفجار السحري المذهل للـ Confetti
        createConfettiExplosion(startX, startY, interactionBox);

        // إخفاء الصندوق وإظهار اللفافة السحرية
        giftBox.style.display = 'none';
        scroll.style.display = 'block';

        const scrollContent = document.getElementById('scrollContent');
        
        const urlParams = new URLSearchParams(window.location.search);
        const forCrush = urlParams.get('for') === 'you';

        if (forCrush) {
            // رسالة الحب السرية العاطفية والمميزة جداً (تمت صياغتها لتكون حيادية بالكامل ولد/بنت لإثارة الغموض والشك اللطيف!)
            scrollContent.innerHTML = `
                <p style="color: #ff69b4; font-size: 1.45rem; font-weight: 700; text-align: center; margin-bottom: 1.25rem; text-shadow: 0 0 10px rgba(255,105,180,0.15);">💖 رسالة سرية من القلب.. 📜</p>
                <p>أعلم أننا لا نتحدث الآن.. ولكن القلب لم ينسَ يوماً بهجة العيد معك، ولا الضحكات السحرية الجميلة.</p>
                <p>كل عام وأنت عيدي وسعادتي وسر البهجة المستمرة دائماً وأبداً 💛✨</p>
            `;
        } else {
            // بطاقات تهنئة سحرية عشوائية وملهمة للزوار العاديين
            const blessings = [
                `<p style="color: var(--gold-main); font-size: 1.35rem; font-weight: bold; text-align: center; margin-bottom: 1.25rem;">📜 بطاقة بهجة العيد السحرية ✨</p>
                 <p>أتمنى لك عيداً يملأ قلبك بنور الطمأنينة، ويحقق لك كل أمنياتك السحرية التي تحلم بها! 🌟💛</p>`,
                `<p style="color: var(--gold-main); font-size: 1.35rem; font-weight: bold; text-align: center; margin-bottom: 1.25rem;">📜 بطاقة البركة والنجاح الدائم 👑</p>
                 <p>أعاده الله عليك بالخير والبركة الدائمة والصحة، ورزقك النجاح الباهر في كل خطوة تخطوها! 🤲✨</p>`,
                `<p style="color: var(--gold-main); font-size: 1.35rem; font-weight: bold; text-align: center; margin-bottom: 1.25rem;">📜 بطاقة السلام الداخلي والسعادة 🕊️</p>
                 <p>ليكن عيدك هذا العام هادئاً، دافئاً، مبهجاً ومليئاً بضحكات وبريق عيون من تحب! 💛🕊️</p>`
            ];
            const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)];
            scrollContent.innerHTML = randomBlessing;
        }
    }

    // دالة توليد انفجار الجزيئات والكونفيتي بدون مكتبات خارجية (Lightweight Canvas-free Particles)
    function createConfettiExplosion(x, y, container) {
        const particlesCount = 35;
        const colors = ['#ffd700', '#ff69b4', '#cba358', '#ffffff', '#ff4a4a', '#a62c46'];
        const shapes = ['💖', '⚡', '✨', '⭐', '🎈', '🎉'];

        for (let i = 0; i < particlesCount; i++) {
            const el = document.createElement('div');
            el.className = 'magic-particle';
            
            // اختيار رمز أو لون عشوائي
            const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
            el.innerHTML = randomShape;
            
            // تحديد موقع البداية
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            
            // تحديد زاوية ومسافة الحركة العشوائية
            const angle = Math.random() * Math.PI * 2;
            const distance = 90 + Math.random() * 150;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance - 40; // قوة رفع لأعلى
            
            el.style.setProperty('--dx', `${dx}px`);
            el.style.setProperty('--dy', `${dy}px`);
            
            // تحديد الحجم وسرعة الانفجار عشوائياً
            const size = 0.8 + Math.random() * 0.9;
            el.style.transform = `scale(${size})`;
            el.style.animationDuration = `${0.9 + Math.random() * 0.9}s`;
            
            container.appendChild(el);
            
            // تنظيف الصفحة بحذف العنصر بعد انتهاء الحركة
            setTimeout(() => {
                el.remove();
            }, 1600);
        }
    }

    // إغلاق اللفافة وإعادة عرض الصندوق
    function resetMagicGift() {
        const giftBox = document.getElementById('magicGiftBox');
        const scroll = document.getElementById('magicScroll');
        if (!giftBox || !scroll) return;

        scroll.style.display = 'none';
        giftBox.style.display = 'block';
    }

    // ربط الدوال بنافذة المتصفح لتكون متاحة للـ HTML (إصلاح مشكلة الـ Scope في IIFE)
    window.makeSheepBleat = makeSheepBleat;
    window.explainActivePhrase = explainActivePhrase;
    window.openMagicGift = openMagicGift;
    window.resetMagicGift = resetMagicGift;

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