import styles from "./index.module.css";
export default function Page404() {
  return (
    <div
      id={styles.Page404}
      className="page d-flex align-items-center justify-content-center text-white"
    >
      <p className="col-12 text-center fw-light fs-3 mb-0">404 | Not Found</p>
    </div>
  );
}
