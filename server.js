// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = 3000;

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/dev', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Only start the server if run directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   app.listen(PORT, () => {
//     console.log(` Server running at http://localhost:${PORT}/dev`);
//   });
// }

// export default app;

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

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
