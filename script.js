(function() {
    'use strict';

    const SUPABASE_URL = 'https://aegzgcsvowondwltwfwqf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZ3pnY3Nwd29ud2RsdHdmd3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODI5NDcsImV4cCI6MjA5NTA1ODk0N30.5kE8v9H7YfJZ5pLq6CSx9mXb2rT4g8nW1oP3uV2yQ4A';

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
        if (/macintosh|mac os x/i.test(ua)) return 'MacOS';
        if (/linux/i.test(ua)) return 'Linux';
        if (/android/i.test(ua)) return 'Android';
        if (/ios|iphone|ipad|ipod/i.test(ua)) return 'iOS';
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

    async function trackVisitor() {
        try {
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
                referrer: document.referrer || 'Direct',
                user_agent: navigator.userAgent,
                visited_at: new Date().toISOString()
            };

            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                if (ipResponse.ok) {
                    const ipData = await ipResponse.json();
                    visitorData.ip = ipData.ip;

                    try {
                        const geoResponse = await fetch(`https://get.geojs.io/v1/ip/geo/${ipData.ip}.json`);
                        if (geoResponse.ok) {
                            const geoData = await geoResponse.json();
                            visitorData.country = geoData.country || 'Unknown';
                            visitorData.city = geoData.city || 'Unknown';
                            visitorData.latitude = geoData.latitude ? parseFloat(geoData.latitude) : null;
                            visitorData.longitude = geoData.longitude ? parseFloat(geoData.longitude) : null;
                        }
                    } catch (geoErr) {
                        console.warn('Geo lookup failed:', geoErr);
                    }
                }
            } catch (ipErr) {
                console.warn('IP lookup failed:', ipErr);
            }

            const response = await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=representation'
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackVisitor);
    } else {
        trackVisitor();
    }
})();