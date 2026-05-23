// Edge Function not needed - using Supabase REST API directly
// Keeping this file for reference only

// To use Edge Functions instead:
// 1. Go to Supabase Dashboard > Edge Functions
// 2. Create new function named "track-visitor"
// 3. Paste the code below
// 4. Use the Edge Function URL in script.js

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VisitorData {
    ip: string | null
    country: string | null
    city: string | null
    latitude: number | null
    longitude: number | null
    device_type: string
    os: string
    browser: string
    language: string
    referrer: string
    user_agent: string
    visited_at: string
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

        const supabase = createClient(supabaseUrl, supabaseKey)

        const visitorData: VisitorData = await req.json()

        const { data, error } = await supabase
            .from('visitors')
            .insert([
                {
                    ip: visitorData.ip,
                    country: visitorData.country,
                    city: visitorData.city,
                    latitude: visitorData.latitude,
                    longitude: visitorData.longitude,
                    device_type: visitorData.device_type,
                    os: visitorData.os,
                    browser: visitorData.browser,
                    language: visitorData.language,
                    referrer: visitorData.referrer,
                    user_agent: visitorData.user_agent,
                    visited_at: visitorData.visited_at
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('Database error:', error)
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({ success: true, data }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Server error:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})