# Aura.com — Product Chat Demo

Simple full-stack demo that lets a frontend query a Python FastAPI backend to search product data.

## Project structure

- `backend/` — FastAPI server, product search logic, and `products.json` dataset.
- `frontend/` — Vite + React app that talks to the backend and displays product cards.

## Requirements

- Python 3.10+
- Node.js 18+ (for the frontend)

## Run the backend

1. Open a terminal and change into the backend folder:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
```

2. Install dependencies (example):

```powershell
pip install fastapi uvicorn python-dotenv google-genai
```

3. Start the API server:

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. The frontend expects the backend at `http://localhost:8000` and uses `http://localhost:5173` as the frontend origin.

## Run the frontend

1. Change into the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

2. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Notes

- The backend's dependencies are listed in `backend/pyproject.toml`.
- Product data is stored in `backend/products.json` and images are in `frontend/public/product-images/`.
- If you need environment variables, add a `.env` file in `backend/`.

## Contact

For questions or changes, open an issue or contact the project owner.
