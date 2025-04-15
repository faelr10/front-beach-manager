import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAllAgendas } from "./services/getAllAgendas";
import BookingModal from "./bookingModal";
import EditBookingModal from "./editBookingModal";
import VolleyballCourtBooking from "./agenda";

const MobileAgendaWrapper = styled.div`
  padding: 1rem;
  background-color: #f0f4ff;
`;

const TopButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  background-color: ${(props) => (props.danger ? "#ef4444" : "#3b82f6")};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.danger ? "#dc2626" : "#2563eb")};
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

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

const MobileSchedule = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllAgendas();
        setBookings(data);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    };
    fetch();
  }, []);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const generateColorById = (id) => {
    const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 90%)`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleNewBooking = () => {
    setShowModal(true);
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
  };

  if (!isMobile) {
    return <VolleyballCourtBooking />;
  }

  return (
    <MobileAgendaWrapper>
      <TopButtons>
        <Button onClick={handleNewBooking}>+ Novo Agendamento</Button>
        <Button danger onClick={handleLogout}>Sair</Button>
      </TopButtons>

      {days.map((day, i) => {
        const dayBookings = bookings
          .filter((b) => b.date === format(day, "yyyy-MM-dd"))
          .sort((a, b) => a.start_time.localeCompare(b.start_time));

        return (
          <DayCard key={i}>
            <DayTitle>
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
              <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Sem agendamentos</p>
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

export default MobileSchedule; // Você pode renomear isso para UnifiedSchedule se quiser combinar com o desktop