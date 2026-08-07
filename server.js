const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5501;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API to list certificates dynamically
app.get('/api/certificates', (req, res) => {
  const certsDir = path.join(__dirname, 'public', 'certificates');
  fs.readdir(certsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read certificates directory' });
    }
    const certFiles = files.filter(file => file.endsWith('.pdf'));
    const certificates = certFiles.map(file => {
      // Create pretty name: e.g. "AWS_Cloud_Practitioner.pdf" -> "AWS Cloud Practitioner"
      const name = file
        .replace('.pdf', '')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return {
        name,
        filename: file,
        url: `/certificates/${file}`
      };
    });
    res.json(certificates);
  });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio server is running on http://localhost:${PORT}`);
});
