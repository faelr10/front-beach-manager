// Header.js
import React from "react";
import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";

const HeaderWrapper = styled.header`
  background-color: #1e3a8a; /* azul petróleo */
  color: white;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 3px solid #1e40af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1.2rem;
  }
`;

const UserInfo = styled.div`
  font-size: 0.85rem;
  opacity: 0.9;
`;

const Header = ({ userName }) => {
  return (
    <HeaderWrapper>
      <Title>
        <FaCalendarAlt />
        Beach Manager
      </Title>
      {userName && <UserInfo>👤 {userName}</UserInfo>}
    </HeaderWrapper>
  );
};

export default Header;
