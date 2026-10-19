# Relay

Relay is a prototype of a cross-platform messaging app for students, remote workers, and small teams who juggle too many separate tools for chatting, calling, and taking notes. The goal is one app that brings these together, with security built in from the start.

This repository holds the first working prototype, built with React.

## Features

- **Login with two factor verification** (simulated for demo purposes)
- **Contacts list** to browse and pick conversations
- **One on one messaging** with typing indicators and sample auto replies
- **File attachments** displayed inside conversations

## Getting Started

You need [Node.js](https://nodejs.org/) installed.

```bash
git clone https://github.com/lollipop09/prof.app.git
cd prof.app
npm install
npm run dev
```

Then open the local address shown in your terminal (usually http://localhost:5173).

**Demo login:** enter any username and password. When asked for the verification code, use `246810`.

## Built With

- [React](https://react.dev/) for the user interface
- [Vite](https://vitejs.dev/) for the development server and build
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
- Git and the GitHub CLI for version control

## How It Was Built

I planned Relay using a product requirements document and MoSCoW prioritization to decide what belonged in the first version. I kept the first version focused on messaging, file sharing, contacts, and secure login, and pushed voice and video calls to a later phase to keep the scope manageable.

I used Claude as an AI coding assistant to speed up development, then reviewed, tested, and adjusted the code it produced.

## Roadmap

- [ ] Real backend with live messaging between users
- [ ] Real two factor authentication and end to end encryption
- [ ] Group chats
- [ ] Voice and video calls
- [ ] Screen sharing and annotation tools
- [ ] AI meeting notes summarizer

## Note

This is a front end prototype. Login, two factor verification, and replies are simulated, and no real messages are sent between users.

## Author

**Siddhaarth Syleswaran**
[LinkedIn](https://linkedin.com/in/sidsyleswaran)
