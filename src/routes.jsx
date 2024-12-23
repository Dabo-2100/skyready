import { lazy } from "react";
import { HomeProvider } from "./Pages/HomePage/HomeContext.jsx";
import { ReportProvider } from "./Pages/ReportPage/ReportContext.jsx";

const LoginPage = lazy(() => import("./Pages/LoginPage"));
const HomePage = lazy(() => import("./Pages/HomePage"));
const ReportPage = lazy(() => import("./Pages/ReportPage"));
const Report2 = lazy(() => import("./Pages/Report2"));
const ActivatePage = lazy(() => import("./Pages/ActivatePage"));
const Page404 = lazy(() => import("./Pages/Page404"))

const routes = [
  { path: "/", element: (<HomeProvider><HomePage /></HomeProvider>) },
  { path: "login", element: <LoginPage /> },
  { path: "report", element: (<ReportProvider><ReportPage /></ReportProvider>) },
  { path: "report2", element: (<ReportProvider><Report2 /></ReportProvider>) },
  { path: "activate", element: <ActivatePage /> },
  { path: "*", element: <Page404 /> },
];

export default routes;
