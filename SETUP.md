# DeoAI Platform - Setup & Deployment Guide

## Project Overview
DeoAI Platform is an AI Studio application built with React, TypeScript, and Vite. It provides a comprehensive suite of AI-powered tools for various business functions.

## Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git
- Gemini API key (from https://makersuite.google.com/app/apikey)

## Quick Start

### 1. Clone or Navigate to Repository
```bash
cd DeoAI-Platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Check TypeScript for errors
- `npm run preview` - Preview production build locally

## Project Structure

```
DeoAI-Platform/
├── components/           # React components
│   ├── Advisor.tsx
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Profile.tsx
│   ├── Sidebar.tsx
│   └── ... (other components)
├── services/            # API services
│   └── geminiService.ts
├── App.tsx              # Main application component
├── index.tsx            # React entry point
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration
└── types.ts             # TypeScript type definitions
```

## Features

- **Dashboard** - Overview and analytics
- **Advisor** - AI-powered advisory system
- **Compliance** - Compliance management tools
- **Financial Suite** - Financial analysis and tools
- **Social Manager** - Social media management
- **Profile** - User profile management

## Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist` folder with optimized production build.

### Environment Variables (Production)
Ensure the `GEMINI_API_KEY` environment variable is set in your production environment.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Vite will automatically use the next available port.

### API Key Issues
- Ensure your Gemini API key is correctly set in `.env.local`
- Check that the API key has the necessary permissions
- Verify the key hasn't expired

### Build Errors
```bash
npm install
npm run lint  # Check for TypeScript errors
npm run build # Try building again
```

## Contributing

When contributing to this project:
1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes and test them locally
3. Commit with descriptive messages
4. Push to your branch
5. Create a Pull Request

## License

[Add your license information here]

## Support

For issues or questions:
- Check the README.md for general information
- Review the component documentation
- Check Vite and React documentation
- Contact the team

---

**Last Updated:** June 7, 2026
**Repository:** https://github.com/Dackeye/DeoAI-Platform.git
