const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const store = getStore('leads');
    const { blobs } = await store.list();
    const leads = [];
    for (const blob of blobs) {
      const lead = await store.get(blob.key, { type: 'json' });
      if (lead) leads.push(lead);
    }
    // Sort by newest first
    leads.sort((a, b) => b.id - a.id);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(leads)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
