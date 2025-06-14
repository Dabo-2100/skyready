import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { $LoaderIndex } from "./store-recoil";
import routes from "./routes";
import Loader from "./shared/ui/components/Loader";
export default function App() {
  const loaderIndex = useRecoilValue($LoaderIndex);
  return (
    <div className="col-12 App">
      {loaderIndex && <Loader />}
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {routes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}
