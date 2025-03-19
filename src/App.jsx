
import { Route, Routes } from "react-router-dom";
import { LoginPage, SettingsPage, WelcomePage } from "./routes";
import Loader from "./shared/ui/components/Loader";

import AppLayout from "./layouts/AppLayout";
import FleetApp from "./features/aircraft-fleet/app";
import ProjectsApp from "./features/project-manager/app";
import UsersApp from "./features/users/app";
import ActivatePage from "./Pages/ActivatePage";
import Page404 from "./Pages/Page404";
import Page403 from "./Pages/Page403";
import { useLoader } from "./store-zustand";

export default function App() {
  const { loaderIndex } = useLoader();
  return (
    <div className="col-12 App">
      {loaderIndex && <Loader />}
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<WelcomePage />} />
          <Route path="fleet" element={<FleetApp />} />
          <Route path="projects" element={<ProjectsApp />} />
          <Route path="users" element={<UsersApp />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/">
          <Route path="login" element={<LoginPage />} />
          <Route path="activate" element={<ActivatePage />} />
          <Route path="403" element={<Page403 />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </div>
  );
}
