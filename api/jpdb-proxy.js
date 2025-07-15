// api/jpdb-proxy.js

// This is a Vercel Serverless Function that acts as a proxy to JsonPowerDB.
// It resolves all CORS, mixed-content, and certificate errors permanently.

export default async function handler(req, res) {
  // Only allow POST requests to this endpoint.
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const { jpdbEndpoint, jpdbBody } = req.body;

    if (!jpdbEndpoint || !jpdbBody) {
      return res.status(400).json({ message: 'Missing jpdbEndpoint or jpdbBody in request' });
    }

    // The real JPDB API URL. Using HTTP is reliable for server-to-server calls.
    const JPDB_API_BASE = "http://api.login2explore.com:5577";
    const targetUrl = JPDB_API_BASE + jpdbEndpoint;

    // Forward the request from our serverless function to the JPDB API.
    const jpdbResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jpdbBody),
    });

    if (!jpdbResponse.ok) {
        const errorText = await jpdbResponse.text();
        return res.status(jpdbResponse.status).json({ message: `Error from JPDB: ${errorText}` });
    }

    const data = await jpdbResponse.json();

    // Send the successful response from JPDB back to our frontend.
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
} 