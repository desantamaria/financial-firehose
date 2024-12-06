export const mockMessages = [
  { role: "user", content: "Hello! How are you?" },
  {
    role: "assistant",
    content: "I'm doing great! How can I help you today?",
  },
  { role: "user", content: "Can you help me with React?" },
  {
    role: "assistant",
    content: "Of course! What would you like to know about React?",
  },
  {
    role: "user",
    content: "I'm struggling with state management. Should I use Redux?",
  },
  {
    role: "assistant",
    content:
      "It depends on your needs. For smaller applications, React's built-in useState and useContext might be sufficient. Redux is great for larger applications with complex state management needs. What's the size and complexity of your application?",
  },
  { role: "user", content: "It's a medium-sized e-commerce site" },
  {
    role: "assistant",
    content:
      "For an e-commerce site, Redux could be beneficial. You'll likely need to manage shopping cart state, user authentication, product filters, and order history. However, you might also want to consider alternatives like Zustand or Jotai which are lighter weight.",
  },
  { role: "user", content: "What's Zustand?" },
  {
    role: "assistant",
    content:
      "Zustand is a small, fast state-management solution. It's simpler than Redux, has a minimal API, and doesn't require as much boilerplate code. It uses hooks for state management and can be a great middle-ground solution.",
  },
  {
    role: "user",
    content: "That sounds perfect! Any good resources to learn it?",
  },
  {
    role: "assistant",
    content:
      "Yes! I recommend starting with the official Zustand documentation. They have great examples and use-cases. Also, check out their GitHub repository for practical examples. Would you like me to show you a basic Zustand store setup?",
  },
  {
    role: "assistant",
    content:
      "Zustand is a small, fast state-management solution. It's simpler than Redux, has a minimal API, and doesn't require as much boilerplate code. It uses hooks for state management and can be a great middle-ground solution.",
  },
  {
    role: "user",
    content: "That sounds perfect! Any good resources to learn it?",
  },
  {
    role: "assistant",
    content:
      "Yes! I recommend starting with the official Zustand documentation. They have great examples and use-cases. Also, check out their GitHub repository for practical examples. Would you like me to show you a basic Zustand store setup?",
  },
];
