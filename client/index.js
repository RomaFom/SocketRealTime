const os = require("os");
const io = require("socket.io-client");
let socket = io("http://localhost:8181");

socket.on("connect", () => {
  console.log("connected to socket server");
  const nI = os.networkInterfaces();
  let macA;
  for (let key in nI) {
    if (!nI[key][0].internal) {
      macA = nI[key][0].mac;
      break;
    }
  }
  //client auth with single key value
  socket.emit("clientAuth", "123456");

  preformanceData().then((allPerformanceData) => {
    allPerformanceData.macA = macA;
    socket.emit("initPerfData", allPerformanceData);
  });

  // start send data on interval
  let perfDataInterval = setInterval(() => {
    preformanceData().then((allPerformanceData) => {
      // console.log(allPerformanceData);
      socket.emit("perfData", allPerformanceData);
    });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(perfDataInterval);
  });
});

function preformanceData() {
  return new Promise(async (resolve, reject) => {
    const cpus = os.cpus();
    // Os type
    const osType = os.type();
    // Up Time
    const upTime = os.uptime();
    // Memory info
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;
    // CPU info
    //-- type
    const cpuModel = cpus[0].model;
    //-- speed
    const cpuSpeed = cpus[0].speed;
    //-- cores
    const cpuCores = cpus.length;
    const cpuLoad = await getCpuLoad();
    resolve({
      osType,
      upTime,
      memUsage,
      cpuModel,
      cpuSpeed,
      cpuCores,
      cpuLoad,
      usedMem,
      totalMem,
    });
  });
}
// Load cpu calculation
function cpuAvg() {
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;
  cpus.forEach((aCore) => {
    for (let type in aCore.times) {
      totalMs += aCore.times[type];
    }
    idleMs += aCore.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
}

function getCpuLoad() {
  return new Promise((resolve, reject) => {
    const start = cpuAvg();
    setTimeout(() => {
      const end = cpuAvg();
      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;
      // console.log(idleDifference, totalDifference);
      const percentageCpu =
        100 - Math.floor((idleDifference / totalDifference) * 100);
      resolve(percentageCpu);
    }, 100);
  });
}

preformanceData().then((data) => {
  console.log(data);
});
