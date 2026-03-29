# VideoSDK Authentication Server

Secure backend server for generating VideoSDK tokens.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm start
```

Server runs on `http://localhost:3000`

## 📡 API Endpoints

### GET /get-token
Generates a VideoSDK token

**Request:**
```bash
curl http://localhost:3000/get-token
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

### GET /health
Health check endpoint

```bash
curl http://localhost:3000/health
```

## 🔧 Configuration

Edit `.env` file:
```env
VIDEOSDK_API_KEY=your-key
VIDEOSDK_SECRET_KEY=your-secret
PORT=3000
```

## 📱 React Native App Integration

Set `REACT_APP_AUTH_URL=http://localhost:3000` in your app's `.env`

The app will automatically fetch tokens from this server!

## 📚 For Production

Deploy this server to Heroku, AWS, or your preferred hosting platform and update the app's auth URL.
