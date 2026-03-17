exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const res = await fetch('https://api.jsonbin.io/v3/b/69b914e9b7ec241ddc76c888/latest', {
      headers: { 'X-Master-Key': '$2a$10$PaM27r3QWoOQOdmZLDgl..pAgmHOkTpqHu8zwFozZHld5TQi..wfC' }
    });
    const data = await res.json();
    const leads = Array.isArray(data.record) ? data.record.filter(l => l && l.id) : [];
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(leads)
    };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};