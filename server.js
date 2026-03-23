const express = require("express");
const cors = require("cors");
const path = require("path");
const products = require("./data/products");

const app = express();
const PORT = 5000;

/**
 * ✅ SAFE CORS CONFIG
 */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [
      "http://localhost:3000",   // React default
      "http://localhost:5173",   // Vite dev server
      "http://localhost:4173",   // ✅ Vite preview server (PWA testing)
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:4173"
  ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
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
  const categories = ["All", ...new Set(products.map(p => p.category))];
  res.json(categories);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

/**
 * ✅ HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.json({ message: "Ason Armory API is running 🎯" });
});

/**
 * ✅ START SERVER
 */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🖼️  Images served from: http://localhost:${PORT}/assets`);
  console.log(`🔓 CORS enabled for: ${allowedOrigins.join(", ")}`);
});