import { lazy } from "react";
import AlbertoReport from "../Pages/Report2/app/index.jsx";
const HomePage = lazy(() => import("../Pages/HomePage/index.jsx"));
const LoginPage = lazy(() => import("../Pages/LoginPage/index.jsx"));
const ReportFinal = lazy(() => import("../Pages/Report/app/index.jsx"));
const ActivatePage = lazy(() => import("../Pages/ActivatePage/index.jsx"));
const Page404 = lazy(() => import("../Pages/Page404/index.jsx"))

const routes = [
  { path: "/", element: (<HomePage />) },
  { path: "login", element: <LoginPage /> },
  { path: "report", element: <ReportFinal /> },
  { path: "activate", element: <ActivatePage /> },
  { path: "key", element: <AlbertoReport /> },
  { path: "*", element: <Page404 /> },
];

export default routes;
