const { getDb, getBackupDb, isAdmin, cors, deny, body } = require("../lib/db");
const seed = require("../lib/seed.json");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    // POST /api/data?login=1  -> checks the admin password
    if (req.method === "POST" && req.query.login) {
      return isAdmin(req) ? res.status(200).json({ ok: true }) : deny(res);
    }

    if (req.method === "GET") {
      let doc;
      try {
        doc = await (await getDb()).collection("fest").findOne({ _id: "main" });
      } catch (e) {
        // main database is down -> read from the second database if there is one
        const b = await getBackupDb().catch(() => null);
        if (!b) throw e;
        console.error("Main database failed, using the second database:", e.message);
        doc = await b.collection("fest").findOne({ _id: "main" });
      }
      const data = doc ? doc.data : seed;
      res.setHeader("Cache-Control", "no-store");
      if (req.query.since !== undefined && (data.upd || 0) <= Number(req.query.since)) {
        return res.status(200).json({ unchanged: true });
      }
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      if (!isAdmin(req)) return deny(res);
      const d = body(req);
      if (!d) return res.status(400).json({ error: "bad body" });
      delete d.pass; delete d.ph;
      d.v = 1;
      d.upd = Date.now();
      const record = { _id: "main", data: d };
      // 1) main database must succeed
      await (await getDb()).collection("fest").replaceOne({ _id: "main" }, record, { upsert: true });
      // 2) second database: copy too, but never fail the update if it is unavailable
      try {
        const b = await getBackupDb();
        if (b) await b.collection("fest").replaceOne({ _id: "main" }, record, { upsert: true });
      } catch (e) { console.error("Second database copy failed:", e.message); }
      return res.status(200).json({ upd: d.upd });
    }
    return res.status(405).json({ error: "method" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server" });
  }
};
