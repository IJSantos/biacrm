# AI Development Rules - CRM BIA

## 🚀 Tech Stack
- **Frontend**: React 18 with TypeScript and Vite for a fast development experience.
- **Styling**: Tailwind CSS for utility-first, responsive styling.
- **UI Components**: Shadcn/UI (Radix UI) for accessible and consistent interface elements.
- **Icons**: Lucide React for a clean and consistent icon set.
- **Routing**: React Router DOM v6 for client-side navigation.
- **Backend**: Node.js with Express and TypeScript.
- **Database**: Hybrid support for SQLite (dev) and PostgreSQL (prod) via a unified query interface.
- **Authentication**: JWT (JSON Web Tokens) for secure, stateless sessions.
- **Drag & Drop**: @dnd-kit for the visual Kanban pipeline.

## 🛠 Library Usage Rules
- **UI Components**: Always prioritize **Shadcn/UI** components. Do not reinvent wheels for buttons, inputs, or modals.
- **Styling**: Use **Tailwind CSS** classes exclusively. Avoid creating new `.css` files unless absolutely necessary for third-party library overrides.
- **Icons**: Use **Lucide React** for all new icons to maintain visual consistency.
- **Data Fetching**: Use the existing **Axios** instance in `frontend/src/services/api.ts` to ensure tokens are automatically attached to requests.
- **State Management**: Use **React Context API** for global state (like Auth) and local state/hooks for component-specific logic.
- **Validation**: Use **Zod** for both frontend form validation and backend API request validation.
- **Database**: Always use the `query` function from `backend/src/database/connection.ts` to maintain compatibility between SQLite and PostgreSQL.
- **Code Structure**: Keep components small (under 100 lines). Create new files for every new component in `src/components/` or `src/pages/`.