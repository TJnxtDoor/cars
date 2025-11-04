const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const https = require('https');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Toggle mock mode via environment variable
const USE_MOCK_APPLE_PAY = process.env.USE_MOCK_APPLE_PAY === 'true';

app.use(express.static('public'));


// Paths to Apple Pay cert and key
const certPath = path.join(__dirname, 'public', 'apple-pay-cert.pem');
const keyPath = path.join(__dirname, 'public', 'apple-pay-key.pem');

// Serve favicon only if it exists
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
if (fs.existsSync(faviconPath)) {
  app.use(favicon(faviconPath));
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Merchant validation endpoint
app.post('/validate-merchant', (req, res) => {
  if (USE_MOCK_APPLE_PAY) {
    console.log('Mock merchant validation request:', req.body);
    return res.json({ mockMerchantSession: true });
  }

  const validationURL = req.body.validationURL;

  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.error('Apple Pay cert or key file missing');
    return res.status(500).send('Server misconfigured for Apple Pay');
  }

  const options = {
    hostname: new URL(validationURL).hostname,
    path: new URL(validationURL).pathname,
    method: 'POST',
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const request = https.request(options, response => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      try {
        res.send(JSON.parse(data));
      } catch (err) {
        console.error('Invalid JSON from Apple Pay:', data);
        res.status(500).send('Invalid response from Apple Pay');
      }
    });
  });

  request.on('error', error => {
    console.error('Merchant validation error:', error);
    res.status(500).send('Merchant validation failed');
  });

  request.end();
});

// Payment processing endpoint
app.post('/process-payment', (req, res) => {
  console.log('Mock payment token received:', req.body.token);
  res.json({ success: true });
});

// Dev route
app.get('/dev', (req, res) => {
  console.log(`[DEV] /dev route accessed at ${new Date().toISOString()}`);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/dev`);
    console.log(`Apple Pay mock mode: ${USE_MOCK_APPLE_PAY}`);
  });
}

module.exports = app;