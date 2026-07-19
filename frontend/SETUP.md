# Task Tracker Frontend Setup

## 1. Extract folder

Place this folder as:

```text
TASK-TRACKER/
├── backend/
├── frontend/
└── compose.yaml
```

## 2. Create environment file

```powershell
cd frontend
Copy-Item .env.example .env
```

`.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 3. Install and run

```powershell
npm install
npm run dev
```

## Main implementation pattern

- Listing and create/edit are separate files.
- TanStack Table + shadcn table.
- Client-side search, sorting, column visibility and pagination.
- Rows per page: 5, 10, 20.
- Formik + Yup forms.
- Shadcn Dialog and Select.
- SweetAlert confirmation before deletion.
- Custom AlertPopup for success/error responses.
- Status values: `TODO`, `IN_PROGRESS`, `COMPLETED`.
