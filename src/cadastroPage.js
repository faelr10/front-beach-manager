import React, { useState, useEffect } from "react"; // Importe useEffect
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "./services/createUser";

// Componentes já existentes (sem alterações aqui)
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

// Ajuste no botão para lidar com o estado desabilitado
const Button = styled.button`
  width: 100%;
  background-color: ${(props) =>
    props.disabled ? "#9ca3af" : "#1e40af"}; /* Cor cinza se desabilitado */
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: ${(props) =>
    props.disabled ? "not-allowed" : "pointer"}; /* Cursor diferente */
  margin-top: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#9ca3af" : "#2563eb"}; /* Sem hover se desabilitado */
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

  // Função de validação da senha simplificada
  const validatePassword = (password) => {
    // Retorna true se a senha cumprir TODOS os requisitos, false caso contrário.
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(
      password
    );

    return (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  // useEffect para controlar o estado de `isButtonDisabled`
  useEffect(() => {
    const isPasswordValid = validatePassword(senha);

    // O botão estará habilitado apenas se todos os campos estiverem preenchidos E a senha for válida

    // Limpa o erro de senha se a senha se tornar válida
    if (isPasswordValid && error.includes("A senha deve")) {
      setError("");
    }
  }, [nome, email, senha, quadra, error]); // Dependências: re-executa sempre que esses estados mudam

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores ao tentar novo cadastro

    if (!nome || !email || !senha || !quadra) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // Se a senha não for válida, exibe a mensagem de erro genérica e interrompe
    if (!validatePassword(senha)) {
      setError(
        "A senha deve conter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."
      );
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
      setIsSuccess(true);
    } catch (apiError) {
      console.error("Erro ao cadastrar usuário:", apiError);
      setError("E-mail já cadastrado.");
    }
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
