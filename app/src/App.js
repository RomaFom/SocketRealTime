import { useState, useEffect } from "react";
import "./App.css";
import "@material-tailwind/react/tailwind.css";

import socket from "./utils/socketConnection";

import Gauge from "./Gauge";
import Userlist from "./Userlist";
import Dropdown from "./Dropdown";
function App() {
  const [data, setData] = useState({});
  const users = [
    { name: "Admin", id: 1 },
    { name: "Roma", id: 2 },
    { name: "Eden", id: 3 },
  ];
  socket.on("data", (data) => {
    setData(data);
  });

  return (
    <div className="App">
      <h1>OS: {data.osType}</h1>
      <h2>Cpu Model: {data.cpuModel}</h2>
      <h2>Cpu Cores: {data.cpuCores}</h2>
      <div className="grid gap-4 grid-cols-3">
        <div className="">
          <Gauge
            id="Cpu"
            value={data.cpuLoad}
            title="Cpu Load Precentage"
            min={0}
            max={100}
            units="%"
          />
        </div>
        <div className="">
          <Gauge
            id="CpuSpeed"
            value={data.cpuSpeed}
            title="Cpu Speed"
            min={0}
            max={5000}
            units="Rpm"
          />
        </div>
        <div className="">
          <Gauge
            id="Ram"
            value={data.memUsage * 100}
            title="Ram Usage Precentage"
            min={0}
            max={100}
            units="%"
          />
        </div>
      </div>
      <div className="grid gap-4 grid-cols-3">
        <div className="w-1/12 bg-white rounded-lg shadow-lg lg:w-1/3">
          <h3>Select user for chat</h3>
          <br />
          <ul className="divide-y-2 divide-gray-100">
            {users &&
              users.map((user) => <Userlist name={user.name} id={user.id} />)}
          </ul>
        </div>
        <Dropdown />
      </div>
    </div>
  );
}

export default App;
