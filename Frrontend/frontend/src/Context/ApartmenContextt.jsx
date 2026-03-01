// src/context/BookingContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const BookingProvider = ({ children }) => {
  // All real apartments from the backend
  const [apartments, setApartments]         = useState([]);
  const [apartmentsLoading, setApartmentsLoading] = useState(true);
  const [apartmentsError, setApartmentsError]     = useState('');

  // The apartment the user selected (from Apartments page or BookNow selector)
  const [selectedApartment, setSelectedApartment] = useState(null);

  // Fetch all available apartments on mount
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res  = await fetch(`${API_BASE}/apartments`);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load apartments');
        setApartments(data.data || []);
      } catch (err) {
        setApartmentsError(err.message);
      } finally {
        setApartmentsLoading(false);
      }
    };
    fetchApartments();
  }, []);

  // Check availability for a given apartment + date range
  const checkAvailability = async (apartmentId, checkInDate, checkOutDate) => {
    const res  = await fetch(`${API_BASE}/bookings/check-availability`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ apartmentId, checkInDate, checkOutDate }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not check availability');
    return data.available; // boolean
  };

  // Submit a booking — returns the created booking object
  const submitBooking = async (bookingPayload) => {
    const res  = await fetch(`${API_BASE}/bookings`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(bookingPayload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Booking failed');
    return data.data;
  };

  return (
    <BookingContext.Provider value={{
      apartments,
      apartmentsLoading,
      apartmentsError,
      selectedApartment,
      setSelectedApartment,
      checkAvailability,
      submitBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
};