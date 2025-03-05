const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../build')));

// Proxy API requests to Flask backend
app.use('/api', createProxyMiddleware({
  target: process.env.FLASK_URL || 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  }
}));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
