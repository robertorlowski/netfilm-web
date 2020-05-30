import { Request, Response } from "express";

export default async function (req: Request, res: Response, db: any) {
  if (req.query.title == undefined) {
    return res.json([]);
  }

  const limit: number =
    req.query.limit == undefined ? 100 : Number(req.query.limit);

  try {
    const collection = await db.collection("tmdb_cda_videos");
    const doc = await collection
      .find({
        status: "Released",
        $or: [
          { title: { $regex: req.query.title, $options: "i" } },
          { originalTitle: { $regex: req.query.title, $options: "i" } },
        ],
      })
      .sort("Id", 1)
      .limit(limit)
      .toArray();

    return res.json(doc);
  } catch (e) {
    return res.send({
      status: "error",
      info: e.message,
    });
  }
}
