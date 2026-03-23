const express = require("express");
const cors = require("cors");
const path = require("path");
const products = require("./data/products");

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * ✅ ALLOWED ORIGINS (FIXED)
 */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) =>
      origin.trim().replace(/\/$/, "")
    )
  : [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:4173",

      // ✅ FIXED: correct spelling (armory, not amory)
      "https://ason-armory-frontend-wnvm.vercel.app",
    ];

/**
 * ✅ CLEAN CORS CONFIG (SIMPLIFIED + WORKING)
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.trim().replace(/\/$/, "");

      if (allowedOrigins.includes(cleanOrigin)) {
        console.log(`✅ CORS allowed: ${cleanOrigin}`);
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked: ${cleanOrigin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

/**
 * ✅ SERVE STATIC IMAGES
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
    status: "OK",
  });
});

/**
 * ✅ START SERVER
 */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 API: /api/products`);
});