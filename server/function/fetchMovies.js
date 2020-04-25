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
function default_1(req, res, db) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = req.query.page == undefined ? 0 : Number(req.query.page);
        const category = req.query.category == undefined ? "popularity" : req.query.category;
        try {
            var collection = yield db.collection("tmdb_cda_videos");
            var doc = yield collection
                .find({
                status: "Released",
                $or: [
                    { posterPath: { $ne: undefined } },
                    { backdropPath: { $ne: undefined } },
                ],
            })
                .sort(category, 1)
                .sort("Id", 1)
                .skip(10 * (page - 1))
                .limit(10)
                .toArray();
            return res.json(doc);
        }
        catch (e) {
            return res.send(e.message);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=fetchMovies.js.map