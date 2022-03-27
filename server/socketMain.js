const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/perfData", { useNewUrlParser: true });
const Machine = require("./models/Machine");
function socketMain(io, socket) {
  let macA;
  // console.log(`A socket connected: ${socket.id}`);
  socket.on("clientAuth", (key) => {
    if (key === "123456") {
      // valid nodeClient
      socket.join("clients");
    } else if (key === "111") {
      // valid ui client joined
      socket.join("ui");
      console.log("React cliend joined");
    } else {
      // invalid client
      socket.disconnect(true);
    }
  });

  // a machine has connected check to see if its new
  // if yes so add it
  socket.on("initPerfData", async (data) => {
    macA = data.macA;
    const mongooseResponse = await checkAndAdd(data);
    console.log(mongooseResponse);
  });

  socket.on("perfData", (data) => {
    console.log("TICK...");
    io.to("ui").emit("data", data);
  });
}
function checkAndAdd(data) {
  return new Promise((resolve, reject) => {
    Machine.findOne({ macA: data.macA }, (err, doc) => {
      if (err) {
        throw err;
        reject(err);
      } else if (doc === null) {
        let newMachine = new Machine(data);
        newMachine.save();
        resolve("Added");
      } else {
        resolve("Found");
      }
    });
  });
}

module.exports = socketMain;
