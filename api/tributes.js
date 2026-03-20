const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ── GET: fetch all approved tributes
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('tributes')
      .select('id, name, relation, message, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  // ── POST: submit a new tribute
  if (req.method === 'POST') {
    const { name, relation, message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (message.trim().length > 600) {
      return res.status(400).json({ error: 'Message must be 600 characters or less.' });
    }

    const { data, error } = await supabase
      .from('tributes')
      .insert([{
        name:     name?.trim()     || 'Anonymous',
        relation: relation?.trim() || '',
        message:  message.trim(),
        approved: false
      }])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Your tribute has been submitted and will appear once approved.',
      data: data[0]
    });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
};