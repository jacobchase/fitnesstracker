import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/lifts';

type Lift = {
  id: string;
  exercise: string;
  weight: number;
  date: string;
};

function Progress() {
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [exercise, setExercise] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setLifts(data);
        if (data.length && !exercise) {
          setExercise(data[0].exercise);
        }
      });
    // eslint-disable-next-line
  }, []);

  // Get unique exercises
  const exercises = Array.from(new Set(lifts.map(l => l.exercise)));

  // If no exercise is selected, default to the first
  useEffect(() => {
    if (!exercise && exercises.length) {
      setExercise(exercises[0]);
    }
  }, [exercises, exercise]);

  // Filter lifts by selected exercise
  const filteredLifts = lifts
    .filter(l => l.exercise === exercise)
    .sort((a, b) => a.date.localeCompare(b.date));

  const data = {
    labels: filteredLifts.map(l => l.date),
    datasets: [
      {
        label: exercise || 'Weight',
        data: filteredLifts.map(l => l.weight),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f7f9fa', padding: '2rem 0' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, width: 500, maxWidth: '95%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Progress</h1>
        <label style={{ display: 'block', marginBottom: 24, fontWeight: 500 }}>
          Exercise:
          <select
            value={exercise}
            onChange={e => setExercise(e.target.value)}
            style={{ marginLeft: 12, padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          >
            {exercises.map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </label>
        <div style={{ background: '#f3f6fa', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <Line data={data} options={{
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              x: {
                title: { display: true, text: 'Date', font: { size: 16 } },
                grid: { display: false },
              },
              y: {
                title: { display: true, text: 'Weight (kg)', font: { size: 16 } },
                grid: { color: '#e3e8ee' },
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          }} height={300} />
        </div>
      </div>
    </div>
  );
}

export default Progress; 