exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const newLead = JSON.parse(event.body);
    
    // Get current leads
    const getRes = await fetch('https://api.jsonbin.io/v3/b/69b914e9b7ec241ddc76c888/latest', {
      headers: { 'X-Master-Key': '$2a$10$PaM27r3QWoOQOdmZLDgl..pAgmHOkTpqHu8zwFozZHld5TQi..wfC' }
    });
    const data = await getRes.json();
    const leads = Array.isArray(data.record) ? data.record : [];
    
    // Add new lead at top
    leads.unshift(newLead);
    
    // Save back
    const putRes = await fetch('https://api.jsonbin.io/v3/b/69b914e9b7ec241ddc76c888', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': '$2a$10$PaM27r3QWoOQOdmZLDgl..pAgmHOkTpqHu8zwFozZHld5TQi..wfC' },
      body: JSON.stringify(leads)
    });
    
    if (!putRes.ok) throw new Error('JSONbin save failed: ' + putRes.status);
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true }) };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};