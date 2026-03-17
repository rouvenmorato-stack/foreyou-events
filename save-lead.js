exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const newLead = JSON.parse(event.body);
    const KEY = process.env.JSONBIN_KEY;
    
    const getRes = await fetch('https://api.jsonbin.io/v3/b/69b914e9b7ec241ddc76c888/latest', {
      headers: { 'X-Master-Key': KEY }
    });
    const data = await getRes.json();
    console.log('Got existing data:', JSON.stringify(data).substring(0, 100));
    const leads = Array.isArray(data.record) ? data.record : [];
    leads.unshift(newLead);
    
    const putRes = await fetch('https://api.jsonbin.io/v3/b/69b914e9b7ec241ddc76c888', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': KEY },
      body: JSON.stringify(leads)
    });
    const putData = await putRes.json();
    console.log('Save result:', JSON.stringify(putData).substring(0, 100));
    
    if (!putRes.ok) throw new Error('Save failed: ' + putRes.status);
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true }) };
  } catch(err) {
    console.error('Error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};