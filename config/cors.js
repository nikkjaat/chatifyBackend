const allowedOrigins = [
  "https://chatifybackend-sytq.onrender.com", // Production URL
  "http://localhost:3000", // Development URL
];

const cors = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow requests with no origin (e.g., mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // Some browsers (e.g., IE11) choke on 204
};

module.exports = cors;
