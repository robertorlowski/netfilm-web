"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// /lib/routes/crmRoutes.ts
const fetchSearchMovies_1 = require("../function/fetchSearchMovies");
const fetchMoviesForGenres_1 = require("../function/fetchMoviesForGenres");
const fetchMovies_1 = require("../function/fetchMovies");
class Routes {
    routes(app, db) {
        // fetchSearchMovies
        app
            .route("/netfilm/fetchSearchMovies")
            .get((req, res) => __awaiter(this, void 0, void 0, function* () { return yield fetchSearchMovies_1.default(req, res, db); }));
        //fetchMovies
        app
            .route("/netfilm/fetchMovies")
            .get((req, res) => __awaiter(this, void 0, void 0, function* () { return yield fetchMovies_1.default(req, res, db); }));
        //fetchMoviesForGenres
        app
            .route("/netfilm/fetchMoviesForGenres")
            .get((req, res) => __awaiter(this, void 0, void 0, function* () { return yield fetchMoviesForGenres_1.default(req, res, db); }));
    }
}
exports.Routes = Routes;
//# sourceMappingURL=crmRoutes.js.map