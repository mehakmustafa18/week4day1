# 📋 TaskFlow — Todo App (React + TypeScript + Express)

Full-stack Todo App with TypeScript frontend (React) and backend (Express).

---

## 📁 Project Structure

```
todo-project/
├── frontend/         ← React + TypeScript
│   ├── src/
│   │   ├── App.tsx       (main component)
│   │   ├── App.css       (styling)
│   │   ├── api.ts        (axios calls)
│   │   ├── types.ts      (TypeScript interfaces)
│   │   └── index.tsx     (entry point)
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tsconfig.json
│
└── backend/          ← Express + TypeScript
    ├── src/
    │   ├── index.ts      (server + routes)
    │   └── types.ts      (TypeScript interfaces)
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 How to Run

### Step 1 — Backend Start Karo

```bash
cd todo-project/backend
npm install
npm run dev
```

✅ Server chalega: http://localhost:5000

---

### Step 2 — Frontend Start Karo (naya terminal)

```bash
cd todo-project/frontend
npm install
npm start
```

✅ App chalega: http://localhost:3000

---

## 🔌 API Endpoints

| Method | Route             | Kaam                    |
|--------|-------------------|-------------------------|
| GET    | /api/tasks        | Saari tasks return karo |
| POST   | /api/tasks        | Nayi task add karo      |
| PUT    | /api/tasks/:id    | Task complete/incomplete|
| DELETE | /api/tasks/:id    | Task delete karo        |

---

## ✅ Features

- ➕ Task add karo (validation ke saath)
- ✓ Task complete/incomplete mark karo
- ✕ Task delete karo
- 📊 Stats: Completed / Pending / Total
- 📈 Progress bar
- 🌐 Frontend → Backend Axios se connected

---

## 🧪 API Test (Postman ya curl)

```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Add task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn TypeScript"}'

# Toggle task (id=1)
curl -X PUT http://localhost:5000/api/tasks/1

# Delete task (id=1)
curl -X DELETE http://localhost:5000/api/tasks/1
```
