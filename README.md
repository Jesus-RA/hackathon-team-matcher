# Hackathon Team Matcher

A web application that helps developers find compatible teammates for hackathons based on their skills, positions they want to work on, and the positions that their team needs to be completed.

Visit [Hackathon Team Matcher](https://hackathon-team-matcher.vercel.app/) to try it out!

![Hackathon Team Matcher](https://raw.githubusercontent.com/Jesus-RA/hackathon-team-matcher/44237e065492a889c9523ca867e09b98c6dcdd61/public/images/app-preview.jpg "Hackathon Team Matcher")

## 🚀 Features

- Profile creation and management
- Skill and position preferences
- Team matching algorithm
- User-friendly interface

## 🛠️ Tech Stack

- Astro (Framework)
- Vue.js (Components)
- Clerk (Authentication)
- Supabase (Database)
- TypeScript (Type safety)

## 📦 Prerequisites

- Node.js (v18 or higher)
- pnpm (Node package manager)
- Clerk (Authentication)
- Supabase (Database)

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Jesus-RA/hackathon-team-matcher.git
cd hackathon-team-matcher
```

2. Install dependencies:
```bash
pnpm install
```

1. Copy the environment file and setup env variables:
```bash
cp .env.example .env
```

1. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:4321`

## 📁 Project Structure

```
src/
├── components/         # Reusable Vue components
├── layouts/            # Reusable layouts
├── pages/              # Astro page components
├── lib/                # Utility functions and shared logic
├── sections/           # Reusable Astro sections
├── stores/             # State management
├── styles/             # Global styles
├── public/             # Static assets
├── .env.example        # Environment variables example
├── astro.config.mjs    # Astro configuration
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── README.md           # Project documentation
└── LICENSE             # Project license
```

## 🛠️ Development

### Environment Variables

Create a `.env` file in the root directory  based on `.env.example` and add your configuration:

### Building for Production

```bash
pnpm build
pnpm preview
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Astro](https://astro.build/) - The modern site builder
- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Clerk](https://clerk.com/) - Authentication
- [Supabase](https://supabase.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vue Sonner](https://vue-sonner.vercel.app/) - Toast notifications