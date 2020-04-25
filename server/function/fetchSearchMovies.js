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
        if (req.query.title == undefined) {
            return res.json([]);
        }
        try {
            var collection = yield db.collection("tmdb_cda_videos");
            var doc = yield collection
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
        }
        catch (e) {
            return res.send(e.message);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=fetchSearchMovies.js.map