import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const getSystemInstruction = (prompt) => {

  const techInstruction = `
    You are an expert in MERN and Development. 
    You have 10 years of experience in development. 
    You always write code in a modular way, breaking the code into reusable components and following best practices. 
    You use clear comments in the code, create files as needed, and ensure compatibility with existing code. 
    You never miss edge cases and always write scalable and maintainable code while handling errors and exceptions.
  `;
  const generalInstruction = `
    You are a polite and helpful assistant who provides concise, accurate, and contextually appropriate responses to general questions.
  `;

  const techKeywords = [
    // Programming languages
    "JavaScript", "js", "TypeScript", "ts", "Python", "py", "Java", "C++", "cpp", "C#", "csharp",
    "Ruby", "rb", "PHP", "Go", "Rust", "rs", "Swift", "Kotlin", "Perl", "R",

    // Frameworks and libraries
    "React", "ReactJS", "Angular", "AngularJS", "Vue", "VueJS", "Svelte", "Next.js", "Nuxt",
    "Express", "ExpressJS", "Django", "Flask", "Spring", "Spring Boot", "Laravel", "Tailwind",
    "TailwindCSS", "Bootstrap", "jQuery", "RxJS", "Redux", "Zustand",

    // Databases
    "MongoDB", "PostgreSQL", "Postgres", "MySQL", "SQLite", "Redis", "Firebase",
    "Firestore", "Cassandra", "Elasticsearch", "Neo4j", "DynamoDB", "CockroachDB", "OracleDB",

    // Software development concepts
    "frontend", "backend", "full stack", "API", "REST", "RESTful", "GraphQL", "gql", "CRUD",
    "ORM", "MVC", "microservices", "CI/CD", "pipeline", "DevOps", "cloud", "Docker", "Kubernetes",
    "k8s", "serverless", "PaaS", "IaaS", "SaaS", "monolith", "agile", "scrum", "kanban",

    // Software qualities
    "scalable", "maintainable", "error handling", "performance", "optimization", "modular",
    "testable", "reliable", "efficient", "readable", "secure", "portable", "extensible",

    // Software engineering and design patterns
    "design pattern", "singleton", "factory", "observer", "state management", "context API",
    "strategy pattern", "builder pattern", "decorator", "facade", "repository pattern",

    // Security
    "authentication", "auth", "authorization", "OAuth", "JWT", "encryption", "secure coding",
    "SSL", "TLS", "HTTPS", "CORS", "XSS", "CSRF", "vulnerability", "penetration testing",
    "firewall", "IAM", "IAM roles", "zero trust",

    // Version control and collaboration
    "Git", "GitHub", "GH", "Bitbucket", "merge", "pull request", "PR", "branch", "repo",
    "repository", "commit", "staging", "rebase", "cherry-pick",

    // Algorithms and data structures
    "algorithm", "algo", "data structure", "ds", "array", "stack", "queue", "linked list",
    "binary tree", "btree", "graph", "hashmap", "hash table", "sorting", "searching",
    "DFS", "BFS", "recursion", "dynamic programming", "dp",

    // Testing and debugging
    "unit testing", "integration testing", "end-to-end testing", "e2e testing", "Jest",
    "Mocha", "Cypress", "debugging", "console", "error logs", "TDD", "test-driven development",
    "BDD", "behavior-driven development",

    // Other tech terms
    "Webpack", "Babel", "Vite", "ESLint", "Prettier", "WebSocket", "ws", "state management",
    "hooks", "async/await", "promise", "callback", "middleware", "route handling",
    "SSR", "server-side rendering", "CSR", "client-side rendering", "ISR",
    "incremental static regeneration", "SEO", "responsive design", "accessibility", "A11y",
    "performance tuning", "lazy loading", "code splitting", "tree shaking"
  ];



  const isTechPrompt = techKeywords.some((keyword) =>
    prompt.toLowerCase().includes(keyword.toLowerCase())
  );

  return isTechPrompt ? techInstruction : generalInstruction;
};

export const generateResult = async (prompt) => {
  try {

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt. A non-empty string is required.");
    }

    const systemInstruction = getSystemInstruction(prompt);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(prompt);

    return result?.response?.text?.() || "No content generated.";
  } catch (error) {
    console.error("Error in generateResult:", {
      message: error.message,
      status: error.status,
      stack: error.stack,
    });

    if (error.status === 500 || error.status === 503) {
      throw new Error("The service is temporarily unavailable. Please try again later.");
    } else if (error.status === 400) {
      throw new Error("Invalid request. Please check your prompt and try again.");
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};
