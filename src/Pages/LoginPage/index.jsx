import styles from "./index.module.css";
import { HiOutlineMail } from "react-icons/hi";
import { IoLockClosedOutline } from "react-icons/io5";
import { useRecoilState, useRecoilValue } from "recoil";
import { $Token, $SwalDark, $LoaderIndex, $UserInfo } from "@/store-recoil";
import { IoIosEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/IPACOLogo.png";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import useAuthentication from "../../shared/ui/hooks/useAuthentication";

export default function LoginPage() {
  // GlobalState
  const darkSwal = useRecoilValue($SwalDark);
  const [token, setToken] = useRecoilState($Token);
  const [, setUserInfo] = useRecoilState($UserInfo);
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const navigate = useNavigate();
  const { checkToken, userLogin } = useAuthentication();
  // LocalState
  const [tokenCheck, setTokenCheck] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [rememberIndex, setRememberIndex] = useState(false);
  // Refs
  const emailInput = useRef();
  const passwordInput = useRef();
  // handlers
  const handleSubmit = async () => {

    event.preventDefault();
    let formInputs = { user_email: emailInput.current.value, user_password: passwordInput.current.value, remember_user_index: rememberIndex, };
    setLoaderIndex(true);
    await userLogin(formInputs).then((res) => {
      setLoaderIndex(false);
      if (res) {
        if (res.err) {
          if (res.data != null) {
            let userInfo = res.data;
            setToken(userInfo.user_token);
            sessionStorage.setItem("user_email", emailInput.current.value);
            Swal.fire({
              icon: "info",
              title: "User is not active",
              timer: 1500,
              customClass: darkSwal
            }).then(() => {
              navigate('/activate');
            })
          } else {
            Swal.fire({
              icon: "error",
              title: "Wrong username or password",
              timer: 1500,
              customClass: darkSwal
            })
          }
        } else {
          let userInfo = res.data[0];
          setUserInfo(userInfo);
          setToken(userInfo.user_token);
          rememberIndex ? localStorage.setItem("$Token", userInfo.user_token) : sessionStorage.setItem("$Token", userInfo.user_token);
          Swal.fire({
            icon: "success",
            title: "Login Successfully !",
            timer: 1500,
            customClass: darkSwal,
          }).then(() => { navigate('/') })
        }
      }
    });

  };

  useEffect(() => {
    if (token) {
      checkToken().then((res) => {
        if (res) {
          if (res.is_active == 0) {
            sessionStorage.setItem("user_email", res.user_email);
            navigate('/activate');
          } else {
            setUserInfo(res);
            navigate('/');
          }
        } else {
          setTokenCheck(true);
        }
      })
    } else {
      setTokenCheck(true);
    }
    // eslint-disable-next-line
  }, []);

  // View
  return (
    <div id={styles.LoginPage} className="col-12 p-4 pt-5 d-flex align-items-start justify-content-center">
      {
        tokenCheck &&
        <div className="container d-flex flex-column align-items-center col-12 col-md-6 col-lg-5 animate__animated animate__fadeInDown" id={styles.loginContent}>
          <div className="col-12 d-flex flex-column gap-2 align-items-center" id={styles.logoHeader}>
            <img src={Logo} alt="IPACO Source Logo" />
            <h1 className="mb-0">Welcome Back</h1>
            <p className="mb-3">Please sign in to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="col-12 d-flex flex-column rounded-3 py-3 px-4">
            <div className="d-flex col-12 flex-column position-relative">
              <HiOutlineMail className={styles.inputIcon} />
              <label className="mb-2">Email Address</label>
              <input ref={emailInput} type="text" className="form-control mb-3" placeholder="email@company.com" />
            </div>

            <div className="d-flex col-12 flex-column position-relative">
              <IoLockClosedOutline className={styles.inputIcon} />
              <label className="mb-2">Password</label>
              {showPass ? <IoIosEyeOff className={styles.iconPass} onClick={() => setShowPass(!showPass)} /> : <IoIosEye onClick={() => setShowPass(!showPass)} className={styles.iconPass} />}
              <input ref={passwordInput} type={showPass ? 'text' : 'password'} className="form-control mb-3" placeholder="Enter Password" />
            </div>

            <div className="col-12 d-flex justify-content-between align-items-center mt-2 mb-4" id={styles.remeber}>
              <div className="d-flex align-items-center gap-2">
                <input type="checkbox" id="rememberMeInput" checked={rememberIndex} onChange={(e) => setRememberIndex(e.target.checked)} />
                <label htmlFor="rememberMeInput">Remember Me</label>
              </div>
              <Link to="forget">Forgot Password ?</Link>
            </div>
            <button className="col-12 btn">Sign In</button>
          </form>
        </div>

      }

      {/* <div className="container d-flex flex-wrap justify-content-center animate__animated animate__fadeIn">
        <div className="d-flex flex-wrap gap-3 px-4 px-md-0" id={styles.loginContent}>
          <div className="col-12 d-flex flex-column align-items-center gap-3 text-white">
            <img height={60} src={Logo} alt="IPACO Source Logo" />
            <p className="fs-3">SkyReady</p>
          </div>
          <div className="col-12 py-5 px-4 rounded-3 d-flex flex-wrap align-content-start contentBody">
            <p className="col-12 fs-5 mb-1">Welcome Back</p>
            <p className="col-12 fs-6 mb-4">
              Enter your email & password to login
            </p>

            <form className="col-12 d-flex flex-wrap gap-3" onSubmit={handleSubmit}>
              <div className="inputField col-12 d-flex flex-column gap-2">
                <label htmlFor="email">Email Address</label>
                <input
                  required
                  ref={emailInput}
                  autoComplete="off"
                  className="form-control"
                  type="email"
                  id="email"
                  placeholder="email@company.com"
                />
              </div>
              <div className="inputField col-12 d-flex flex-column gap-2">
                <label htmlFor="password">Password</label>
                <input
                  required
                  ref={passwordInput}
                  autoComplete="off"
                  className="form-control"
                  type="password"
                  id="password"
                  placeholder="**********"
                />
              </div>
              <div className="col-12 d-flex align-items-center justify-content-between py-3">
                <div className="checkbox-wrapper-46">
                  <input
                    type="checkbox"
                    id="cbx-46"
                    className="inp-cbx"
                    onChange={(event) => {
                      setRememberIndex(event.target.checked);
                    }}
                  />
                  <label htmlFor="cbx-46" className="cbx">
                    <span>
                      <svg viewBox="0 0 12 10" height="10px" width="12px">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                      </svg>
                    </span>
                    <span>Remember me</span>
                  </label>
                </div>
                <Link to="/forget">Forgot password?</Link>
              </div>
              <button className="col-12 btn signIn text-white">Sign in</button>
            </form>
          </div>
        </div>
      </div> */}
    </div>
  );
}


// Customized Project Management System