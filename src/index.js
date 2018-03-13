import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Labs from "./Labs";
import Ents from "./Ents";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Labs url={process.env.PUBLIC_URL + "/data/datalabs.json"} />,
  document.getElementById("labstable")
);
ReactDOM.render(
  <Ents url={process.env.PUBLIC_URL + "/data/dataents.json"} />,
  document.getElementById("entstable")
);
registerServiceWorker(); // Mejora experiencia offline o con conexión lenta
