# AfyaLink - Healthcare Records System

##Team Members: Brian Tandikhaya Mbana, Manelisi Mehlo, Zenathi Mbenya, Mafongosi Konke

AfyaLink is an AI-powered health records management system designed specifically for rural African clinics. Built for the African Model Context Protocol (MCP) Hackathon.

## Features

- **Patient Management**: Comprehensive patient records with demographics, medical history, and visit tracking
- **Visit Recording**: Easy-to-use forms for recording patient visits, vital signs, diagnoses, and treatments
- **AI Health Summaries**: Intelligent health insights powered by MCP pattern
- **Cross-Clinic Sharing**: Secure sharing of patient records between clinics
- **Offline-First Design**: Works in low-connectivity environments
- **Mobile Responsive**: Optimized for tablets and mobile devices used in rural clinics

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend** Node.js, TypeScript
- **Styling**: Tailwind CSS v4 with custom African-inspired color palette
- **Database**: Supabase (PostgreSQL) - ready to connect
- **AI Integration**: Model Context Protocol (MCP) pattern

## Getting Started

### Prerequisites

- Node.js 18+
- npm i --force to install dependencies
- npm run dev
  

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000)


## MCP Integration

AfyaLink uses the Model Context Protocol pattern for AI health summaries:

1. **Client**: `src/lib/mcp-client.ts` - Handles MCP communication
2. **API Route**: `src/app/api/ai-summary/route.ts` - Server endpoint
3. **Component**: `src/components/ai-summary-card.tsx` - UI for summaries

The MCP pattern allows for:
- Structured health data analysis
- Context-aware AI recommendations
- Risk factor identification
- Health trend analysis

## Design System

AfyaLink uses a custom color palette inspired by African aesthetics:

- **Primary (Emerald)**: Health, growth, trust - `#10b981`
- **Accent (Orange)**: Warmth, hope, African sunset - `#f97316`
- **Neutrals**: Clean whites and grays for readability
- **Success/Warning/Error**: Standard semantic colors

## Contributing

This project was built for the African MCP Hackathon. Contributions are welcome!

## License

MIT License

## Acknowledgments

Built with love for Africa's healthcare transformation.
