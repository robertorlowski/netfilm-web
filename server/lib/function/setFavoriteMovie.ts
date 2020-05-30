import { Request, Response } from "express";

export default async function (req: Request, res: Response, db: any) {
  if (req.body.userId == undefined || req.body.operation == undefined) {
    return res.status(202);
  }

  try {
    const collection = await db.collection("favorite_videos");
    if (req.body.operation == "add") {
      await collection.insertOne({
        userId: req.body.userId,
        movieId: req.body.movieId,
      });
    } else {
      await collection.remove({
        userId: req.body.userId,
        movieId: req.body.movieId,
      });
    }

    return res.json({ status: "OK" });
  } catch (e) {
    return res.send({
      status: "error",
      info: e.message,
    });
  }
}
