# Interview Practice App

An AI-powered interview preparation tool built with Next.js and OpenAI API.

## Tools & Technologies Used

- **IDE:** VS Code
- **Framework:** Next.js (React)
- **Languages:** TypeScript, Python
- **AI Model:** OpenAI API (GPT-4o-mini)
- **Styling:** Tailwind CSS

## How I Built This

### 1. Research & Planning
Designed a split-screen interface where users can read AI responses while typing answers simultaneously.

### 2. Frontend Development
Built with Next.js and Tailwind CSS featuring:
- Split-screen layout (fixed input, scrollable output)
- Real-time AI response display
- Clean, professional UI

### 3. OpenAI Integration
- Created OpenAI API key
- Selected GPT-4o-mini model
- Implemented 5 system prompts with different techniques:
  - Zero-Shot Prompting
  - Few-Shot Learning
  - Chain-of-Thought
  - Role-Playing
  - Structured Output

### 4. OpenAI Settings Tuned
- Temperature, etc 

### 5. Security Guards Implemented
- Input validation (type checking)
- Max length limit (1000 characters)
- Prompt injection protection
- Empty input blocking

## Main Goals Achieved

---->**Technical Implementation**
- Project works as intended - users can prepare for interviews with AI coaching
- Successfully calls OpenAI API with correct parameters
- Built complete UI using Next.js frontend library

## Setup Instructions

1. Install dependencies:
```bash
   npm install
```

2. Create `.env.local` file:
```
   OPENAI_API_KEY=your-api-key-here
```

3. Run development server:
```bash
   npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## File Structure
```
my-app/
├── app/
│   ├── api/interview/route.ts    # Backend API (OpenAI calls)
│   └── page.tsx                  # Main UI component
└── .env.local                    # API key (NOT COMMITTED)
```

## Author
Layne Singh - Turing College AI Engineering Bootcamp