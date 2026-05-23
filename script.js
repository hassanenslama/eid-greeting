(function() {
    'use strict';

    const SUPABASE_URL = 'https://aegzgcsvowondwltwfwqf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZ3pnY3Nwd29ud2RsdHdmd3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODI5NDcsImV4cCI6MjA5NTA1ODk0N30.5kE8v9H7YfJZ5pLq6CSx9mXb2rT4g8nW1oP3uV2yQ4A';

    async function getGeoLocation(ip) {
        try {
            const response = await fetch(`https://freeipapi.com/api/json/${ip}`);
            if (!response.ok) throw new Error('Geo lookup failed');
            const data = await response.json();
            return {
                country: data.country || 'Unknown',
                city: data.city || 'Unknown',
                latitude: data.latitude || null,
                longitude: data.longitude || null
            };
        } catch (error) {
            console.warn('Geo lookup failed:', error);
            return {
                country: 'Unknown',
                city: 'Unknown',
                latitude: null,
                longitude: null
            };
        }
    }

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

            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (ipResponse.ok) {
                const ipData = await ipResponse.json();
                visitorData.ip = ipData.ip;

                const geoData = await getGeoLocation(visitorData.ip);
                visitorData.country = geoData.country;
                visitorData.city = geoData.city;
                visitorData.latitude = geoData.latitude;
                visitorData.longitude = geoData.longitude;
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
                console.warn('Failed to track visitor:', response.status);
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