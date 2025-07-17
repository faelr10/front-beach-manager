import { useState } from "react";
import styled from "styled-components";
import { login } from "./services/login";
import { Link } from "react-router-dom";
import { verifyStatusAccount } from "./services/verifyStatusAccount";
import { FaWhatsapp } from "react-icons/fa";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 450px;
  text-align: center;
  font-family: "Segoe UI", sans-serif;
  position: relative;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

const ModalTitle = styled.h2`
  color: #1e293b;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const ModalMessage = styled.p`
  color: #333;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: flex; /* Permite alinhar itens internos */
  align-items: center; /* Alinha o texto e o ícone verticalmente */
  justify-content: center; /* Centraliza o conteúdo horizontalmente */
  gap: 8px; /* Espaço entre o ícone e o texto */
`;

// O botão da modal agora é um Link styled-component
const WhatsAppButton = styled.a`
  background-color: #25d366; /* Verde WhatsApp */
  color: white;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  display: inline-flex; /* Permite alinhar o ícone e texto dentro do botão */
  align-items: center; /* Alinha verticalmente */
  justify-content: center; /* Centraliza o conteúdo do botão */
  gap: 8px; /* Espaço entre o ícone e o texto */
  margin-top: 10px;

  &:hover {
    background-color: #1da851;
  }
`;

function CustomModal({ message, onClose }) {
  const phoneNumber = "5531982964716";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=Ol%C3%A1%2C%20meu%20per%C3%ADodo%20de%20teste%20no%20Sporting%20Manager%20expirou%20e%20gostaria%20de%20liberar%20o%20acesso.`;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalTitle>Acesso Expirado!</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <WhatsAppButton
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          <FaWhatsapp size={20} />
          Entrar em Contato
        </WhatsAppButton>
      </ModalContent>
    </ModalOverlay>
  );
}

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
  height: 60%;
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

// --- Fim dos seus componentes styled-components ---

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showTrialExpiredModal, setShowTrialExpiredModal] = useState(false);
  const [trialExpiredMessage, setTrialExpiredMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setShowTrialExpiredModal(false);
    setTrialExpiredMessage("");

    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const userData = await login(email, password);
      const verifyAccount = await verifyStatusAccount(userData.id);

      if (verifyAccount.status !== "active" && verifyAccount.type === "trail") {
        setTrialExpiredMessage(
          "Seu período de teste expirou. Por favor, entre em contato com o suporte para liberar seu acesso."
        );
        setShowTrialExpiredModal(true);
        return;
      }

      console.log("Conta verificada:", verifyAccount);
      onLogin(userData);
    } catch (error) {
      setErrorMessage("Email ou senha inválidos.");
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
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

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

          <ButtonLink to="/cadastro">Cadastre-se</ButtonLink>
        </FormWrapper>
      </Card>

      {showTrialExpiredModal && (
        <CustomModal
          message={trialExpiredMessage}
          onClose={() => setShowTrialExpiredModal(false)}
        />
      )}
    </Container>
  );
}
