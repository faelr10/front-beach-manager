import React, { useState } from "react";
import styled from "styled-components";
import { login } from "./services/login";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f1f5f9;
  font-family: "Segoe UI", sans-serif;
  padding: 1rem;
`;

const Card = styled.div`
  background-color: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  transition: 0.3s;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-size: 2rem;
  color: #1e293b;
  font-weight: bold;
  margin-bottom: 1.5rem;

  img {
    width: 40px;
    height: auto;
  }
`;


const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: 0.2s ease;
  background-color: #f9fafb;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: #fff;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #1e40af;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: left;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center; /* centraliza os filhos */
  gap: 1rem;
`;

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const userData = await login(email, password);
      setError("");
      onLogin(userData);
    } catch (error) {
      setError("Email ou senha inválidos.");
    }
  };

  return (
    <Container>
      <Card>
        <Logo>
          <img
            src="/favicon.ico"
            alt="Logo Volley Manager"
            style={{ width: "102px", marginRight: "0.5rem" }}
          />
          Sporting Manager
        </Logo>
        <FormWrapper onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Entrar</Button>
        </FormWrapper>
      </Card>
    </Container>
  );
}
