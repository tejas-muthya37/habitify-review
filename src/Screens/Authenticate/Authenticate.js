import "./authenticate.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useToast } from "./../../Context/toast-context";
import { useToken } from "./../../Context/token-context";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Authenticate(props) {
  const { encodedToken, setEncodedToken } = useToken();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    localStorage.setItem("ENCODED_TOKEN_3", encodedToken);
  }, [encodedToken]);

  let navigate = useNavigate();

  const { toggleToast, toastVisibility, toastColor, toastText } = useToast();

  const emailPattern = /\S+@\S+\.\S+/;
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleAuth = () => {
    var payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    if (props.cardTitle === "SIGN IN") {
      fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.errors) {
            emailRef.current.value = "";
            passwordRef.current.value = "";
            setEncodedToken(data.encodedToken);
            navigate("/");
          } else {
            toggleToast(
              "Invalid credentials! Please try again.",
              "red",
              "whitesmoke"
            );
          }
        });
    } else if (props.cardTitle === "SIGN UP") {
      if (!emailPattern.test(payload.email)) {
        toggleToast(
          "Email Address is not valid! Please try again.",
          "red",
          "whitesmoke"
        );
      } else if (payload.password.length < 8) {
        toggleToast(
          "Password should be atleast 8 characters long!",
          "red",
          "whitesmoke"
        );
      } else {
        fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              emailRef.current.value = "";
              passwordRef.current.value = "";
              setEncodedToken(data.encodedToken);
              navigate("/");
            }
          });
      }
    }
  };

  const handleGuestLogin = () => {
    emailRef.current.value = "tejas.muthya@gmail.com";
    passwordRef.current.value = "tejasmuthya";
    handleAuth();
  };

  return (
    <div className="Authenticate">
      <p
        style={{
          visibility: toastVisibility,
          backgroundColor: toastColor.backgroundColor,
          color: toastColor.color,
        }}
        className="message-toast"
      >
        {toastText}
      </p>
      <div className="landing-card">
        <h1>{props.cardTitle}</h1>
        <div className="landing-inputs">
          <div className="label-with-input">
            <label htmlFor="email">Email Address *</label>
            <input ref={emailRef} type="email" id="email" />
          </div>
          <div className="label-with-input">
            <label id="password-label" htmlFor="password">
              <span>Password *</span>
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <VisibilityOffIcon fontSize="small" />
                )}
              </span>
            </label>
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              id="password"
            />
          </div>
        </div>
        <button onClick={handleAuth}>Next</button>
        {props.cardTitle === "SIGN IN" && (
          <button onClick={handleGuestLogin}>Login As Guest</button>
        )}
        <p className="alternate-cta">
          <Link to={props.cardTitle === "SIGN IN" ? "/signup" : "/login"}>
            {props.alternate} <span>{">"}</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Authenticate;
