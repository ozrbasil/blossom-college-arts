const { getDb, isAdmin, cors, deny, body } = require("../lib/db");
const seed = require("../lib/seed.json");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    // POST /api/data?login=1  -> checks the admin password
    if (req.method === "POST" && req.query.login) {
      return isAdmin(req) ? res.status(200).json({ ok: true }) : deny(res);
    }
    const col = (await getDb()).collection("fest");

    if (req.method === "GET") {
      const doc = await col.findOne({ _id: "main" });
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
      await col.replaceOne({ _id: "main" }, { _id: "main", data: d }, { upsert: true });
      return res.status(200).json({ upd: d.upd });
    }
    return res.status(405).json({ error: "method" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server" });
  }
};
