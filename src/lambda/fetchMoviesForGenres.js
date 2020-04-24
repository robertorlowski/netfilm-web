import { mongodb_url } from "./consts";
var MongoClient = require("mongodb").MongoClient;

exports.handler = async function (event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const page =
    event.queryStringParameters.page == undefined
      ? 0
      : event.queryStringParameters.page;

  const sortBy =
    event.queryStringParameters.category == undefined
      ? "popularity"
      : event.queryStringParameters.sortBy;

  var genres =
    event.queryStringParameters.genres == undefined
      ? []
      : event.queryStringParameters.genres
          .split(",")
          .map((item) => Number(item));

  var client = await MongoClient.connect(mongodb_url, {
    useUnifiedTopology: true,
  });
  try {
    var dbo = client.db();
    var collection = await dbo.collection("tmdb_cda_videos");
    var doc = await collection
      .find({
        status: "Released",
        $or: [
          { posterPath: { $ne: undefined } },
          { backdropPath: { $ne: undefined } },
        ],
        genres: { $in: genres },
      })
      .sort(sortBy, 1)
      .sort("Id", 1)
      .skip(10 * (page - 1))
      .limit(10)
      .toArray();
    const response = {
      statusCode: 200,
      body: JSON.stringify(doc),
    };
    return response;
  } catch (e) {
    const response = {
      statusCode: 500,
      body: e.message,
    };
    return response;
  } finally {
    client.close();
  }
};
