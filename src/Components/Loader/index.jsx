import IPACOLoader from "./logo.gif";
import "./index.scss";
export default function Loader() {
  return (
    <div className="col-12" id="Loader">
      <img src={IPACOLoader} height={100} />
    </div>
  );
}
