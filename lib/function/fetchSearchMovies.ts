import { Request, Response } from "express";

export default async function (req: Request, res: Response, db: any) {
  if (req.query.title == undefined) {
    return res.json([]);
  }

  try {
    var collection = await db.collection("tmdb_cda_videos");
    var doc = await collection
      .find({
        status: "Released",
        $or: [
          { title: { $regex: req.query.title, $options: "i" } },
          { originalTitle: { $regex: req.query.title, $options: "i" } },
        ],
      })
      .sort("Id", 1)
      .limit(100)
      .toArray();

    return res.json(doc);
  } catch (e) {
    return res.send(e.message);
  }
}
