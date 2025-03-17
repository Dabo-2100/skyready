import styles from "./index.module.css";
import { HiOutlineMail } from "react-icons/hi";
import { IoIosEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/IPACOLogo.png";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuthentication from "../../shared/ui/hooks/useAuthentication";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { darkSwal, token, useAuth, useLoader } from "../../store-zustand";

export default function LoginPage() {
  // GlobalState
  const { setUserInfo } = useAuth();
  const { setLoaderIndex } = useLoader();
  const navigate = useNavigate();
  const { checkToken, userLogin } = useAuthentication();
  // LocalState
  const [tokenCheck, setTokenCheck] = useState(false);
  const [showPass, setShowPass] = useState(false);
  // Schema
  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
    rememberMe: yup.boolean().notRequired(),
  });
  // handlers
  const handleSubmit = async (values) => {
    let formInputs = { user_email: values.email, user_password: values.password, remember_user_index: values.rememberMe };
    setLoaderIndex(true);
    await userLogin(formInputs).then((res) => {
      setLoaderIndex(false);
      if (res) {
        if (res.err) {
          if (res.data != null) {
            // let userInfo = res.data;
            sessionStorage.setItem("user_email", values.email);
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
          values.rememberMe ? localStorage.setItem("$Token", userInfo.user_token) : sessionStorage.setItem("$Token", userInfo.user_token);
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

          <Formik validationSchema={schema} initialValues={{ email: "", password: "", rememberMe: false }} onSubmit={handleSubmit}>
            {
              () => (
                <Form className={styles.loginForm + " col-12 d-flex gap-3 flex-column rounded-3 py-3 px-4"}>
                  <div className="d-flex col-12 flex-column">
                    <label className="mb-2">Email Address</label>
                    <div className="d-flex position-relative col-12">
                      <HiOutlineMail className={styles.inputIcon} />
                      <Field className="form-control" name="email" placeholder="email@company.com" autoComplete="username" />
                    </div>
                    <ErrorMessage className={"animate__animated animate__fadeIn " + styles.error} name="email" component="span" />
                  </div>

                  <div className="d-flex col-12 flex-column">
                    <label className="mb-2">Password</label>
                    <div className="d-flex position-relative col-12">
                      <IoLockClosedOutline className={styles.inputIcon} />
                      {showPass ? <IoIosEyeOff className={styles.iconPass} onClick={() => setShowPass(!showPass)} /> : <IoIosEye onClick={() => setShowPass(!showPass)} className={styles.iconPass} />}
                      <Field type={showPass ? 'text' : 'password'} className="form-control" name="password" placeholder="Enter Password" autoComplete="current-password" />
                    </div>
                    <ErrorMessage className={"animate__animated animate__fadeIn " + styles.error} name="password" component="span" />
                  </div>

                  <div className="col-12 d-flex justify-content-between align-items-center " id={styles.remeber}>
                    <label className="d-flex align-items-center gap-3">
                      <Field type="checkbox" name="rememberMe" /> Remember Me
                    </label>
                    <Link to="forget">Forgot Password ?</Link>
                  </div>
                  <button type="submit" className="col-12 btn">Sign In</button>
                </Form>
              )
            }
          </Formik>
        </div>
      }
    </div>
  );
}