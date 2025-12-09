# EventHorizon (Demo)

Follow steps:
1. Start MongoDB.
2. Server:
   cd server
   npm install
   create server/.env (see example)
   npm run dev
   node src/seedUsers.js
3. Frontend:
   cd frontend
   npm install
   create frontend/.env (VITE_API_URL=http://localhost:4000)
   npm run dev

Login with demo accounts shown on login page:
- admin@eventhorizon.com / admin123
- alice@test.com / password123
- bob@test.com / passw0rd
