const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// ===== CONFIGURATION =====
const PORT = process.env.PORT || 3000;
const VIDEOSDK_API_KEY = process.env.VIDEOSDK_API_KEY;
const VIDEOSDK_SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

// Validate environment variables on startup
if (!VIDEOSDK_API_KEY || !VIDEOSDK_SECRET_KEY) {
  console.error('❌ ERROR: VIDEOSDK_API_KEY and VIDEOSDK_SECRET_KEY must be set in .env file');
  process.exit(1);
}

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ===== TOKEN GENERATION FUNCTION =====
function generateVideoSDKToken(apiKey, secretKey, roomId = null) {
  const payload = {
    apikey: apiKey,
    permissions: ['ask_join', 'allow_join', 'allow_mod'],
    version: 2,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  };

  if (roomId) {
    payload.roomId = roomId;
  }

  const token = jwt.sign(payload, secretKey, {
    algorithm: 'HS256',
    header: { 'alg': 'HS256', 'typ': 'JWT' }
  });

  return token;
}

// ===== ROUTES =====

app.get('/get-token', (req, res) => {
  try {
    const { roomId } = req.query;
    console.log(`📝 Generating token${roomId ? ` for roomId: ${roomId}` : ''}`);

    const token = generateVideoSDKToken(VIDEOSDK_API_KEY, VIDEOSDK_SECRET_KEY, roomId);

    res.status(200).json({
      success: true,
      token: token,
      expiresIn: 86400,
      message: 'Token generated successfully'
    });
  } catch (error) {
    console.error('❌ Error generating token:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate token',
      message: error.message
    });
  }
});

app.post('/get-token', (req, res) => {
  try {
    const { roomId } = req.body;
    console.log(`📝 Generating token${roomId ? ` for roomId: ${roomId}` : ''}`);

    const token = generateVideoSDKToken(VIDEOSDK_API_KEY, VIDEOSDK_SECRET_KEY, roomId);

    res.status(200).json({
      success: true,
      token: token,
      expiresIn: 86400,
      message: 'Token generated successfully'
    });
  } catch (error) {
    console.error('❌ Error generating token:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate token',
      message: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!VIDEOSDK_API_KEY,
    secretKeyConfigured: !!VIDEOSDK_SECRET_KEY
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'VideoSDK Authentication Server',
    version: '1.0.0',
    endpoints: {
      'GET /get-token': 'Generate a VideoSDK token',
      'POST /get-token': 'Generate a VideoSDK token',
      'GET /health': 'Health check endpoint',
      'GET /': 'API information'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║     VideoSDK Authentication Server Started                ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  🚀 Server running on: http://localhost:${PORT}          ║
║  📝 Token Endpoint: http://localhost:${PORT}/get-token    ║
║  💓 Health Check: http://localhost:${PORT}/health         ║
║                                                           ║
║  ✅ Ready to generate VideoSDK tokens!                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
