var MongoDBDuplexConnector = require("mongodb-snapshot").MongoDBDuplexConnector;
var LocalFileSystemDuplexConnector =
  require("mongodb-snapshot").LocalFileSystemDuplexConnector;
var MongoTransferer = require("mongodb-snapshot").MongoTransferer;

async function restoreLocalfile2Mongo() {
  const mongo_connector = new MongoDBDuplexConnector({
    connection: {
      uri: `mongodb://143.244.173.108:27017/purposeblacketh?w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&directConnection=true&ssl=false`,
      dbname: "purposeblacketh_master",
    },
  });

  const localfile_connector = new LocalFileSystemDuplexConnector({
    connection: {
      path: "purposeblacketh_master Mon, April 11, 2022 backup.tar",
    },
  });

  const transferer = new MongoTransferer({
    source: localfile_connector,
    targets: [mongo_connector],
  });

  for await (const { total, write } of transferer) {
    console.log(`remaining bytes to write: ${total - write}`);
  }
}

module.exports = restoreLocalfile2Mongo;
