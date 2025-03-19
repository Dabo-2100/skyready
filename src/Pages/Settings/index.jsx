import styles from "./index.module.css";
export default function SettingsPage() {
    return (
        <div className="col-12 d-flex flex-column" id={styles.settingsPage}>
            <div className="col-12 d-flex">
                <h4 className="m-0 p-3 border-bottom col-12">Settings</h4>
            </div>
            <div className="col-12 p-3 d-flex flex-column">
                <p className="text-secondary">User Settings</p>
                <div className="col-12 d-flex flex-wrap">

                    <div className="col-12 col-md-6 border d-flex">
                        <div className="border-end p-3">Email : </div>
                        <div className="p-3">a_fattah_m@icloud.com</div>
                    </div>

                    <div className="col-12 col-md-6 border d-flex">
                        <div className="border-end p-3">User Name : </div>
                        <div className="p-3">a_fattah_m@icloud.com</div>
                    </div>

                </div>
            </div>

        </div>
    )
}
