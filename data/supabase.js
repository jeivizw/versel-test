const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = 'https://shnpueqkwpzfqmeynarm.supabase.co';
const supabaseKey = 'sb_publishable_W0ylKcYEwXFBK13C8tPo9g_XhmVa2P8';

if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL ou SUPABASE_KEY not found in .env')
}

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;