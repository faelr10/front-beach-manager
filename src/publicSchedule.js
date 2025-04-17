import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useParams } from "react-router-dom";
import { getAllAgendasPublic } from "./services/getAllAgendasPublic";

const Wrapper = styled.div`
  padding: 1.5rem 1rem;
  background-color: #f0f4ff;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 1.3rem;
  text-align: center;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const DayCard = styled.div`
  background-color: #fff;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DayTitle = styled.h2`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1f2937;
`;

const BookingItem = styled.div`
  background-color: #dcfce7;
  color: #065f46;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
`;

const Spinner = styled.div`
  margin: 4rem auto;
  border: 6px solid #e5e7eb;
  border-top: 6px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const PublicSchedule = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const availableSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour < 24; hour++) {
      const h = hour.toString().padStart(2, "0");
      slots.push(`${h}:00`);
    }
    return slots;
  }, []);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getAllAgendasPublic(id)
      .then(setBookings)
      .catch((error) => console.error("Erro ao buscar agendamentos:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const weekStart = useMemo(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    []
  );

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // função que verifica se o slot entra em conflito com qualquer agendamento
  const isSlotOccupied = (slotStart, dayBookings) => {
    const [startHour] = slotStart.split(":").map(Number);
    const slotStartMinutes = startHour * 60;
    const slotEndMinutes = (startHour + 1) * 60;

    return dayBookings.some((booking) => {
      const [startH, startM] = booking.start_time.split(":").map(Number);
      const [endH, endM] = booking.end_time.split(":").map(Number);
      const bookingStart = startH * 60 + startM;
      const bookingEnd = endH * 60 + endM;

      // Verifica se há interseção de intervalo
      return (
        (slotStartMinutes < bookingEnd) && (slotEndMinutes > bookingStart)
      );
    });
  };

  if (loading) {
    return (
      <Wrapper>
        <Title>Agenda da Semana</Title>
        <Spinner />
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          Carregando horários disponíveis...
        </p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>Horários Disponíveis</Title>
      {days.map((day, i) => {
        const dayString = format(day, "yyyy-MM-dd");
        const dayBookings = bookings.filter((b) => b.date === dayString);

        const freeSlots = availableSlots.filter(
          (slot) => !isSlotOccupied(slot, dayBookings)
        );

        return (
          <DayCard key={i}>
            <DayTitle>{format(day, "EEEE, dd/MM", { locale: ptBR })}</DayTitle>
            {freeSlots.length > 0 ? (
              freeSlots.map((slot) => {
                const endHour = (parseInt(slot.split(":")[0]) + 1)
                  .toString()
                  .padStart(2, "0");
                return (
                  <BookingItem key={slot}>
                    <strong>{slot} - {endHour}:00</strong>
                  </BookingItem>
                );
              })
            ) : (
              <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Nenhum horário disponível
              </p>
            )}
          </DayCard>
        );
      })}
    </Wrapper>
  );
};

export default PublicSchedule;
