// /lib/routes/crmRoutes.ts
import fetchSearchMovies from "../function/fetchSearchMovies";
import fetchMoviesForGenres from "../function/fetchMoviesForGenres";
import fetchMovies from "../function/fetchMovies";

import { Request, Response, Application } from "express";
import fetchFavoriteMovie from "../function/fetchFavoriteMovie";
import setFavoriteMovie from "../function/setFavoriteMovie";

export class Routes {
  public routes(app: Application, db: any): void {
    // fetchSearchMovies
    app
      .route("/netfilm/fetchSearchMovies")
      .get(
        async (req: Request, res: Response) =>
          await fetchSearchMovies(req, res, db)
      );
    //fetchMovies
    app
      .route("/netfilm/fetchMovies")
      .get(
        async (req: Request, res: Response) => await fetchMovies(req, res, db)
      );
    //fetchMoviesForGenres
    app
      .route("/netfilm/fetchMoviesForGenres")
      .get(
        async (req: Request, res: Response) =>
          await fetchMoviesForGenres(req, res, db)
      );
    //fetch favorite_videos
    app
      .route("/netfilm/fetchFavoriteMovie")
      .get(
        async (req: Request, res: Response) =>
          await fetchFavoriteMovie(req, res, db)
      );
    // setFavoriteMovie
    app
      .route("/netfilm/setFavoriteMovie")
      .post(
        async (req: Request, res: Response) =>
          await setFavoriteMovie(req, res, db)
      );
  }
}
