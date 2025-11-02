
const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const app = express();
const PORT = 3000;

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

app.listen(3000, () => console.log('Server running on port 3000'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/dev', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}/dev`);
  });
}

module.exports = app;


app.use(express.static(path.join(__dirname, 'public')));
