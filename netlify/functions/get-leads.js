exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const KEY = process.env.JSONBIN_KEY;
    const res = await fetch('https://api.jsonbin.io/v3/b/69b914e9b7ec241ddc76c888/latest', {
      headers: { 'X-Master-Key': KEY }
    });
    const data = await res.json();
    console.log('Fetched data:', JSON.stringify(data).substring(0, 100));
    const leads = Array.isArray(data.record) ? data.record.filter(l => l && l.id) : [];
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(leads)
    };
  } catch(err) {
    console.error('Error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
