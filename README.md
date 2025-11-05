# AfyaLink - Healthcare Records System

##Video presentation link: https://www.canva.com/design/DAG3vjTLfD0/n6mubqMiEKqfGxx4PhjoZg/watch?utm_content=DAG3vjTLfD0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h01f05f1e91

##Team Members: Brian Tandikhaya Mbana, Manelisi Mehlo, Zenathi Mbenya, Mafongosi Sibongakonke

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
- **AI Integration**: Model Context Protocol (MCP) pattern
- **Database: Local file that acts as a database. (src/Data)

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

##API keys:
AUTH_SECRET="adSQVI4xyH/D5ScaZ4qEBllDQH/Q4gAqt6nr95UrW7M=" # Added by `npx auth`. Read more: https://cli.authjs.dev
ANTHROPIC_API_KEY=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
## MCP Integration
MCP server location: src/server
MCP client: src/client



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
