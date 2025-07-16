import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "./services/createUser";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 88vh;
  font-family: "Segoe UI", sans-serif;
  padding: 1rem;

  background-image: url("/fundo-quadra.png"); /* <-- Mude aqui! */
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
  max-width: 500px;
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

// Agrupe Label + Input num wrapper alinhado verticalmente
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
  background-color: #f9fafb;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
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
  transition: background-color 0.2s ease;

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
  width: 100%;
  text-align: left;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`;

const LinkBack = styled(Link)`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #1e40af;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #166534;
  font-weight: 600;
  height: 100px;
`;

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [quadra, setQuadra] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !quadra) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    const newUser = {
      name: nome,
      email: email,
      password: senha,
      local_name: quadra,
    };

    try {
      await createUser(newUser);
    } catch (error) {
      setError(error);
    }

    // Aqui pode adicionar validações extras...

    setError("");
    console.log({ nome, email, senha, quadra });
    setIsSuccess(true);
    //navigate("/login"); // <-- redireciona para /login após sucesso
  };

  if (isSuccess) {
    return (
      <Container>
        <Card>
          <SuccessMessage>Cadastro realizado com sucesso! 🎉</SuccessMessage>
          <Button onClick={() => navigate("/login")}>Ir para Login</Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Logo>
          <img src="/favicon.ico" alt="Logo" />
          Cadastro
        </Logo>
        <FormWrapper onSubmit={handleCadastro}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <InputWrapper>
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
            />
          </InputWrapper>

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
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="new-password"
            />
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="quadra">Nome da quadra</Label>
            <Input
              id="quadra"
              type="text"
              placeholder="Digite o nome da quadra"
              value={quadra}
              onChange={(e) => setQuadra(e.target.value)}
              autoComplete="off"
            />
          </InputWrapper>

          <Button type="submit">Cadastrar</Button>

          <LinkBack to="/">Já tem conta? Entrar</LinkBack>
        </FormWrapper>
      </Card>
    </Container>
  );
}
