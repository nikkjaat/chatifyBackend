const allowedOrigins = [
  "https://mychatifyapp.netlify.app", // Frontend URL
  "http://localhost:3000", // Development URL (optional)
];

const cors = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // If you are using cookies or auth headers
  optionsSuccessStatus: 200, // Some browsers (e.g., IE11) choke on 204
};

module.exports = cors;
