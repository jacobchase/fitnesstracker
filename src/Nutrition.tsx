import React, { useState } from 'react';

interface FoodEntry {
  id: string;
  name: string;
  amount: number; // in grams
  caloriesPer100g: number;
  calories: number;
  date: string;
}

function Nutrition() {
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !caloriesPer100g || !date) return;
    const amt = Number(amount);
    const cal100 = Number(caloriesPer100g);
    const calories = Math.round((amt * cal100) / 100);
    setFoods([
      ...foods,
      { id: Date.now().toString(), name, amount: amt, caloriesPer100g: cal100, calories, date },
    ]);
    setName('');
    setAmount('');
    setCaloriesPer100g('');
    setDate(selectedDate);
  };

  const foodsForDate = foods.filter(f => f.date === selectedDate);
  const totalCalories = foodsForDate.reduce((sum, f) => sum + f.calories, 0);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f7f9fa', padding: '2rem 0' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, width: 500, maxWidth: '95%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Nutrition Tracker</h1>
        <form onSubmit={handleAddFood} style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            placeholder="Food name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="number"
            placeholder="Amount (g)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            min={1}
            style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="number"
            placeholder="Calories per 100g"
            value={caloriesPer100g}
            onChange={e => setCaloriesPer100g(e.target.value)}
            required
            min={1}
            style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
          <button type="submit" style={{ padding: '10px 0', borderRadius: 6, background: '#4fc3f7', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>Add Food</button>
        </form>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 500, marginRight: 12 }}>Select date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
          />
        </div>
        <h2 style={{ marginBottom: 12 }}>Foods for {selectedDate}</h2>
        <div style={{ marginBottom: 16, color: '#0288d1', fontWeight: 600, fontSize: 18 }}>
          Total Calories: {totalCalories}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f3f6fa', borderRadius: 8 }}>
            <thead>
              <tr style={{ background: '#e3e8ee' }}>
                <th style={{ padding: 10, fontWeight: 600 }}>Food</th>
                <th style={{ padding: 10, fontWeight: 600 }}>Amount (g)</th>
                <th style={{ padding: 10, fontWeight: 600 }}>Calories/100g</th>
                <th style={{ padding: 10, fontWeight: 600 }}>Calories</th>
              </tr>
            </thead>
            <tbody>
              {foodsForDate.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 10, color: '#888', textAlign: 'center' }}>No foods logged.</td>
                </tr>
              ) : (
                foodsForDate.map(food => (
                  <tr key={food.id}>
                    <td style={{ padding: 10 }}>{food.name}</td>
                    <td style={{ padding: 10 }}>{food.amount}</td>
                    <td style={{ padding: 10 }}>{food.caloriesPer100g}</td>
                    <td style={{ padding: 10 }}>{food.calories}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Nutrition; 