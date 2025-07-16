import React, { useState } from "react";
import styled from "styled-components";
import { login } from "./services/login";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 88vh;
  font-family: "Segoe UI", sans-serif;
  padding: 1rem;
  background-image: url("/fundo-quadra.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  min-height: 98vh;
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
  height: 55%;
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

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.3rem;
  user-select: none;
`;

const Input = styled.input`
  width: 90%;
  padding: 0.75rem 1rem;
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
  align-items: center;
  gap: 0.75rem;
`;

const ButtonLink = styled(Link)`
  width: 93%; /* Já está 100% */
  color: white;
  padding: 0.75rem;
  color: #1e40af; /* Cor do texto azul */
  border: 1px solid #1e40af; /* Borda com a mesma cor do texto */

  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem; /* Ajuste aqui se precisar de mais espaço */
  transition: background 0.2s;

  &:hover {
    background-color: #1e40af;
    color: white; /* Texto branco no hover */
  }
`;

// --- Fim do novo componente ---

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
            alt="Logo Sporting Manager"
            style={{ width: "102px", marginRight: "0.5rem" }}
          />
          Sporting Manager
        </Logo>
        <FormWrapper onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <InputWrapper>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </InputWrapper>

          <Button type="submit">Entrar</Button>

          {/* Substituído o Link padrão pelo ButtonLink estilizado */}
          <ButtonLink to="/cadastro">Cadastre-se</ButtonLink>
        </FormWrapper>
      </Card>
    </Container>
  );
}
