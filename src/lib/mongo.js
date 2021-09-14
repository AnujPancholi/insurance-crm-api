const { MongoClient, ObjectId } = require("mongodb");

const singletonDb = () => {
  let MONGOCLIENT = null;

  const mongoUtils = {
    MongoClient,
    connectClientInstance: async ({ url }) => {
      MONGOCLIENT = new MongoClient(url);
      await MONGOCLIENT.connect();
      return MONGOCLIENT;
    },
    getClientInstance: async () => {
      return MONGOCLIENT;
    },
    getValidObjectId: (idStr) => {
      try {
        const objId = ObjectId(idStr);
        return objId;
      } catch (e) {
        return null;
      }
    },
  };

  return mongoUtils;
};

module.exports = singletonDb();
