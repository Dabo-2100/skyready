import { useEffect, useRef } from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { $LoaderIndex, $Token, $Server, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
export default function ActivatePage() {
  const [darkSwal] = useRecoilState($SwalDark);
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const [token] = useRecoilState($Token);
  const [serverUrl] = useRecoilState($Server);
  const navigate = useNavigate();
  const [checkEmail, setCheckEmail] = useState();
  const inputsRef = useRef([]);

  const handleActivate = (event) => {
    event.preventDefault();
    let code = inputsRef.current.reduce((acc, el) => { return acc += el.value }, "");
    let obj = {
      user_email: checkEmail,
      user_vcode: code
    }
    axios.post(`${serverUrl}/php/index.php/api/auth/activate`, obj, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.err) {
          Swal.fire({
            icon: "error",
            text: "Invaild Code !",
            timer: 1200,
            showConfirmButton: false,
            customClass: darkSwal,
          })
        } else {
          Swal.fire({
            icon: "success",
            text: "Your account has been activated succssfully !",
            timer: 1200,
            showConfirmButton: false,
            customClass: darkSwal,
          }).then(() => {
            sessionStorage.setItem("$Token", token);
            navigate('/');
          })
        }
      })
      .catch((err) => { console.log(err); })
  }

  const handleChange = (index) => (event) => {
    const value = event.target.value;
    // Move to the next input if a number is entered
    if (value.length === 1 && !isNaN(value)) {
      const nextInput = inputsRef.current[index + 1];
      if (nextInput) {
        nextInput.value = "";
        nextInput.focus();
      }
    }
  };

  const sendMail = () => {
    setLoaderIndex(true);
    axios.post(`${serverUrl}/php/index.php/api/users/resend`, {}, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
      console.log(res);
      Swal.fire({
        icon: "success",
        text: "Activation code sent successfully to you mail !",
        customClass: darkSwal,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => { setLoaderIndex(false) });
    })
  }

  useEffect(() => {
    setLoaderIndex(true);
    let email = sessionStorage.getItem("user_email");
    setTimeout(() => { (!email || !token) ? (navigate('/login'), sessionStorage.clear()) : (setCheckEmail(email), setLoaderIndex(false)) }, 800);
  }, [])
  return (
    <div className="col-12 d-flex align-items-center justify-content-center p-3" id="ActivatePage">
      {
        (checkEmail != undefined) && (
          <form className="d-flex flex-column align-items-center container content py-5 px-3 gap-3 rounded-4">
            <h4 className="col-12 text-center m-0">Please activate your account</h4>
            <p className="col-12 text-center">We sent verfication code to you email</p>
            <p className="col-12 text-center fw-bold">{checkEmail}</p>
            <div className="col-12 d-flex gap-3 justify-content-center">
              {
                [...Array(4)].map((el, index) => {
                  return (
                    <input
                      autoComplete={"false"}
                      onChange={handleChange(index)}
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      type="text"
                      style={{ width: "50px", maxWidth: "20%" }}
                      className="text-center py-3 fs-3 rounded-2"
                      maxLength={1}
                      tabIndex={+index + 1}
                    />
                  )
                })
              }
            </div>
            <button onClick={handleActivate} className="btn btn-success col-6 fs-5">Activate account</button>
            <h6 className="col-12 text-center d-flex justify-content-center gap-1">Don't have the code ? <p onClick={sendMail} className="theLink">Send again</p></h6>
          </form>
        )
      }
    </div>
  )
}
