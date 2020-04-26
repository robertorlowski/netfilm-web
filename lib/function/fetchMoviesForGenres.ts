import { Request, Response } from "express";

export default async function (req: Request, res: Response, db: any) {
  const page: number = req.query.page == undefined ? 0 : Number(req.query.page);

  const category =
    req.query.category == undefined ? "popularity" : req.query.category;

  var genres: Array<Number> =
    req.query.genres == undefined
      ? []
      : req.query.genres
          .toString()
          .split(",")
          .map((item) => Number(item));

  try {
    var collection = await db.collection("tmdb_cda_videos");
    var doc = await collection
      .find(
        {
          status: "Released",
          $or: [
            { posterPath: { $ne: undefined } },
            { backdropPath: { $ne: undefined } },
          ],
          genres: { $in: genres },
        },
        {
          sort: [
            [category, "desc"],
            ["id", "asc"],
          ],
        }
      )
      .skip(10 * (page - 1))
      .limit(10)
      .toArray();

    return res.json(doc);
  } catch (e) {
    return res.send(e.message);
  }
}
