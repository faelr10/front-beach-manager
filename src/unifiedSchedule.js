import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAllAgendas } from "./services/getAllAgendas";
import BookingModal from "./bookingModal";
import EditBookingModal from "./editBookingModal";
import VolleyballCourtBooking from "./agenda";

// ESTILOS
const MobileAgendaWrapper = styled.div`
  padding: 1.5rem 1rem 1rem;
  background-color: #f0f4ff;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const WeekText = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.8rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  flex: 1;
  min-width: 130px;
  padding: 0.45rem 0.75rem;
  background-color: ${(props) =>
    props.danger
      ? "#ef4444" // Sair
      : props.gray
      ? "#9ca3af" // Semana Anterior
      : "#3b82f6"}; // Azul padrão

  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #d1d5db;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const DayCard = styled.div`
  background-color: #fff;
  border-radius: 0.75rem; // menor
  padding: 0.75rem; // menos espaço
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
`;

const DayTitle = styled.h2`
  font-size: 0.95rem;
  font-weight: bold;
  margin-bottom: 0.6rem;
  color: #1f2937;
  cursor: pointer;
`;

const BookingItem = styled.div`
  background-color: ${(props) => props.bg || "#93c5fd"};
  color: #1e3a8a;
  padding: 0.4rem 0.6rem;
  margin-bottom: 0.4rem;
  border-radius: 0.5rem;
  font-size: 0.8rem; // menor fonte
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  line-height: 1.2;
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

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

// COMPONENTE PRINCIPAL
const MobileSchedule = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAgendas = () => {
    setLoading(true);
    getAllAgendas()
      .then(setBookings)
      .catch((error) => console.error("Erro ao buscar agendamentos:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => fetchAgendas(), 1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const weekStart = useMemo(
    () => startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 }),
    [weekOffset]
  );

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const generateColorById = (id) => {
    const hash = Array.from(id).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 90%)`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleNewBooking = () => {
    setSelectedDate(null);
    setShowModal(true);
  };

  const handleNewBookingWithDate = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleEditBooking = (booking) => setSelectedBooking(booking);

  if (!isMobile) return <VolleyballCourtBooking />;

  if (loading) {
    return (
      <MobileAgendaWrapper>
        <HeaderSection>
          <WeekText>
            📅 Semana de {format(weekStart, "dd/MM")} até{" "}
            {format(addDays(weekStart, 6), "dd/MM")}
          </WeekText>
        </HeaderSection>
        <Spinner />
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          Carregando agendamentos...
        </p>
      </MobileAgendaWrapper>
    );
  }

  return (
    <MobileAgendaWrapper>
      <HeaderSection>
        <WeekText>
          📅 Semana de {format(weekStart, "dd/MM")} até{" "}
          {format(addDays(weekStart, 6), "dd/MM")}
        </WeekText>

        <ButtonRow>
          <Button onClick={() => setWeekOffset((prev) => prev - 1)}>
            👈 Semana Anterior
          </Button>
          <Button onClick={() => setWeekOffset((prev) => prev + 1)}>
            👉 Próxima Semana
          </Button>
        </ButtonRow>

        <ButtonRow>
          <Button onClick={handleNewBooking} secondary>
            + Novo Agendamento
          </Button>
          <Button onClick={handleLogout} danger>
            Sair
          </Button>
        </ButtonRow>
      </HeaderSection>

      {days.map((day, i) => {
        const dayString = format(day, "yyyy-MM-dd");
        const dayBookings = bookings
          .filter((b) => b.date === dayString)
          .sort((a, b) => a.start_time.localeCompare(b.start_time));

        return (
          <DayCard key={i}>
            <DayTitle onClick={() => handleNewBookingWithDate(dayString)}>
              {format(day, "EEEE, dd/MM", { locale: ptBR })}
            </DayTitle>
            {dayBookings.length > 0 ? (
              dayBookings.map((b) => (
                <BookingItem
                  key={b.id}
                  bg={generateColorById(b.id)}
                  onClick={() => handleEditBooking(b)}
                >
                  <strong>{b.client_name}</strong> <br />
                  {b.start_time} - {b.end_time}
                </BookingItem>
              ))
            ) : (
              <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Sem agendamentos
              </p>
            )}
          </DayCard>
        );
      })}

      {showModal && (
        <BookingModal
          bookings={bookings}
          setBookings={setBookings}
          onClose={() => {
            setShowModal(false);
            setSelectedDate(null);
          }}
          initialDate={selectedDate}
        />
      )}

      {selectedBooking && (
        <EditBookingModal
          booking={selectedBooking}
          bookings={bookings}
          setBookings={setBookings}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </MobileAgendaWrapper>
  );
};

export default MobileSchedule;
