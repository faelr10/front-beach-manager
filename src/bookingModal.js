import React, { useState } from "react";
import styled from "styled-components";
import { createAgenda } from "./services/createAgenda";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  font-weight: 600;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  margin-bottom: 0.25rem;
  text-align: left;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const timeOptions = Array.from({ length: 33 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export default function BookingModal({ bookings, setBookings, onClose }) {
  const [formData, setFormData] = useState({
    client_name: "",
    phone: "",
    date: "",
    start_time: "",
    end_time: "",
    recurring: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!formData.start_time || !formData.end_time || !formData.date) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
  
    if (formData.start_time >= formData.end_time) {
      setError("Horário final deve ser após o horário inicial.");
      return;
    }
  
    if (isOverlapping()) {
      setError("Este horário já está ocupado. Escolha outro.");
      return;
    }
  
    const newBooking = {
      client_name: formData.client_name,
      date: formData.date,
      start_time: formData.start_time,
      end_time: formData.end_time,
    };
  
    setError(""); // limpa erro anterior
  
    try {
      const created = await createAgenda(newBooking);
      setBookings((prev) => [...prev, created]);
      onClose(); // agora só fecha se tudo deu certo
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
  
      if (
        error.status === 409 || // backend usando 409 Conflict
        error.body === "agenda conflict" || // plain text
        error.message === "agenda conflict"
      ) {
        setError("Este horário já está ocupado. Escolha outro.");
      } else {
        setError("Este horário já está ocupado. Atualize a página e escolha outro.");
      }
    }
  };
  

  const isOverlapping = () => {
    const { date, start_time, end_time } = formData;

    return bookings.some((booking) => {
      if (booking.date !== date) return false;

      const toMinutes = (time) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
      };

      const newStart = toMinutes(start_time);
      const newEnd = toMinutes(end_time);
      const bookedStart = toMinutes(booking.start_time);
      const bookedEnd = toMinutes(booking.end_time);

      // Verifica se há sobreposição
      return newStart < bookedEnd && newEnd > bookedStart;
    });
  };

  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const isTimeDisabled = (optionTime, isStartTime) => {
    const selectedDate = formData.date;
    const optionMinutes = toMinutes(optionTime);

    return bookings.some((booking) => {
      if (booking.date !== selectedDate) return false;

      const bookingStart = toMinutes(booking.start_time);
      const bookingEnd = toMinutes(booking.end_time);

      return isStartTime
        ? optionMinutes >= bookingStart && optionMinutes < bookingEnd
        : optionMinutes > bookingStart && optionMinutes <= bookingEnd;
    });
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Novo Agendamento</Title>

        <InputGroup>
          <Label>Cliente:</Label>
          <Input
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            placeholder="Nome do cliente"
          />
        </InputGroup>

        {/* <InputGroup>
          <Label>Telefone</Label>
          <Input
            name="phone"
            placeholder="(00) 00000-0000"
            value={formData.phone}
            onChange={handlePhoneChange}
          />
        </InputGroup> */}

        <Row>
          <InputGroup style={{ flex: 1 }}>
            <Label>Data</Label>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup style={{ flex: 1 }}>
            <Label>Início</Label>
            <Select
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {timeOptions.map((time) => (
                <option
                  key={time}
                  value={time}
                  disabled={formData.date && isTimeDisabled(time, true)}
                >
                  {time}
                </option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup style={{ flex: 1 }}>
            <Label>Fim</Label>
            <Select
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {timeOptions.map((time) => (
                <option
                  key={time}
                  value={time}
                  disabled={formData.date && isTimeDisabled(time, false)}
                >
                  {time}
                </option>
              ))}
            </Select>
          </InputGroup>
        </Row>

        {/* <CheckboxGroup>
          <input
            type="checkbox"
            id="recorrente"
            checked={formData.recurring}
            onChange={handleCheckbox}
          />
          <label htmlFor="recorrente">Recorrente - Toda semana</label>
        </CheckboxGroup> */}

        {error && (
          <div
            style={{
              color: "#dc2626",
              fontSize: "0.875rem",
              marginBottom: "1rem",
              textAlign: "left",
            }}
          >
            {error}
          </div>
        )}

        <SaveButton onClick={handleSave}>Salvar Agendamento</SaveButton>
      </Modal>
    </Overlay>
  );
}
