### Introduction:

Realm Keeper is an AI assistant for writers, designers, and game masters. It allows you to create and organize articles for your worlds,
create sessions to share with your players for TTRPG campaigns, and it has an integrated AI chatbot to help you generate content that
is in line with the rest of your world lore.

### Alpha Features:

- World creation (containers to group your articles by)
- Article creation with different types available (characters, quests, settlements and more, with the ability to add custom prompt fields)
- AI quest generation (ask the chatbot in natural language to generate you a quest with different parameters)
- Integrated AI chatbot that understands natural language
- A dashboard to see all your worlds, articles, and chats in one place

### Beta Features:

- Chatbot stores previous chats
- 3 Chatbot functions:
  - Improved quest generation from trained model
  - Ask questions about your own articles to maintain consistency
  - Ask general questions to a moderately advanced LLM
- Search bar for finding articles by title or contents
- Shared sessions for playing rpgs online with friends
  - Game master can create sessions and invite players
  - All users in shared sessions can share chats and input dice command
  - All users can view the same map on the screen
- Statblock creation for D&D 5e characters

### Technologies:

- React + Vite
- Supabase postgreSQL database
- Hugging Face transformers
- Node.js with Express.js
- Netlify for deployment

### Installation:

No installation required. Access in browser directly at https://realmkeeper.netlify.app/ (the last build messed up deployment so the site is currently down)

### Development Setup:

In order to create/compile an initial build, a new developer would need to clone the repo, cd into /frontend, and run "npm install" in terminal.
Then they would need to add an environment variable with the following information before building:
PORT=5000
SUPABASE_URL=''
SUPABASE_ANON_KEY=''
AI_SERVICE_URL=''

### License:

MIT License

### Contributors:

- Rebekah Barts
- Shane Wilkinson

### Project Status:

Beta
