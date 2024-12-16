import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Page404 from "./Pages/Page404";
import Loader from "./Components/Loader";
import { useRecoilState } from "recoil";
import { $LoaderIndex } from "./store";
import HomePage from "./Pages/HomePage";
import { HomeProvider } from "./Pages/HomePage/HomeContext.jsx";
import ReportPage from "./Pages/ReportPage/index.jsx";
import { ReportProvider } from "./Pages/ReportPage/ReportContext.jsx";
import ActivatePage from "./Pages/ActivatePage/index.jsx";
import Report2 from "./Pages/Report2/index.jsx";
export default function App() {
  const [loaderIndex] = useRecoilState($LoaderIndex);
  return (
    <div className="col-12 App">
      {loaderIndex ? <Loader /> : null}
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<HomeProvider><HomePage /></HomeProvider>} />
            <Route path='login' element={<LoginPage />} />
            <Route path="report" element={<ReportProvider><ReportPage /></ReportProvider>} />
            <Route path="report2" element={<ReportProvider><Report2 /></ReportProvider>} />
            <Route path="activate" element={<ActivatePage />} />
            <Route path="*" element={<Page404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
