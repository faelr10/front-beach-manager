// PublicSchedule.js
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAllAgendas } from "./services/getAllAgendas";
import { useParams } from "react-router-dom"; // <-- Importar o hook

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
  background-color: #e0f2fe;
  color: #1e3a8a;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
`;

const PublicSchedule = () => {
  const { id } = useParams(); // <-- Pega o id da URL
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!id) return;
    getAllAgendas(id)
      .then(setBookings)
      .catch((error) => console.error("Erro ao buscar agendamentos:", error));
  }, [id]);

  const weekStart = useMemo(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    []
  );

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  return (
    <Wrapper>
      <Title>Agenda da Semana</Title>
      {days.map((day, i) => {
        const dayString = format(day, "yyyy-MM-dd");
        const dayBookings = bookings
          .filter((b) => b.date === dayString)
          .sort((a, b) => a.start_time.localeCompare(b.start_time));

        return (
          <DayCard key={i}>
            <DayTitle>{format(day, "EEEE, dd/MM", { locale: ptBR })}</DayTitle>
            {dayBookings.length > 0 ? (
              dayBookings.map((b) => (
                <BookingItem key={b.id}>
                  <strong>
                    {b.start_time} - {b.end_time}
                  </strong>
                </BookingItem>
              ))
            ) : (
              <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Nenhum horário marcado
              </p>
            )}
          </DayCard>
        );
      })}
    </Wrapper>
  );
};

export default PublicSchedule;
