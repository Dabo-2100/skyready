
import { Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { $LoaderIndex } from "./store-recoil";
import { LoginPage, WelcomePage } from "./routes";
import Loader from "./shared/ui/components/Loader";

import AppLayout from "./layouts/AppLayout";
import FleetApp from "./features/aircraft-fleet/app";
import ProjectsApp from "./features/project-manager/app";
import UsersApp from "./features/users/app";

export default function App() {
  const loaderIndex = useRecoilValue($LoaderIndex);
  return (
    <div className="col-12 App">
      {loaderIndex && <Loader />}
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<WelcomePage />} />
          <Route path="fleet" element={<FleetApp />} />
          <Route path="projects" element={<ProjectsApp />} />
          <Route path="users" element={<UsersApp />} />
        </Route>

        <Route path="/">
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </div>
  );
}
