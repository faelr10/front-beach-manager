import React, { useState } from "react";
import styled from "styled-components";
import { updateBookingAPI } from "./services/updateBooking";
import { deleteBookingAPI } from "./services/deleteBooking";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 450px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-family: "Segoe UI", sans-serif;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Label = styled.label`
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  height: 40px; /* <-- altura padronizada */
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
`;

const CancelButton = styled(Button)`
  background-color: #6b7280;
  color: white;

  &:hover {
    background-color: #4b5563;
  }
`;

const SaveButton = styled(Button)`
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ef4444;
  color: white;

  &:hover {
    background-color: #dc2626;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 40px; /* igual ao input */
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  background-color: white;
  box-sizing: border-box;
`;

export default function EditBookingModal({
  booking,
  bookings,
  setBookings,
  onClose,
}) {
  const [formData, setFormData] = React.useState({
    client_name: booking.client_name,
    phone: booking.phone || "", // adiciona aqui
    start_time: booking.start_time,
    end_time: booking.end_time,
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  console.log("Form Data:", formData);

  const handleSave = async () => {
    const { start_time, end_time } = formData;

    if (start_time >= end_time) {
      setError("Horário final deve ser após o horário inicial.");
      return;
    }

    const newStart = toMinutes(start_time);
    const newEnd = toMinutes(end_time);

    const hasConflict = bookings.some((b) => {
      if (b.id === booking.id || b.date !== booking.date) return false;

      const existingStart = toMinutes(b.start_time);
      const existingEnd = toMinutes(b.end_time);

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (hasConflict) {
      setError("Este horário já está ocupado. Escolha outro.");
      return;
    }

    // ✅ Só atualiza se não houver conflito
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, ...formData } : b))
    );

    setError("");
    console.log("Agendamento atualizado:", formData);

    try {
      await updateBookingAPI(booking.id, { ...booking, ...formData });
    } catch (apiError) {
      setError("Erro ao salvar na API.");
      return;
    }

    onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteBookingAPI(booking.id);

      // Remove localmente da lista
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));

      console.log("Agendamento cancelado:", booking.id);
      onClose();
    } catch (error) {
      setError("Erro ao cancelar o agendamento.");
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 23; hour++) {
      options.push(`${hour.toString().padStart(2, "0")}:00`);
      options.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const isTimeDisabled = (optionTime, isStartTime) => {
    const optionMinutes = toMinutes(optionTime);

    return bookings.some((b) => {
      if (b.id === booking.id || b.date !== booking.date) return false;

      const start = toMinutes(b.start_time);
      const end = toMinutes(b.end_time);

      return isStartTime
        ? optionMinutes >= start && optionMinutes < end
        : optionMinutes > start && optionMinutes <= end;
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Editar Agendamento</Title>
        <InputGroup>
          <Label>Cliente:</Label>
          <Input
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            placeholder="Nome do cliente"
          />
        </InputGroup>

        {/* <Label>Telefone:</Label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 11);

            const formatted = value
              .replace(/^(\d{2})(\d)/g, "($1) $2")
              .replace(/(\d{5})(\d)/, "$1-$2");

            setFormData({ ...formData, phone: formatted });
          }}
          placeholder="(00) 00000-0000"
        /> */}

        <InputGroup>
          <Label>Início:</Label>
          <Select
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
          >
            {timeOptions.map((time) => (
              <option
                key={time}
                value={time}
                disabled={isTimeDisabled(time, true)}
              >
                {time}
              </option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>Fim:</Label>
          <Select
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
          >
            {timeOptions.map((time) => (
              <option
                key={time}
                value={time}
                disabled={isTimeDisabled(time, false)}
              >
                {time}
              </option>
            ))}
          </Select>
        </InputGroup>

        {error && (
          <div
            style={{
              color: "#dc2626",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <ButtonRow>
          <DeleteButton onClick={handleDelete}>
            Cancelar Agendamento
          </DeleteButton>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <CancelButton onClick={onClose}>Fechar</CancelButton>
            <SaveButton onClick={handleSave}>Salvar</SaveButton>
          </div>
        </ButtonRow>
      </ModalContent>
    </ModalOverlay>
  );
}
