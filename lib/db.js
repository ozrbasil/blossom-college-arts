const { MongoClient } = require("mongodb");
const crypto = require("crypto");

let pending = global._festMongo || null;
let pending2 = global._festMongo2 || null;

// Main database (required)
async function getDb() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  if (!pending) {
    pending = global._festMongo = new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 5 })
      .connect()
      .catch((e) => { pending = global._festMongo = null; throw e; });
  }
  const client = await pending;
  return client.db(process.env.MONGODB_DB || "fest");
}

// Second database (optional). Returns null when MONGODB_URI_2 is not set.
async function getBackupDb() {
  if (!process.env.MONGODB_URI_2) return null;
  if (!pending2) {
    pending2 = global._festMongo2 = new MongoClient(process.env.MONGODB_URI_2, { maxPoolSize: 3 })
      .connect()
      .catch((e) => { pending2 = global._festMongo2 = null; throw e; });
  }
  const client = await pending2;
  return client.db(process.env.MONGODB_DB || "fest");
}

const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();

function isAdmin(req) {
  const want = process.env.ADMIN_PASSWORD || "admin123";
  const got = req.headers["x-admin-password"] || "";
  return crypto.timingSafeEqual(sha(got), sha(want));
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type,x-admin-password");
}

async function deny(res) {
  await new Promise((r) => setTimeout(r, 700)); // slows down password guessing
  return res.status(401).json({ error: "unauthorized" });
}

function body(req) {
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = null; } }
  return b && typeof b === "object" ? b : null;
}

module.exports = { getDb, getBackupDb, isAdmin, cors, deny, body };
