const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = 3000;
const RECIPIENT_EMAIL = 'arunsolankipress@gmail.com';
const INQUIRIES_LOG_FILE = path.join(__dirname, 'inquiries.json');

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

// Helper: Append inquiry to local backup log file
function saveInquiryLocally(data) {
  try {
    let list = [];
    if (fs.existsSync(INQUIRIES_LOG_FILE)) {
      const existing = fs.readFileSync(INQUIRIES_LOG_FILE, 'utf8');
      list = JSON.parse(existing || '[]');
      if (!Array.isArray(list)) list = [];
    }
    list.unshift({
      id: data.Reference_ID || ('JIC-' + Date.now()),
      timestamp: data.Inquiry_Timestamp || new Date().toISOString(),
      clientName: data.Client_Name || 'Client',
      phone: data.Mobile_Number || '',
      email: data.Email_Address || '',
      requirement: data.Insurance_Requirement || '',
      message: data.Client_Message || '',
      receivedAt: new Date().toISOString()
    });
    // Keep last 100 entries
    if (list.length > 100) list = list.slice(0, 100);
    fs.writeFileSync(INQUIRIES_LOG_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('[BACKUP LOG ERROR]', err.message);
  }
}

const server = http.createServer((req, res) => {
  // CORS Headers for seamless file:// or localhost communication
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Requested-With');

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
        let parsed = {};
        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          parsed = JSON.parse(body || '{}');
        } else {
          parsed = querystring.parse(body || '');
        }

        const clientName = parsed.Client_Name || 'Client';
        const mobileNum = parsed.Mobile_Number || '';
        const emailAddr = parsed.Email_Address || '';
        const requirement = parsed.Insurance_Requirement || 'General Inquiry';
        const clientMsg = parsed.Client_Message || 'Please provide guidance.';
        const inquiryTime = parsed.Inquiry_Timestamp || new Date().toLocaleString('en-IN');
        const refId = parsed.Reference_ID || ('JIC-' + Math.floor(100000 + Math.random() * 900000));

        // Save local backup immediately
        saveInquiryLocally({
          Reference_ID: refId,
          Inquiry_Timestamp: inquiryTime,
          Client_Name: clientName,
          Mobile_Number: mobileNum,
          Email_Address: emailAddr,
          Insurance_Requirement: requirement,
          Client_Message: clientMsg
        });

        console.log(`\n📩 [NEW INQUIRY RECEIVED]`);
        console.log(`   Ref: ${refId} | Time: ${inquiryTime}`);
        console.log(`   Name: ${clientName} | Phone: ${mobileNum} | Email: ${emailAddr}`);
        console.log(`   Requirement: ${requirement}`);
        console.log(`   Message: ${clientMsg}`);

        const postData = querystring.stringify({
          Client_Name: clientName,
          Mobile_Number: mobileNum,
          Email_Address: emailAddr,
          Insurance_Requirement: requirement,
          Client_Message: clientMsg,
          Inquiry_Timestamp: inquiryTime,
          Reference_ID: refId,
          _subject: `🔔 New JIC Inquiry: ${clientName} - ${requirement} [${refId}]`,
          _template: 'table',
          _captcha: 'false',
          _autoresponse: `Thank you for contacting Jagruti Insurance Consultancy (JIC). We have received your inquiry for ${requirement} (Ref: ${refId}). G.H. Solanki (+91 99240 90239) will get in touch with you shortly.`
        });

        const fsReq = https.request(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
          method: 'POST',
          family: 4,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) JIC-Server-Relay/1.0',
            'Referer': 'http://localhost:3000',
            'Origin': 'http://localhost:3000',
            'Accept': 'application/json'
          }
        }, (fsRes) => {
          let fsBody = '';
          fsRes.on('data', c => { fsBody += c; });
          fsRes.on('end', () => {
            console.log(`📧 [EMAIL RELAY STATUS] HTTP ${fsRes.statusCode} -> ${fsBody}`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(fsBody || JSON.stringify({ success: "true", message: "Inquiry forwarded successfully" }));
          });
        });

        fsReq.on('error', (err) => {
          console.error('❌ [EMAIL RELAY ERROR]', err.message);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            localSaved: true,
            error: err.message,
            message: "Inquiry saved locally. Email relay had a temporary connection issue."
          }));
        });

        fsReq.write(postData);
        fsReq.end();
      } catch (e) {
        console.error('❌ [SERVER JSON PARSE ERROR]', e.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid payload' }));
      }
    });
    return;
  }

  // Static File Serving
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(__dirname, reqPath);
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
  console.log(`🌐 Website URL: http://localhost:${PORT}`);
  console.log(`📧 Automatic Email Relay Ready for ${RECIPIENT_EMAIL}`);
  console.log(`📁 Local Inquiries Log: ${INQUIRIES_LOG_FILE}`);
  console.log(`======================================================\n`);
});
