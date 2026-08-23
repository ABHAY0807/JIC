const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  // CORS Headers for seamless file:// or localhost communication
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle Automatic Background Inquiry Dispatch
  if (req.url === '/api/inquiry' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const postData = querystring.stringify({
          Client_Name: parsed.Client_Name || 'Client',
          Mobile_Number: parsed.Mobile_Number || '',
          Email_Address: parsed.Email_Address || '',
          Insurance_Requirement: parsed.Insurance_Requirement || '',
          Client_Message: parsed.Client_Message || '',
          Inquiry_Timestamp: parsed.Inquiry_Timestamp || '',
          Reference_ID: parsed.Reference_ID || '',
          _subject: parsed._subject || `🔔 New JIC Insurance Inquiry: ${parsed.Client_Name || 'Client'}`,
          _template: 'table',
          _captcha: 'false'
        });

        const fsReq = https.request('https://formsubmit.co/ajax/arunsolankipress@gmail.com', {
          method: 'POST',
          family: 4,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Referer': 'http://localhost:3000',
            'Origin': 'http://localhost:3000',
            'Accept': 'application/json'
          }
        }, (fsRes) => {
          let fsBody = '';
          fsRes.on('data', c => { fsBody += c; });
          fsRes.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(fsBody || '{"success":"true"}');
          });
        });

        fsReq.on('error', (err) => {
          console.error('Relay error:', err.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        });

        fsReq.write(postData);
        fsReq.end();
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Jagruti Insurance Consultancy (JIC) Service Active`);
  console.log(`📧 Automatic Email Relay Ready for arunsolankipress@gmail.com`);
  console.log(`======================================================\n`);
});
