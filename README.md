# 🗓️ Event Planner

A modern full-stack Event Planning web application built with **Next.js 15**, **React 19**, **Prisma**, **PostgreSQL**, and **NextAuth.js**.

---

## ✨ Features

- 🔐 **User Authentication**: Secure authentication powered by NextAuth.js v5 and Prisma adapter.
- 📅 **Event Management**: Create, view, update, and manage public and private events.
- 📝 **RSVP System**: Interactive RSVP tracking (`GOING`, `MAYBE`, `NOT_GOING`) for events.
- 👥 **Attendee Control**: Limit maximum attendees and track current user registrations.
- 📊 **User Dashboard**: Personalized dashboard to manage hosted events and personal RSVPs.
- 🎨 **Modern UI**: Dynamic, responsive user interface styled with Tailwind CSS v4.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ORM**: PostgreSQL, [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/)
- **Validation & Utilities**: [Zod](https://zod.dev/), [date-fns](https://date-fns.org/)
- **Language**: TypeScript

---

## 🚀 ScreenShots
<img width="1920" height="902" alt="image" src="https://github.com/user-attachments/assets/0f957cd9-e6d5-4dd6-866f-7a7b59fc5987" />
<img width="1894" height="906" alt="image" src="https://github.com/user-attachments/assets/86842ddc-7a10-43bd-8f3d-130307cefd05" />
<img width="1892" height="908" alt="image" src="https://github.com/user-attachments/assets/29c2902b-c543-4aea-b62c-f12c8f3b1884" />
<img width="1897" height="898" alt="image" src="https://github.com/user-attachments/assets/e56c6d0a-e15b-45f0-80dc-156bc718fc7c" />
<img width="1900" height="894" alt="image" src="https://github.com/user-attachments/assets/1fff1bf5-eecd-47a0-891f-c0b229d1a1e3" />
<img width="1920" height="901" alt="image" src="https://github.com/user-attachments/assets/fec67bb3-2bd7-4736-a6d4-0eaa1f30a10b" />
<img width="1898" height="900" alt="image" src="https://github.com/user-attachments/assets/f068bbe7-d5e2-4aef-b569-e905ed8c8d4d" />
<img width="1898" height="883" alt="image" src="https://github.com/user-attachments/assets/dfdb2d10-8fac-494c-8b0b-ffe4b20cdc5e" />




## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: v18.x or higher
- **npm** / **yarn** / **pnpm**
- **PostgreSQL**: Local or hosted database instance (e.g., Supabase, Neon)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd event-planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/event_planner?schema=public"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run Database Migrations & Generate Prisma Client**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with Turbopack |
| `npm run build` | Generates Prisma client and builds the app for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code quality issues |

---

## 📁 Project Structure

```text
event-planner/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # Backend API routes (auth, events, rsvp)
│   ├── dashboard/        # Dashboard view
│   ├── events/           # Event creation and details pages
│   ├── login/            # Authentication pages
│   ├── globals.css       # Global CSS styles
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
├── lib/                  # Database and auth utility configurations
├── prisma/               # Prisma schema & migration scripts
│   └── schema.prisma     # Database models (User, Event, RSVP, Account)
├── public/               # Static assets
└── package.json          # Project metadata and dependencies
```

---

## ⚖️ License

Copyright (c) 2026 **Youssef Emad Kamel**. All rights reserved.  
See the [`LICENSE`](file:///f:/Coding/projects/new-projects/event-planner/LICENSE) file for more details.
