import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CustomInput from '../../reusable-components/CustomInput'
import CustomButton from '../../reusable-components/CustomButton'
import CustomInputGroup from '../../reusable-components/CustomInputGroup'
import { Link, replace, useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-toastify'
import sha256 from 'sha256';
import CustomSpinner from '../../reusable-components/CustomSpinner'




const Login = () => {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginInputs, setLoginInputs] = useState({})
  const [errorMessage, setErrorMessage] = useState({
    usernameErrorMessage: "",
    passwordErrorMessage: "",
  })
  const [error, setError] = useState({
    usernameError: false,
    passwordError: false,
  })

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");
    const digiLockerURL = sessionStorage.getItem("digiLockerURL");
    const digiLockerAccessId = sessionStorage.getItem("digiLockerAccessId");
    const isDigiFormFirstVisit = sessionStorage.getItem("isDigiFormFirstVisit");

    if (accessToken || refreshToken || digiLockerURL || digiLockerAccessId || isDigiFormFirstVisit) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("digiLockerURL");
      sessionStorage.removeItem("digiLockerAccessId");
      sessionStorage.removeItem("isDigiFormFirstVisit");
    }
  }, []);

  const handleShowPassword = (name) => {
    switch (name) {
      case "password":
        setShowPassword(!showPassword)
        break;
      default:
        console.log("default")
        break;
    }
  }

  const handleLoginInputs = (e) => {
    const { name, value } = e.target
    setLoginInputs((prevState) => (
      { ...prevState, [name]: value }
    ))

    if (value.trim() !== "") {
      setError((prevState) => (
        { ...prevState, [`${name}Error`]: false }
      ));

      setErrorMessage((prevState) => (
        { ...prevState, [`${name}ErrorMessage`]: "" }
      ));
    }

  }

  const handleBlur = (name) => {
    switch (name) {
      case "username":
        if (!loginInputs?.username?.trim()) {
          setError((prevState) => (
            { ...prevState, usernameError: true }
          ))
          setErrorMessage((prevState) => (
            { ...prevState, usernameErrorMessage: "Username should not be empty" }
          ))
        }
        break;
      case "password":
        if (!loginInputs?.password?.trim()) {
          setError((prevState) => (
            { ...prevState, passwordError: true }
          ))
          setErrorMessage((prevState) => (
            { ...prevState, passwordErrorMessage: "Password should not be empty" }
          ))
        }
        break;
      default:
        console.log("default")
        break;
    }
  }

  const handleLogin = async () => {
    let hasError = false;

    if (!loginInputs?.username?.trim()) {
      setError(prevState => ({ ...prevState, usernameError: true }));
      setErrorMessage(prevState => ({ ...prevState, usernameErrorMessage: "Username should not be empty" }));
      hasError = true;
    }

    if (!loginInputs?.password?.trim()) {
      setError(prevState => ({ ...prevState, passwordError: true }));
      setErrorMessage(prevState => ({ ...prevState, passwordErrorMessage: "Password should not be empty" }));
      hasError = true;
    }

    if (hasError) {
      console.error("Validation failed: Fields cannot be empty");
      return;
    }

    try {
      setLoading(true)

      const username = loginInputs?.username?.trim();
      const password = sha256(loginInputs?.password?.trim());

      const basicAuth = "Basic " + btoa(`${username}:${password}`);
      const response = await axiosInstance.get('/login', {
        headers: {
          Authorization: basicAuth,
        },
      });

      if (response.data.error_code === 200) {
        sessionStorage.setItem("accessToken", response.data.data.access_token)
        sessionStorage.setItem("refreshToken", response.data.data.refresh_token)
        await handleDigiLockerRequest(response.data.data.access_token)
        toast.success(response.data.message);
      } else {
        setLoading(false)
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false)
      toast.error("Login error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };


  const handleDigiLockerRequest = async (accessToken) => {
    try {
      const response = await axiosInstance.get("/digilocker_request", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (response.data.error_code === 200) {
        sessionStorage.setItem("digiLockerURL", response.data.data.url)
        sessionStorage.setItem("digiLockerAccessId", response.data.data.id)
        setLoading(false)
        navigate("/home");
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(response.data.message)
    }
  }

  return (
    <section className='layout'>
      <Header />
      <Container className='main-section' fluid >
        <Container className='d-flex flex-column justify-content-center align-items-center h-100' >
          <Row className="bg-white px-3 px-md-5 py-3  rounded-3 col-12 col-md-8 col-lg-6 col-xl-5 " >
            <Col className='my-5 '>
              <h3 className='mb-5 text-center digiform-text'>DigiForm</h3>
              <div className="mb-3">
                <CustomInput
                  autoFocus={true}
                  inputLabel="Username"
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  onChange={(e) => handleLoginInputs(e)}
                  value={loginInputs?.username || ""}
                  className="mb-2"
                // onBlur={() => handleBlur("username")}
                />
                {
                  error.usernameError &&
                  <p className="text-danger">{errorMessage.usernameErrorMessage}</p>
                }
              </div>

              <div className="mb-3">
                <CustomInputGroup
                  inputLabel="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onClick={() => handleShowPassword("password")}
                  showPassword={showPassword}
                  placeholder="Enter password"
                  onChange={handleLoginInputs}
                  value={loginInputs.password || ""}
                  className="mb-2"
                  // onBlur={() => handleBlur("password")}
                  onKeyDown={handleKeyDown}
                />
                {
                  error.passwordError &&
                  <p className="text-danger">{errorMessage.passwordErrorMessage}</p>
                }
              </div>
              <CustomButton
                buttonName={loading ? <CustomSpinner variant="light" size="sm" /> : "Log in"}
                className={`btn custom-button-sm mt-5 mx-auto d-block w-100 cup py-2 ${loading && 'pe-none opacity-50'}`}
                onClick={handleLogin}
              />
              <p className='mt-4 text-center'>
                Don't have an account?
                <Link to="/register" className='signup-login-navigation-link'> Register</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </Container >

      <Footer isFooterText={true} />

    </section>
  )
}

export default Login
