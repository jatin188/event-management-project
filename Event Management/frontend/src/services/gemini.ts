import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const generateEventDetails = async (title: string, category: string) => {
  // Frontend calls server /api/recommendations/gemini if you implemented real call.
  try {
    const res = await axios.post(`${API}/api/recommendations/gemini`, { userInterests: [category] });
    // server returns mock 'recs' currently — this is placeholder
    return { description: `Join us for ${title} — ${category}`, schedule: [{ time: '09:00 AM', activity: 'Opening' }, { time: '11:00 AM', activity: 'Keynote' }, { time: '02:00 PM', activity: 'Networking' }]};
  } catch (e) {
    return { description: `Join us for ${title}`, schedule: [] };
  }
};
