# AfyaLink - Rural Health Records System

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
- **Styling**: Tailwind CSS v4 with custom African-inspired color palette
- **Database**: Supabase (PostgreSQL) - ready to connect
- **AI Integration**: Model Context Protocol (MCP) pattern
- **Authentication**: Supabase Auth (ready to integrate)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

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

### Database Setup (Optional)

The app includes SQL scripts in the `scripts/` folder:

- `01-create-tables.sql` - Database schema
- `02-seed-data.sql` - Sample data

When ready to connect Supabase:
1. Create a Supabase project
2. Run the SQL scripts in the Supabase SQL editor
3. Add environment variables (see below)

### Environment Variables

Create a `.env.local` file:

\`\`\`env
# Supabase (when ready to connect)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MCP Server (optional)
MCP_SERVER_URL=http://localhost:3001/mcp
\`\`\`

## Project Structure

\`\`\`
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Main dashboard
│   ├── patients/[id]/     # Patient detail pages
│   ├── login/             # Authentication
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and types
│   ├── types.ts          # TypeScript interfaces
│   ├── mock-data.ts      # Demo data
│   └── mcp-client.ts     # MCP integration
└── scripts/              # Database scripts
\`\`\`

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
