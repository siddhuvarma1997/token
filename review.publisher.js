process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const clientcon =
  "amqp://iiteaaor:pyctuQJvr173Gpm3UlwxZfSW1wuJNjFQ@sparrow.rmq.cloudamqp.com/iiteaaor";
const client = require("amqplib/callback_api");
var q = "reviews";

const url = clientcon;

//callback in case of error
function bail(err) {
  console.error(err);
  process.exit(1);
}

// Publisher
function publish_review(conn, data) {
  conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.sendToQueue(q, Buffer.from(JSON.stringify(data)));
  }
}

exports.send = (data) => {
  client.connect(url, function (err, conn) {
    if (err != null) bail(err);
    console.log("connected , publishing review");
    //TODO on review service
    // total reviews and avg rating should be computed
    // on every put, post, delete method calls

    publish_review(conn, data[0].restaurant_id);
  });
};
