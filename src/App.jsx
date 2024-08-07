import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Page404 from "./Pages/Page404";
import ProtectedRoute from "./Components/ProtectedRoute";
import Loader from "./Components/Loader";
import { useRecoilState } from "recoil";
import { $LoaderIndex } from "./store";
export default function App() {
  const [loaderIndex] = useRecoilState($LoaderIndex);
  return (
    <div className="col-12 App">
      {loaderIndex ? <Loader /> : null}
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<h1>Landing Page</h1>} />
            <Route
              path="login"
              element={
                <ProtectedRoute component={<LoginPage />} route="/profile" />
              }
            />
            <Route path="register" element={<h1>Register New Company</h1>} />
            <Route path="join" element={<h1>Join Your Team @YourCompany</h1>} />
            <Route path="profile">
              <Route index element={<h1>Dashboard</h1>} />
              <Route path="fleet" element={<h1>Fleet Data</h1>} />
              <Route path="dashboard" element={<h1>Strapi App</h1>} />
              <Route path="settings" element={<h1>My Settigns</h1>} />
            </Route>
            <Route path="*" element={<Page404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
