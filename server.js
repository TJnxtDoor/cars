const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Merchant validation endpoint
app.post('/validate-merchant', (req, res) => {
  const validationURL = req.body.validationURL;

  const options = {
    hostname: new URL(validationURL).hostname,
    path: new URL(validationURL).pathname,
    method: 'POST',
    cert: fs.readFileSync('path/to/apple-pay-cert.pem'),
    key: fs.readFileSync('path/to/apple-pay-key.pem'),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const request = https.request(options, response => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => res.send(JSON.parse(data)));
  });

  request.on('error', error => {
    console.error(error);
    res.status(500).send('Merchant validation failed');
  });

  request.end();
});

// Dev route
app.get('/dev', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/dev`);
  });
}

module.exports = app;