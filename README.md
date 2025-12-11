# Estimate UI

Frontend application for construction cost estimation system.

## Technology Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS (Neumorphism theme)
- Tanstack Query
- Zustand (State Management)

## Prerequisites

- Node.js 20+
- npm

## Getting Started

### Running Locally

```bash
# Clone the repository
git clone https://github.com/maciejc4/estimate-ui.git
cd estimate-ui

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will start on `http://localhost:3000`.

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Building

```bash
npm run build
npm start
```

### Docker

```bash
# Build Docker image
docker build -t estimate-ui .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8080 estimate-ui
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Dashboard page
│   ├── works/           # Works management
│   ├── templates/       # Template management
│   ├── estimates/       # Estimates management
│   ├── settings/        # User settings
│   └── admin/           # Admin panel
├── components/          # React components
│   └── ui/              # UI components (Button, Card, Input)
├── lib/                 # Utilities
│   ├── api.ts           # API client
│   ├── store.ts         # Zustand store
│   └── utils.ts         # Helper functions
└── hooks/               # Custom React hooks
```

## Features

- 🔐 Authentication (JWT)
- 🔨 Works management with materials
- 📋 Renovation templates
- 📄 Estimates with PDF export
- 💰 Discount calculations
- 👤 User settings
- 👮 Admin panel

## Design

- Neumorphism / Soft UI design
- Responsive (mobile-first)
- Polish language support
- WCAG 2.1 AA accessibility

## Deployment to GCP Cloud Run

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/estimate-ui

# Deploy to Cloud Run
gcloud run deploy estimate-ui \
  --image gcr.io/PROJECT_ID/estimate-ui \
  --platform managed \
  --region europe-central2 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=https://estimate-backend-xxx.run.app
```
