// Header.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import { getUserById } from "./services/getUserById";

const HeaderWrapper = styled.header`
  background-color: #1e3a8a; /* azul petróleo */
  color: white;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 3px solid #1e40af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  //se for mobile alinha ao centro
  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
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

const Header = () => {
  const [userName, setUserName] = useState("");

  async function fetchUserToHeader() {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        console.error("User ID not found in localStorage");
        return;
      }

      const res = await getUserById(user_id);
      setUserName(res.local_name);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }

  useEffect(() => {
    fetchUserToHeader();
  }, []);

  return (
    <HeaderWrapper>
      <Title>
        {/* <FaCalendarAlt /> */}
        <img
          src="/logo-sm-remove.png"
          alt="Logo Sporting Manager"
          style={{ width: "118px" }}
        />
        {userName}
      </Title>
    </HeaderWrapper>
  );
};

export default Header;
