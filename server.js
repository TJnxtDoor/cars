const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const https = require('https');
const fs = require('fs');
const http = require('http');

const app = express();
const PORT = 3000;
const useHttps = process.env.USE_HTTPS === 'true';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve favicon if it exists
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
if (fs.existsSync(faviconPath)) {
  app.use(favicon(faviconPath));
}

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
  const options = {
    key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'localhost.pem'))
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
console.log(`Using HTTPS: ${useHttps}`);