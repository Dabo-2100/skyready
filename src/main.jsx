import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "animate.css";
import "./index.scss";
import { Provider } from "react-redux";
import store from "./store-redux";
import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import Loader from "./shared/ui/components/Loader/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RecoilRoot>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </RecoilRoot>
  </Provider>
);
