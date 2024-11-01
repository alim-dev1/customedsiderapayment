import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import style from "../Login/Login.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `https://edsidera-staging-7ab88110fccd.herokuapp.com/api/user/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const token = response.data.data?.token;
        const role = response.data.data?.user?.role;

        if (token && role) {
          localStorage.setItem("token", token);
          Cookies.set("loggedin", "true");
          Cookies.set("role", role);
          Cookies.set("token", token);

          if (role === "Payee") {
            router.push("/home");
          } else {
            setErrorMessage("Login Failed: Unauthorized role");
          }
        } else {
          setErrorMessage("Login failed: Invalid response");
        }
      })
      .catch((error) => {
        setErrorMessage("Login failed: Incorrect credentials");
      });
  };

  return (
    <Container className="mt-5">
      <h2 className={style.login}>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label className={style.label}>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={username}
            className={style.login}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label className={style.label}>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            className={style.login}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Button
          variant="primary"
          type="submit"
          className={`${style.btnlogin} mt-3`}
        >
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
