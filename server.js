const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const https = require('https');
const fs = require('fs');
const http = require('http');

const app = express();
const PORT = 3000;
const useHttps = process.env.USE_HTTPS === 'true';
const isMockMode = process.env.MOCK_MODE === 'true';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve favicon if it exists
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
if (fs.existsSync(faviconPath)) {
  app.use(favicon(faviconPath));
}

// Apple Pay config endpoint
app.get('/config/apple-pay', (req, res) => {
  res.json({ mockMode: isMockMode });
});

// Apple Pay validation endpoint
app.post('/apple-pay/validate', (req, res) => {
  console.log('Apple Pay mock mode active — returning mock merchant session');

  const mockMerchantSession = {
    epochTimestamp: Date.now(),
    expiresAt: Date.now() + 3600000,
    merchantSessionIdentifier: 'mock-session-id',
    nonce: 'mock-nonce',
    merchantIdentifier: 'merchant.com.demo',
    domainName: 'localhost',
    displayName: 'Demo Store',
    initiative: 'web',
    initiativeContext: 'localhost',
    signature: 'mock-signature',
    merchantCapabilities: ['supports3DS'],
    supportedNetworks: ['visa', 'masterCard', 'amex'],
    countryCode: 'US',
    currencyCode: 'USD',
    paymentMethodTypes: ['debit', 'credit']
  };

  res.json({ merchantSession: mockMerchantSession });
});

// Merchant validation endpoint
app.post('/validate-merchant', (req, res) => {
  if (isMockMode) {
    console.log('Mock merchant validation request:', req.body);
    return res.json({ mockMerchantSession: true });
  }

  const validationURL = req.body.validationURL;
  const certPath = path.join(__dirname, 'public', 'apple-pay-cert.pem');
  const keyPath = path.join(__dirname, 'public', 'apple-pay-key.pem');

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
if (useHttps) {
  const keyPath = path.join(__dirname, 'key.pem');
  const certPath = path.join(__dirname, 'cert.pem');

  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`Secure server running at https://localhost:${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Logs
console.log(`Apple Pay mock mode: ${isMockMode}`);
console.log(`Using HTTPS: ${useHttps}`);
