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
  padding: 0.75rem 1rem;
  background-color: ${(props) =>
    props.danger ? "#ef4444" : props.secondary ? "#3b82f6" : "#2563eb"};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.danger ? "#dc2626" : props.secondary ? "#2563eb" : "#1d4ed8"};
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
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
  background-color: ${(props) => props.bg || "#93c5fd"};
  color: #1e3a8a;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
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

// HOOK MEDIA QUERY
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
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAgendas = () => {
    setLoading(true);
    getAllAgendas()
      .then(setBookings)
      .catch((error) =>
        console.error("Erro ao buscar agendamentos:", error)
      )
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

  const handleNewBooking = () => setShowModal(true);
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
          <Button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            disabled={weekOffset === 0}
          >
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
            <DayTitle>{format(day, "EEEE, dd/MM", { locale: ptBR })}</DayTitle>
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
          onClose={() => setShowModal(false)}
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
