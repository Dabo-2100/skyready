import "./index.scss";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark, $LoaderIndex, $UserInfo } from "@/store";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/IPACOLogo.png";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function LoginPage() {
  // GlobalState
  const [serverUrl] = useRecoilState($Server);
  const [token, setToken] = useRecoilState($Token);
  const [darkSwal] = useRecoilState($SwalDark);
  const [, setUserInfo] = useRecoilState($UserInfo);
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const navigate = useNavigate();
  // LocalState
  const [rememberIndex, setRememberIndex] = useState(false);
  // Refs
  const emailInput = useRef();
  const passwordInput = useRef();
  // handlers
  const handleSubmit = () => {
    setLoaderIndex(true);
    event.preventDefault();
    let mail = emailInput.current.value;
    let pass = passwordInput.current.value;
    if (mail && pass && mail.trim() && pass.trim()) {
      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail)) {
        axios
          .post(
            `${serverUrl}/php/index.php/api/auth/login`,
            {
              user_email: mail,
              user_password: pass,
            },
            {
              headers: {
                Authorization: `Barear ${token}`,
              },
            }
          )
          .then((res) => {
            setLoaderIndex(false);
            let isActive = res.data.isActive;
            if (!res.data.err) {
              Swal.fire({
                icon: "success",
                text: "Successfully Login !",
                timer: 1500,
                showConfirmButton: false,
                customClass: darkSwal,
              });
              rememberIndex ? localStorage.setItem('$Token', res.data.data[0].user_token)
                : sessionStorage.setItem('$Token', res.data.data[0].user_token);
              setToken(res.data.data[0].user_token);
              navigate("/");
            } else {
              Swal.fire({
                icon: "error",
                text: res.data.msg,
                timer: 1500,
                showConfirmButton: false,
                customClass: darkSwal,
              }).then(() => {
                if (isActive == false) {
                  setToken(res.data.data.user_token);
                  sessionStorage.setItem("user_email", mail);
                  navigate('/activate');
                }
              })
            }
          })
          .catch((err) => {
            console.log(err);
            setLoaderIndex(false);
            Swal.fire({
              icon: "error",
              text: "Connection Lost !",
              timer: 1500,
              showConfirmButton: false,
              customClass: darkSwal,
            });
          });
      } else {
        setLoaderIndex(false);
        Swal.fire({
          icon: "error",
          text: "Invalid Email",
          timer: 1500,
          customClass: darkSwal,
        });
      }
    } else {
      setLoaderIndex(false);
      Swal.fire({
        icon: "info",
        text: "Please Enter You Email And Password !",
        customClass: darkSwal,
      });
    }
  };

  useEffect(() => {
    if (token) {
      axios
        .post(`${serverUrl}/php/index.php/api/auth/check`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUserInfo(res.data.data[0]);
          navigate('/');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setLoaderIndex(false);
    }
  }, []);

  // View
  return (
    <div
      id="LoginPage"
      className="page d-flex align-items-center justify-content-center"
    >
      <div className="container d-flex flex-wrap justify-content-center animate__animated animate__fadeIn">
        <div className="d-flex flex-wrap gap-3 px-4 px-md-0" id="loginContent">
          <div className="col-12 d-flex align-items-center gap-3 text-white">
            <img height={60} src={Logo} alt="IPACO Source Logo" />
            <p className="fs-3">SkyReady</p>
          </div>
          <div className="col-12 py-5 px-4 rounded-3 d-flex flex-wrap align-content-start contentBody">
            <p className="col-12 fs-5 mb-1">Welcome Back</p>
            <p className="col-12 fs-6 mb-4">
              Enter your email & password to login
            </p>
            <form
              className="col-12 d-flex flex-wrap gap-3"
              onSubmit={handleSubmit}
            >
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
      </div>
    </div>
  );
}