import { Request, Response } from "express";

export default async function (req: Request, res: Response, db: any) {
  const page: number = req.query.page == undefined ? 0 : Number(req.query.page);

  const category =
    req.query.category == undefined ? "popularity" : req.query.category;
  const limit: number =
    req.query.limit == undefined ? 10 : Number(req.query.limit);

  try {
    const collection = await db.collection("tmdb_cda_videos");
    const doc = await collection
      .find(
        {
          status: "Released",
          $or: [
            { posterPath: { $ne: undefined } },
            { backdropPath: { $ne: undefined } },
          ],
        },
        {
          sort: [
            [category, "desc"],
            ["id", "asc"],
          ],
        }
      )
      .skip(limit * (page - 1))
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
