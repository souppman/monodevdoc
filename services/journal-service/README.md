# DevDoc Journal Service 

Hi! This is the **Journal Service** for DevDoc. 

Think of it as the "memory collector" of the system. Its job is to take the notes you write and the code you commit, link them together, and send them to the AI brain (RAG Service) so it can understand what you're working on.

## What it actually does
- **Saves your entries**: Stores your development journal notes in a database (Supabase).
- **Watches Git**: Listens for GitHub webhooks to know when you push code.
- **Indexes Code**: When you push, it fetches the changed code and indexes it for the AI.
- **Connects the dots**: Ensures every note is linked to a specific version of your code.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment
Copy the example config and fill in your details (like your database URL & GitHub secrets).
```bash
cp .env.example .env
```

### 3. Database Setup
We use Prisma to talk to Supabase.
```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run it!
Start the development server:
```bash
npm run dev
```
The server runs on port `3000`. 
 **Check out the API Docs**: Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing
We like our code bug-free. Run the test suite with:
```bash
npm test
```

---
*Part of the DevDoc Project.*
