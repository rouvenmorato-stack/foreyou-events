exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const body = JSON.parse(event.body);
    const KEY = process.env.JSONBIN_KEY;
    const BIN = '69b914e9b7ec241ddc76c888';

    const getRes = await fetch('https://api.jsonbin.io/v3/b/' + BIN + '/latest', {
      headers: { 'X-Master-Key': KEY }
    });
    const data = await getRes.json();
    let leads = Array.isArray(data.record) ? data.record : [];

    if (body.action === 'update') {
      // Update existing lead (e.g. status change)
      leads = leads.map(function(l) {
        return l.id === body.lead.id ? body.lead : l;
      });
    } else {
      // New lead
      leads.unshift(body);
    }

    const putRes = await fetch('https://api.jsonbin.io/v3/b/' + BIN, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': KEY },
      body: JSON.stringify(leads)
    });

    if (!putRes.ok) throw new Error('Save failed: ' + putRes.status);
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true }) };
  } catch(err) {
    console.error('Error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
