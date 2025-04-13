const crypto = require('crypto');

// Load secrets from environment variables
const SECRET_KEY = process.env.CLIENT_SECRET; // Must match Android's secret key
const API_KEY = process.env.API_KEY; // Must match Android's API key

const verifyHMAC = (req, res, next) => {
    const receivedApiKey = req.headers['api-key'];
    const receivedSignature = req.headers['signature'];
    const receivedTimestamp = req.headers['timestamp'];

    // 1️⃣ Check if API key matches
    if (!receivedApiKey || receivedApiKey !== API_KEY) {
        return res.status(403).json({ error: "Invalid API Key" });
    }

    // 2️⃣ Prevent replay attacks (Reject requests older than 5 minutes)
    const currentTime = Date.now();
    if (!receivedTimestamp || (currentTime - parseInt(receivedTimestamp)) > 5 * 60 * 1000) {
        return res.status(401).json({ error: "Request expired or invalid timestamp" });
    }

    // 3️⃣ Recompute HMAC signature
    const data = receivedApiKey + receivedTimestamp;
    const computedHash = crypto.createHmac('sha256', SECRET_KEY)
                              .update(data)
                              .digest('hex');

    // 4️⃣ Compare computed signature with received signature
    if (computedHash !== receivedSignature) {
        return res.status(403).json({ error: "Unauthorized request. Invalid signature" });
    }

    // 5️⃣ Proceed to next middleware
    next();
};

module.exports = verifyHMAC;