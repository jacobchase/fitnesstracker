import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import type { TileArgs } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const API_URL = 'http://localhost:5000/lifts';

type Lift = {
  id: string;
  exercise: string;
  weight: number;
  date: string;
};

type CalendarValue = Date | Date[] | [Date | null, Date | null] | null;

function Home() {
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState('');
  const [modalExercise, setModalExercise] = useState('');
  const [modalWeight, setModalWeight] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setLifts);
  }, []);

  const handleAddLift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise || !weight || !date) return;
    const newLift = { exercise, weight: Number(weight), date };
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLift),
    });
    const data = await res.json();
    setLifts([...lifts, data]);
    setExercise('');
    setWeight('');
    setDate('');
  };

  // Modal add lift
  const handleModalAddLift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalExercise || !modalWeight || !modalDate) return;
    const newLift = { exercise: modalExercise, weight: Number(modalWeight), date: modalDate };
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLift),
    });
    const data = await res.json();
    setLifts([...lifts, data]);
    setModalOpen(false);
    setModalExercise('');
    setModalWeight('');
    setModalDate('');
  };

  // Get all dates with lifts
  const liftDates = lifts.map(lift => lift.date);

  // Lifts for the selected date
  const selectedDateStr = selectedDate ? selectedDate.toISOString().slice(0, 10) : '';
  const liftsForSelectedDate = lifts.filter(lift => lift.date === selectedDateStr);

  const handleCalendarChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value)) {
      // Handle range selection: [Date | null, Date | null]
      const firstDate = value[0];
      if (firstDate instanceof Date) {
        setSelectedDate(firstDate);
      } else {
        setSelectedDate(null);
      }
    } else {
      setSelectedDate(null);
    }
  };

  // Double click handler for calendar
  const handleCalendarDoubleClick = (value: Date) => {
    setModalDate(value.toISOString().slice(0, 10));
    setModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f7f9fa', padding: '2rem 0' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, width: 500, maxWidth: '95%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Fitness Tracker</h1>
        <form onSubmit={handleAddLift} style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            placeholder="Exercise"
            value={exercise}
            onChange={e => setExercise(e.target.value)}
            required
            style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            required
            style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
          <button type="submit" style={{ padding: '10px 0', borderRadius: 6, background: '#4fc3f7', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>Add Lift</button>
        </form>
        <h2 style={{ marginBottom: 16 }}>Calendar</h2>
        <div style={{ display: 'flex', justifyContent: 'center', background: '#f3f6fa', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <Calendar
            onChange={handleCalendarChange}
            value={selectedDate}
            tileClassName={({ date, view }: TileArgs) => {
              if (view === 'month') {
                const dateStr = date.toISOString().slice(0, 10);
                if (liftDates.includes(dateStr)) {
                  return 'has-lift';
                }
              }
              return null;
            }}
            tileContent={({ date, view, children }: TileArgs & { children?: React.ReactNode }) => {
              if (view !== 'month') return null;
              const dateStr = date.toISOString().slice(0, 10);
              const liftsForDay = lifts.filter(lift => lift.date === dateStr);
              return (
                <div
                  className="calendar-tooltip-wrapper"
                  onDoubleClick={e => {
                    e.stopPropagation();
                    handleCalendarDoubleClick(date);
                  }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {children}
                  {liftsForDay.length > 0 && (
                    <div className="calendar-tooltip">
                      <strong>Lifts:</strong>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
                        {liftsForDay.map(lift => (
                          <li key={lift.id}>{lift.exercise} - {lift.weight}kg</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
        <style>{`
          .has-lift {
            background: #b3e5fc !important;
            border-radius: 50%;
          }
          .calendar-tooltip-wrapper {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .calendar-tooltip {
            display: none;
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            color: #222;
            border: 1px solid #b3e5fc;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            padding: 8px 14px;
            z-index: 10;
            min-width: 120px;
            font-size: 13px;
            pointer-events: none;
          }
          .calendar-tooltip-wrapper:hover .calendar-tooltip {
            display: block;
          }
          /* Make all calendar days the same color (override weekends) */
          .react-calendar__month-view__days__day {
            color: #222 !important;
          }
          .react-calendar__month-view__days__day--weekend {
            color: #222 !important;
          }
          .modal-bg {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.18);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .modal {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.13);
            padding: 32px 28px 24px 28px;
            min-width: 320px;
            max-width: 90vw;
          }
          .modal input {
            width: 100%;
            margin-bottom: 16px;
            padding: 10px 12px;
            border-radius: 6px;
            border: 1px solid #ccc;
            font-size: 16px;
          }
          .modal button {
            padding: 10px 0;
            border-radius: 6px;
            background: #4fc3f7;
            color: #fff;
            font-weight: 600;
            font-size: 16px;
            border: none;
            cursor: pointer;
            width: 100%;
          }
          .modal .close-btn {
            background: none;
            color: #888;
            border: none;
            font-size: 22px;
            position: absolute;
            top: 10px;
            right: 18px;
            cursor: pointer;
          }
        `}</style>
        {modalOpen && (
          <div className="modal-bg" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
              <button className="close-btn" onClick={() => setModalOpen(false)} title="Close">×</button>
              <h2 style={{ textAlign: 'center', marginBottom: 18 }}>Add Lift</h2>
              <form onSubmit={handleModalAddLift} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <input
                  placeholder="Exercise"
                  value={modalExercise}
                  onChange={e => setModalExercise(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={modalWeight}
                  onChange={e => setModalWeight(e.target.value)}
                  required
                />
                <input
                  type="date"
                  value={modalDate}
                  readOnly
                />
                <button type="submit">Add Lift</button>
              </form>
            </div>
          </div>
        )}
        {selectedDate && (
          <div style={{ marginTop: 16, marginBottom: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Lifts on {selectedDateStr}</h3>
            {liftsForSelectedDate.length === 0 ? (
              <p style={{ color: '#888' }}>No lifts recorded.</p>
            ) : (
              <ul style={{ paddingLeft: 20 }}>
                {liftsForSelectedDate.map(lift => (
                  <li key={lift.id}>
                    {lift.exercise} - {lift.weight} kg
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <h2 style={{ marginTop: 24, marginBottom: 12 }}>All Lifts</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f3f6fa', borderRadius: 8 }}>
            <thead>
              <tr style={{ background: '#e3e8ee' }}>
                <th style={{ padding: 10, fontWeight: 600 }}>Exercise</th>
                <th style={{ padding: 10, fontWeight: 600 }}>Weight (kg)</th>
                <th style={{ padding: 10, fontWeight: 600 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {lifts.map(lift => (
                <tr key={lift.id}>
                  <td style={{ padding: 10 }}>{lift.exercise}</td>
                  <td style={{ padding: 10 }}>{lift.weight}</td>
                  <td style={{ padding: 10 }}>{lift.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home; 