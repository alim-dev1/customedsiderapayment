import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import style from "../Login/Login.module.css";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    } else if (email == "alim@gmail.com" && password == "123") {
      router.push("/home");
    }
    console.log("Logging in with:", { email, password });
    setSuccess(true);
    setEmail("");
    setPassword("");
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
            value={email}
            className={style.login}
            onChange={(e) => setEmail(e.target.value)}
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
        <p className="mt-3">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="danger">Login Failed!</Alert>}
        </p>
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
