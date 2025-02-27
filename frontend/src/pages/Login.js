import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("tanmay@example.com");
  const [password, setPassword] = useState("abc");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(email, password);
    if (response.token) {
      login(response.user, response.token);
      navigate("/");
    } else {
      setError(response.error || "Invalid credentials");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4 rounded" style={{ width: "400px" }}>
        <h3 className="text-center fw-bold mb-4">Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 rounded-pill">
            Login
          </Button>
        </Form>

        <p className="text-center mt-3">
          Don't have an account? <a href="/signup" className="text-primary">Sign Up</a>
        </p>
      </Card>
    </Container>
  );
};

export default Login;
