import { lazy } from "react";
import { ReportProvider } from "../Pages/ReportPage/ReportContext.jsx";

const LoginPage = lazy(() => import("../Pages/LoginPage/index.jsx"));
const HomePage = lazy(() => import("../Pages/HomePage/index.jsx"));
const ReportPage = lazy(() => import("../Pages/ReportPage/index.jsx"));
const Report2 = lazy(() => import("../Pages/Report2/index.jsx"));
const ActivatePage = lazy(() => import("../Pages/ActivatePage/index.jsx"));
const Page404 = lazy(() => import("../Pages/Page404/index.jsx"))

const routes = [
  { path: "/", element: (<HomePage />) },
  { path: "login", element: <LoginPage /> },
  { path: "report", element: (<ReportProvider><ReportPage /></ReportProvider>) },
  { path: "report2", element: (<ReportProvider><Report2 /></ReportProvider>) },
  { path: "activate", element: <ActivatePage /> },
  { path: "*", element: <Page404 /> },
];

export default routes;
