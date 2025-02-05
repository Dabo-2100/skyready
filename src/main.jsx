import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "animate.css";
import "./index.scss";
import { Provider } from "react-redux";
import store from "./store-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Provider>
);
