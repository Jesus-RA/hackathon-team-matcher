# Hackathon Team Matcher

A web application that helps participants find compatible teammates for hackathons based on their skills, interests, and preferences.

Visit [Hackathon Team Matcher](https://hackathon-team-matcher.vercel.app/) to try it out!

## 🚀 Features

- Profile creation and management
- Skill and technology preferences
- Team matching algorithm
- User-friendly interface
- Real-time updates

## 🛠️ Tech Stack

- Astro (Framework)
- Vue.js (Components)
- PostgreSQL (Database)
- TypeScript (Type safety)

## 📦 Prerequisites

- Node.js (v18 or higher)
- pnpm (Node package manager)
- PostgreSQL (Database)

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hackathon-team-matcher.git
cd hackathon-team-matcher
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy the environment file and configure it:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:4321`

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
├── pages/              # Astro page components
├── lib/                # Utility functions and shared logic
├── sections/           # Reusable Astro sections
├── stores/             # State management
└── types/              # TypeScript type definitions
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