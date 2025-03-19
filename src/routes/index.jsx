import { lazy } from "react";

export const LoginPage = lazy(() => import("../Pages/LoginPage/index.jsx"));
export const ReportFinal = lazy(() => import("../Pages/Report/app/index.jsx"));
export const ActivatePage = lazy(() => import("../Pages/ActivatePage/index.jsx"));
export const Page404 = lazy(() => import("../Pages/Page404/index.jsx"));
export const TreePage = lazy(() => import("../Pages/TreePage/index.jsx"));
export const SettingsPage = lazy(() => import("../Pages/Settings/index.jsx"));
export const AlbertoReport = lazy(() => import("../Pages/Report2/app/index.jsx"));
export const WelcomePage = lazy(() => import("../shared/ui/components/WelcomePage"));