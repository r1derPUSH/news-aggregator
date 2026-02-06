# News Aggregator

Fullstack News Aggregator built with:

## 🚀 Tech Stack

- React + TypeScript
- Vite
- TanStack Query
- TailwindCSS + shadcn/ui
- Strapi CMS
- NewsAPI

## 📌 Features

- Dynamic allowed sources from CMS
- Topic classification based on CMS keywords
- Search by title
- Filter by source
- Sort by publication date
- Article details page

## 🧠 Architecture

The CMS extends the News API by:

- managing allowed sources
- defining topic rules via keywords
- dynamically influencing frontend behavior

Frontend never hardcodes sources or topics.

## ⚙️ Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend (Strapi)

```bash

cd backend/backend
npm install
npm run develop
```

```bash
git add README.md
git commit -m "Add project README"
git push
```
