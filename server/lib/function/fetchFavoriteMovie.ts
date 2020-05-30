import { Request, Response } from "express";

export default async function (req: Request, res: Response, db: any) {
  if (req.query.userId == undefined) {
    return res.status(202);
  }

  try {
    let results: Array<any> = [];
    const collection = await db.collection("favorite_videos");
    const doc: Array<any> = await collection
      .find({ userId: req.query.userId })
      .toArray();

    const videos = await db.collection("tmdb_cda_videos");
    for (let item of doc) {
      await videos
        .find({ id: item.movieId })
        .forEach((movie: any) => results.push(movie));
    }

    return res.send(results);
  } catch (e) {
    return res.send({
      status: "error",
      info: e.message,
    });
  }
}
