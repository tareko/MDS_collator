# MDS Collator

This project contains a small example of an Angular frontend and an ExpressJS backend
that allows users to submit form data. The administrator can view all submitted forms
and export the collated entries to an `.xlsm` file.

## Structure
- `backend/` – Express server storing submissions in a JSON file
- `frontend/` – Minimal Angular application for entering form data

## Running the server
```
cd backend
npm install            # install dependencies
npm start              # starts the server on port 3000
```

## Running the frontend
```
cd frontend
npm install            # install Angular dependencies
npm start              # serves the application on port 4200
```

The frontend expects the backend to be running on the same machine. You can adjust the
API URLs if needed.

## Export to XLSM
The backend exposes `GET /api/export?site=SITE&date=DATE` which returns a generated
`.xlsm` file containing all forms for the given site and date.

## Running with Docker
A `docker-compose.yml` is provided to run both the backend and frontend in
containers.

Build and start the services:

```bash
docker compose up --build
```

The backend will be available on <http://localhost:3000> and the frontend on
<http://localhost:4200>.
