require("dotenv").config({ path: __dirname + "/.env" });
var cron = require("node-cron");
var MongoDBDuplexConnector = require("mongodb-snapshot").MongoDBDuplexConnector;
var LocalFileSystemDuplexConnector =
  require("mongodb-snapshot").LocalFileSystemDuplexConnector;
var MongoTransferer = require("mongodb-snapshot").MongoTransferer;
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const hbs = require("handlebars");

var backupPath = "";
const PB_email = process.env.SENDER_GMAIL_ADDRESS;
const pass = process.env.SENDER_GMAIL_PASSWORD;

const email_info = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: PB_email,
    pass: pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

const filePath = path.join(__dirname, "../email/databasebackup.html");

const backup_task = cron.schedule("0 */24 * * *", async () => {
  await dumpMongo2Localfile();
  send_mail();
});

async function dumpMongo2Localfile() {
  const mongo_connector = new MongoDBDuplexConnector({
    connection: {
      uri: `mongodb://${process.env.DB_URL}:27017`,
      dbname: `${process.env.DB_NAME}`,
    },
  });
  var options = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  backupPath = `./${process.env.DB_NAME} ${new Date().toLocaleDateString(
    "en-US",
    options
  )} backup.tar`;

  const localfile_connector = new LocalFileSystemDuplexConnector({
    connection: {
      path: backupPath,
    },
  });
  const transferer = new MongoTransferer({
    source: mongo_connector,
    targets: [localfile_connector],
  });
  for await (const { total, write } of transferer) {
    // console.log(`remaining bytes to write: ${total - write}`);
  }
}
function send_mail() {
  try {
    readHTMLFile(filePath, function (err, html) {
      //console.log(err)

      const template = hbs.compile(html);
      const replacements = {
        message: "database back up",
      };
      const htmlToSend = template(replacements);
      const email = {
        from: PB_email,
        to: "purposeblackethiopia@gmail.com",
        subject: "Database backup",
        html: htmlToSend,
        attachments: [
          {
            path: backupPath,
          },
        ],
      };
      email_info.sendMail(email, (error, info) => {
        if (error) {
          console.log("email not send" + error);
        } else {
          fs.unlinkSync(backupPath);
          console.log("email sent" + info);
        }
      });
    });
  } catch (error) {
    return "email not sent!";
  }
}
module.exports = backup_task;
