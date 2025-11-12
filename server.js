// Proyecto/Backend/server.js
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Datadog metrics enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});