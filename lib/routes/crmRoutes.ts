// /lib/routes/crmRoutes.ts
import fetchSearchMovies from "../function/fetchSearchMovies";
import fetchMoviesForGenres from "../function/fetchMoviesForGenres";
import fetchMovies from "../function/fetchMovies";

import { Request, Response, Application } from "express";

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
  }
}
