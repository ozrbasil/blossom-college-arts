const crypto = require("crypto");
const { getDb, getBackupDb, isAdmin, cors, deny, body } = require("../lib/db");

const ID = /^[a-f0-9]{16}$/;

// Look in the main database first, then in the second one
async function findImage(id) {
  let doc = null, err = null;
  try { doc = await (await getDb()).collection("images").findOne({ _id: id }); } catch (e) { err = e; }
  if (doc) return doc;
  try {
    const b = await getBackupDb();
    if (b) { const d2 = await b.collection("images").findOne({ _id: id }); if (d2) return d2; }
  } catch (e) { /* ignore */ }
  if (err) throw err;
  return null;
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    if (req.method === "GET") {
      const id = String(req.query.id || "");
      if (!ID.test(id)) return res.status(400).end();
      const doc = await findImage(id);
      if (!doc) return res.status(404).end();
      res.setHeader("Content-Type", doc.mime);
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      const raw = typeof doc.data.value === "function" ? doc.data.value() : doc.data; // BSON Binary -> exact bytes
      return res.status(200).send(Buffer.from(raw));
    }

    if (req.method === "POST") {
      if (!isAdmin(req)) return deny(res);
      const b = body(req);
      const m = b && typeof b.dataUrl === "string" && b.dataUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
      if (!m) return res.status(400).json({ error: "bad image" });
      const buf = Buffer.from(m[2], "base64");
      if (buf.length > 3.5 * 1024 * 1024) return res.status(413).json({ error: "too large" });
      const id = crypto.randomBytes(8).toString("hex");
      const record = { _id: id, mime: m[1], data: buf, at: Date.now() };
      await (await getDb()).collection("images").insertOne(record);
      try {
        const b2 = await getBackupDb();
        if (b2) await b2.collection("images").insertOne({ ...record });
      } catch (e) { console.error("Second database photo copy failed:", e.message); }
      return res.status(200).json({ path: "/api/img?id=" + id });
    }

    if (req.method === "DELETE") {
      if (!isAdmin(req)) return deny(res);
      const id = String(req.query.id || "");
      if (!ID.test(id)) return res.status(400).end();
      await (await getDb()).collection("images").deleteOne({ _id: id });
      try {
        const b2 = await getBackupDb();
        if (b2) await b2.collection("images").deleteOne({ _id: id });
      } catch (e) { /* ignore */ }
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "method" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server" });
  }
};
