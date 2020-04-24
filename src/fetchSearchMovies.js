import { mongodb_url } from "./consts";
var MongoClient = require("mongodb").MongoClient;

exports.handler = async function (event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.queryStringParameters.query == undefined) {
    const response = {
      statusCode: 200,
      body: JSON.stringify([]),
    };
    return response;
  }
  const query = event.queryStringParameters.query;

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
          { title: { $regex: query, $options: "i" } },
          { originalTitle: { $regex: query, $options: "i" } },
        ],
      })
      .sort("Id", 1)
      .limit(100)
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
