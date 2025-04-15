import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import BookingModal from "./bookingModal";
import EditBookingModal from "./editBookingModal";
import { getAllAgendas } from "./services/getAllAgendas";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f0f4ff;
  padding: 1rem;
  overflow-x: hidden;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;

  @media (max-width: 400px) {
    font-size: 1rem;
  }
`;

const NewBookingButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  min-width: 140px;
  font-size: clamp(0.85rem, 1vw, 1rem);
  &:hover {
    background-color: #2563eb;
  }
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const NavigationGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const BlueButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.45rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const GrayButton = styled.button`
  background-color: #6b7280;
  color: white;
  padding: 0.45rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover {
    background-color: #4b5563;
  }
`;

const DateRange = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  margin-top: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;

  @media (max-width: 768px) {
    display: block;
    white-space: nowrap;
    overflow-x: auto;
    padding-bottom: 1rem;
  }
`;

const GridHeader = styled.div`
  min-width: 90px;
  text-align: center;
  font-weight: 500;
  padding: 0.25rem 0;
  background-color: ${(props) => (props.isToday ? "#e0f2fe" : "transparent")};
  border-radius: ${(props) => (props.isToday ? "0.5rem" : "0")};
`;

const SubText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;

  @media (max-width: 400px) {
    font-size: 0.75rem;
  }
`;

const TimeCell = styled.div`
  height: 2rem;
  min-width: 80px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  font-size: clamp(0.75rem, 1vw, 0.875rem);
  color: #4b5563;
`;

const GridCell = styled.div`
  height: 2rem;
  position: relative;
  // Remova:
  // border-top: 1px solid #e5e7eb;
  // border-left: 1px solid #e5e7eb;
`;

const GridLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  border-top: 1px solid #e5e7eb;
  z-index: 0;
`;

const BookingBlock = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  background-color: #93c5fd;
  border-radius: 0.375rem;
  font-size: clamp(0.65rem, 1vw, 0.75rem);
  padding-left: 0.25rem;
  color: #1e3a8a;
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    filter: brightness(1.05);
  }
`;

const LogoutButton = styled(NewBookingButton)`
  background-color: #ef4444;

  &:hover {
    background-color: #dc2626;
  }
`;

export default function VolleyballCourtBooking() {
  const today = new Date();
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([
    {
      id: "",
      client_name: "",
      date: "",
      start_time: "",
      end_time: "",
    },
  ]);

  //fazer requisição para pegar as reservas
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllAgendas();
        console.log("API data:", data); // 👈 aqui
        setBookings(data);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      }
    };
    fetchBookings();
  }, []);

  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  );

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const times = Array.from({ length: 33 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const goToToday = () =>
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const goToNextWeek = () => setCurrentWeekStart((prev) => addDays(prev, 7));
  const goToPreviousWeek = () =>
    setCurrentWeekStart((prev) => addDays(prev, -7));

  const generateColorById = (id) => {
    const hash = Array.from(id).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 90%)`; // mais claro e menos saturado
  };

  const calculateBlockHeight = (booking) => {
    const [startH, startM] = booking.start_time.split(":").map(Number);
    const [endH, endM] = booking.end_time.split(":").map(Number);
    const duration = endH * 60 + endM - (startH * 60 + startM);
    return (duration / 30) * 2; // cada 30min = 2rem de altura
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // ou sessionStorage
    window.location.href = "/login"; // redireciona para a tela de login
  };

  return (
    <Container>
      <Card>
        <Header>
          <Title>Agendamentos</Title>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <NewBookingButton onClick={() => setShowModal(true)}>
              + Novo Agendamento
            </NewBookingButton>
            <LogoutButton onClick={() => handleLogout()}>Sair</LogoutButton>
          </div>
        </Header>

        <Toolbar>
          <NavigationGroup>
            <BlueButton onClick={goToToday}>Hoje</BlueButton>
            <GrayButton onClick={goToPreviousWeek}>←</GrayButton>
            <GrayButton onClick={goToNextWeek}>→</GrayButton>
          </NavigationGroup>

          <DateRange>
            {format(weekDays[0], "dd/MM", { locale: ptBR })} até{" "}
            {format(weekDays[6], "dd/MM 'de' MMMM", { locale: ptBR })}
          </DateRange>
        </Toolbar>

        <Grid>
          <div></div>
          {weekDays.map((date, idx) => (
            <GridHeader key={idx} isToday={isSameDay(date, today)}>
              <div>{format(date, "d")}</div>
              <SubText>{format(date, "EEE", { locale: ptBR })}</SubText>
            </GridHeader>
          ))}

          {times.map((label) => (
            <React.Fragment key={label}>
              <TimeCell>{label}</TimeCell>
              {weekDays.map((date, colIndex) => {
                const booking = bookings.find(
                  (b) =>
                    b.date === format(date, "yyyy-MM-dd") &&
                    b.start_time === label
                );

                return (
                  <GridCell key={colIndex}>
                    <GridLine />
                    {booking && (
                      <BookingBlock
                        style={{
                          height: `${calculateBlockHeight(booking)}rem`,
                          backgroundColor: generateColorById(booking.id),
                          zIndex: 1,
                        }}
                        title={`Cliente: ${booking.client_name}\nInício: ${booking.start_time}\nFim: ${booking.end_time}`}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        {booking.client_name}
                      </BookingBlock>
                    )}
                  </GridCell>
                );
              })}
            </React.Fragment>
          ))}
        </Grid>
      </Card>

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
    </Container>
  );
}
