import { useState, useEffect } from "react";

import Header from "./components/header";
import Footer from "./components/footer";
import "./App.css";

const SerialApi = navigator.serial;

function App() {
  const [ports, setPorts] = useState([]);

  const onSelectSerialPort = async () => {
    try {
      const port = await SerialApi.requestPort();

      const portNames = [port].map((item) => {
        console.log(item);

        const info = item.getInfo();
        const name = `${info.usbVendorId}:${info.usbProductId}`;

        return name;
      });

      console.log("----selected port---->", portNames);
    } catch (e) {
      // No port selected, do nothing
      console.debug(e);
    }
  };

  const serialConnectHandler = () => {
    console.log("serialConnectHandler");
  };

  const serialDisconnectHandler = () => {
    console.log("serialDisconnectHandler");
  };

  useEffect(() => {
    SerialApi.getPorts().then((ports) => {
      console.log("connected ports----------------------->", ports);

      setPorts(ports);
    });

    SerialApi.removeEventListener("connect", serialConnectHandler);
    SerialApi.removeEventListener("disconnect", serialDisconnectHandler);

    SerialApi.addEventListener("connect", serialConnectHandler);
    SerialApi.addEventListener("disconnect", serialDisconnectHandler);
  }, []);

  return (
    <>
      <Header />

      <div className="main">
        <div className="container">
          {ports.length && (
            <>
              <h3>Connected ports:</h3>
              {ports.map((port, indx) => {
                const info = port.getInfo();

                return (
                  <div key={indx}>
                    Port ${indx + 1}: {info.usbVendorId || "no usb vendor ID"}
                  </div>
                );
              })}
            </>
          )}

          <button onClick={onSelectSerialPort}>Select serial port</button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default App;
