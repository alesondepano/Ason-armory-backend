const express = require("express");
const cors = require("cors");
const path = require("path");
const products = require("./data/products");

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Use Render's PORT env var

/**
 * ✅ SAFE CORS CONFIG - Updated for Production
 */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()) // ✅ Trim spaces from env var
  : [
      // Local Development
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:4173",
      // ✅ Production Frontend (Vercel)
      "https://ason-amory-frontend-wnvm.vercel.app",
      "https://ason-amory-frontend-wnvm.vercel.app/", // With trailing slash (just in case)
    ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile, curl, etc.)
      if (!origin) return callback(null, true);
      
      // ✅ Normalize: remove trailing slash AND trim spaces
      const cleanOrigin = origin.trim().replace(/\/$/, "");
      
      const allowed = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4173",
        "https://ason-amory-frontend-wnvm.vercel.app"
      ].map(o => o.trim().replace(/\/$/, ""));
      
      if (allowed.includes(cleanOrigin)) {
        console.log(`✅ CORS allowed: ${origin}`);
        return callback(null, true);
      }
      
      console.warn(`❌ CORS blocked: "${origin}"`);
      return callback(new Error("CORS policy"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

/**
 * ✅ SERVE PRODUCT IMAGES
 * Folder structure:
 * ecommerce-backend/
 * └── public/
 *     └── assets/
 */
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/**
 * ✅ API ROUTES
 */
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/categories", (req, res) => {
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  res.json(categories);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

/**
 * ✅ HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.json({ 
    message: "Ason Armory API is running 🎯",
    cors: {
      enabled: true,
      allowedOrigins: allowedOrigins.filter((o) => !o.includes("localhost")) // Hide localhost in prod logs
    }
  });
});

/**
 * ✅ START SERVER
 */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Products API: /api/products`);
  console.log(`🖼️  Images served from: /assets`);
  console.log(`🔓 CORS enabled for ${allowedOrigins.length} origins`);
});