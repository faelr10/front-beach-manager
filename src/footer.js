// src/Footer.js
import React from "react";
import styled from "styled-components";
import { FaEnvelope, FaGithub } from "react-icons/fa";

const FooterWrapper = styled.footer`
  background-color: #f0f4ff;
  padding: 1rem 0.5rem;
  text-align: center;
  font-size: 0.85rem;
  color: #374151;
  margin-top: auto;
  border-top: 1px solid #e5e7eb;
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  margin-top: 0.5rem;

  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  svg {
    vertical-align: middle;
    margin-right: 0.25rem;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <div>Desenvolvido por Rafael Victor Boscato</div>
      <ContactInfo>
        <a href="mailto:rafaelv.boscato@gmail.com">
          <FaEnvelope /> rafaelv.boscato@hotmail.com
        </a>
        <a href="https://github.com/faelr10" target="_blank" rel="noopener noreferrer">
          <FaGithub /> GitHub
        </a>
      </ContactInfo>
    </FooterWrapper>
  );
};

export default Footer;
