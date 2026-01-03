The Vibe-Coded but Production-Safe Constitution

Table of Contents

1. Chapter 1: Server Actions Are the Exclusive Gateway for Data Mutations
2. Chapter 2: The Client Boundary Must Be Pushed to the Leaves
3. Chapter 3: Zod Is the Immutable, End-to-End Data Contract
4. Chapter 4: Client State Is for Ephemeral Interactions, Not Server Data
5. Chapter 5: Database Migrations Mandate a Direct, Unpooled Connection
6. Chapter 6: Media Is an Offloaded, Specialized Concern
7. Chapter 7: Vercel Runtimes Are a Deliberate Architectural Choice
8. High-Impact AI Prompt Cheat Sheet (80/20)
9. Gemini CLI Workflows


--------------------------------------------------------------------------------


Chapter 1: Server Actions Are the Exclusive Gateway for Data Mutations

* How this is implemented in practice: All data creation, update, and deletion operations are encapsulated within functions marked with the 'use server' directive, invoked directly from client components.
* Why this approach is the best tradeoff: It co-locates mutation logic with the components that use it, eliminates the need for manual API endpoint creation, and avoids unnecessary network hops, simplifying the application's mental model.
* What concrete problem it solves: It eradicates the overhead, complexity, and potential for errors associated with creating, managing, and securing separate API routes for internal data mutations.

The Invariant: No Internal API Routes for Mutations

The "Server Action First" pattern is paramount in a modern Next.js 16 application. The architectural rule is absolute: data mutations initiated from the client-side of the application must be executed via Server Actions. Custom API Route Handlers (/app/api/...) are forbidden for this purpose.

Breaking this rule introduces unnecessary latency, complicates state management, requires complex absolute URL handling, and fragments the business logic across multiple files, increasing the cognitive load for developers. Since Server Components and Server Actions run securely on the server, fetching from an internal /api/ route adds an entirely superfluous network hop.

Do:

* Define Server Actions in the same file as a component or in dedicated app/actions.ts files.
* Call database logic, such as Prisma queries, directly inside Server Actions.
* Use Server Actions to handle all form submissions and client-initiated data changes.
* Utilize the updateTag() API within Server Actions to achieve "read-your-writes" semantics, ensuring the UI reflects the mutation immediately.

Don't:

* Create API routes like /api/post/create or /api/user/update that are called from client components using fetch.
* Place business logic for mutations inside Route Handlers. This logic belongs in Server Actions or dedicated service layers called by them.
* Expose internal database mutation logic through a public-facing API unless it is explicitly intended for third-party consumption.

Execution Flow: Server Action vs. API Route (Anti-Pattern)

The primary benefit of Server Actions is the streamlined execution path. An action is a direct RPC call from the client to a server-side function, bypassing the HTTP routing and handling layer required for an API route.

Data Flow: The Server Action Path (Correct)

graph TD
    A[Client Component: <form action={myAction}>] --> B{Server Action};
    B -- "Performs DB write" --> C[Prisma Client];
    C --> D[PostgreSQL];
    D --> C;
    C -- "Returns result/error" --> B;
    B -- "Returns updated state" --> A;


Control Flow: The API Route Anti-Pattern (Incorrect)

graph TD
    subgraph Client
        A[Client Component: fetch('/api/create')]
    end
    subgraph Server
        B["/api/create Route Handler"]
        C[Prisma Client]
        D[PostgreSQL]
    end
    A -- "1. Network Request" --> B;
    B -- "2. Invokes handler" --> C;
    C -- "3. DB write" --> D;
    D -- "4. DB response" --> C;
    C -- "5. Handler response" --> B;
    B -- "6. Network Response" --> A;


This diagram illustrates the "Route Handler network hop," an unnecessary and inefficient layer of abstraction that Server Actions are designed to eliminate. Breaking this rule means choosing a slower, more complex, and less maintainable architecture.

AI Leverage for This Rule

Required Tools: Gemini CLI, Antigravity, Gemini Pro

* What it is good at:
  * Refactoring: Gemini CLI is exceptionally effective at repo-wide refactors. It can be tasked to find all fetch calls to internal API routes used for mutations and convert them into Server Actions, including moving the associated business logic.
  * Generation: Given a Zod schema (see Chapter 3), AI agents in Antigravity can generate the complete Server Action, including validation logic, the Prisma query, and error handling, directly from a high-level prompt.
  * Analysis: Use Gemini Pro to reason about the data flow. A prompt like "Analyze this component and its associated API route. Explain how to refactor it to a Server Action and what the performance benefits would be" can produce a clear migration plan.
* What it is bad or dangerous at:
  * Security Logic: Never delegate the implementation of authentication or authorization checks within a Server Action to AI without rigorous manual review. The agent may not understand the full context of user roles or session validation.
  * Complex Transactions: For multi-step database transactions, AI-generated code might miss critical rollback logic or fail to handle edge cases correctly. Use AI to generate the boilerplate but manually verify the transactional integrity.
* Context to provide:
  * The complete code for the client component making the call.
  * The complete code for the API Route Handler being replaced.
  * The relevant Prisma schema models.
  * The project's conventions for error handling and state updates.


--------------------------------------------------------------------------------


Chapter 2: The Client Boundary Must Be Pushed to the Leaves

* How this is implemented in practice: Major page layouts and data-fetching components are authored as React Server Components (RSCs), which then pass data down as props to small, targeted Client Components (marked with 'use client') that handle user interactivity.
* Why this approach is the best tradeoff: It drastically reduces the amount of JavaScript shipped to the browser, leading to faster initial page loads and a quicker Time-to-Interactive (TTI), as the server handles the bulk of the rendering work.
* What concrete problem it solves: It prevents the "all-or-nothing" problem of traditional SPAs, where the entire page's JavaScript bundle must be downloaded and parsed before the page becomes interactive, which is a major performance bottleneck.

The Invariant: Server Components Own Structure and Data

In the Next.js App Router, the default is Server Components. The 'use client' directive is an explicit opt-in to client-side rendering and interactivity. The core architectural discipline is to keep this boundary as deep (or "leaf-ward") in the component tree as possible. A component should only be a Client Component if it absolutely must use client-side hooks like useState, useEffect, or handle browser events.

Breaking this rule—for example, by placing 'use client' at the top of a page or layout—negates the primary performance benefit of the App Router. It forces the entire component tree below it to be client-rendered, shipping unnecessary JavaScript to the browser and slowing down the user experience.

Do:

* Fetch data in Server Components and pass it as props.
* Create layouts, pages, and data-display components as RSCs by default.
* Isolate interactive pieces of UI (e.g., a button with a counter, a form, a dropdown menu) into their own small Client Components.
* Use the "Slots Pattern" (passing components as props, like children) to compose server and client components, allowing an RSC to manage the layout while a Client Component fills in an interactive "slot."

Don't:

* Add 'use client' to a component that does not use client-side hooks or event handlers.
* Fetch data inside a useEffect hook in a Client Component if that data can be fetched once in a parent Server Component.
* Create monolithic Client Components that handle both data display and interactivity for a large section of a page. Decompose them.

Component Tree: RSC vs. Client Component Boundaries

This diagram illustrates the proper architectural separation. The "Client Boundary" is placed only around the component that strictly requires it.

graph TD
    subgraph Server Runtime (RSC)
        A["layout.tsx (RSC)"] --> B["page.tsx (RSC)"];
        B --> C["PostFeed.tsx (RSC)<br/>Fetches posts from DB"];
        C --> D["PostCard.tsx (RSC)<br/>Displays post title, content"];
    end

    subgraph Client Runtime
        E["LikeButton.tsx (Client)<br/>'use client';<br/>Manages 'likes' with useState"]
    end

    D -- "Passes initial like count" --> E;

    style A fill:#d4edda,stroke:#155724
    style B fill:#d4edda,stroke:#155724
    style C fill:#d4edda,stroke:#155724
    style D fill:#d4edda,stroke:#155724
    style E fill:#d1ecf1,stroke:#0c5460


In this correct structure, only the LikeButton.js code is sent to the client as interactive JavaScript. The rest of the page is rendered to HTML on the server, resulting in a minimal client-side footprint. If 'use client' were placed in page.tsx, the entire page would become a client component, defeating the purpose of RSCs.

AI Leverage for This Rule

Required Tools: Antigravity, Gemini CLI, next-devtools-mcp

* What it is good at:
  * Component Analysis: Using the next.devtools.mcp package, an AI agent in Antigravity or Gemini CLI can use the next.components.tree tool to visualize the entire component tree for a given route. This allows the AI to identify components that are unnecessarily marked as 'use client'.
  * Refactoring: An agent can be prompted to perform "Component Decomposition." For example: "This component UserProfile.tsx is a Client Component but only the AvatarUploadButton needs interactivity. Refactor UserProfile.tsx into a Server Component and extract the button into its own Client Component."
  * Pattern Implementation: Agents are excellent at implementing structural patterns like the Slots Pattern to better separate server and client concerns.
* What it is bad or dangerous at:
  * Understanding Nuance: An AI might not understand the subtle reasons why a component needs to be client-side (e.g., interacting with a third-party library that requires browser APIs). It can be overly aggressive in converting components to RSCs, potentially breaking functionality.
  * State Management: When decomposing a large Client Component, the AI might struggle to correctly refactor the state management logic (useState, etc.) that was previously shared within the monolithic component. Manual verification of state flow is critical.
* Context to provide:
  * The full code of the component(s) to be analyzed or refactored.
  * The desired outcome (e.g., "minimize the client-side JavaScript for this page").
  * Explicitly mention which parts of the UI are static and which are interactive.


--------------------------------------------------------------------------------


Chapter 3: Zod Is the Immutable, End-to-End Data Contract

* How this is implemented in practice: A single Zod schema is defined for each data entity and reused for client-side form validation, Server Action input parsing, and to infer TypeScript types.
* Why this approach is the best tradeoff: It creates a single source of truth for data validation, eliminating redundant logic, preventing synchronization bugs between frontend and backend, and guaranteeing type safety at every boundary.
* What concrete problem it solves: It protects the application from malformed data at runtime, which TypeScript alone cannot do, and prevents a class of bugs where the client and server have different validation rules.

The Invariant: Trust Nothing, Validate Everything with Zod

TypeScript provides compile-time safety, but it offers zero protection at runtime. It cannot guarantee the shape of data coming from a user's form submission, an external API, or even your own database. Zod is the runtime guarantor of your data's integrity. The rule is to define a Zod schema for any data that crosses an application boundary and validate against that schema at the boundary.

Breaking this rule leads to fragile applications. Relying only on TypeScript types for data from external sources is a common anti-pattern that results in runtime errors (e.g., cannot read property 'name' of undefined) when the actual data doesn't match the expected type. It also leads to duplicated validation logic in the client and server, which inevitably drifts out of sync.

Do:

* Define Zod schemas in a shared location, like src/validations or inside a monorepo's packages/ directory.
* Use z.infer<typeof mySchema> to automatically generate TypeScript types from your schemas. This ensures your types and validation rules are never out of sync.
* Use schema.safeParse() in Server Actions to handle validation results gracefully with a discriminated union, avoiding try/catch blocks.
* Use Zod schemas to validate environment variables at build time, ensuring the application fails fast if the configuration is invalid.
* Integrate Zod with form libraries like React Hook Form for seamless client-side validation.

Don't:

* Trust incoming FormData or request bodies in Server Actions without parsing them through a Zod schema first.
* Write manual validation logic (e.g., if (!title || typeof title !== 'string')) when a Zod schema can define the contract declaratively.
* Maintain separate TypeScript interfaces and Zod schemas for the same data structure. Let Zod be the source of truth for both.

Zod Schema Flow: From Client to Database

This diagram shows Zod acting as a series of validation gates at each critical boundary in the data lifecycle, ensuring integrity from end to end.

graph TD
    A[Client Component with Form] -- "User Input" --> B{"Zod Validation (Client)<br>e.g., react-hook-form"};
    B -- "On Submit (Valid)" --> C["Server Action"];
    B -- "Invalid" --> A;
    C -- "Parses FormData" --> D{"Zod .safeParse() (Server)<br><b>First Line of Defense</b>"};
    D -- "Parse Failed" --> E["Return Error to Client"];
    D -- "Parse Succeeded (Typed Data)" --> F["Prisma .create()/.update()"];
    F -- "Write to DB" --> G[(PostgreSQL Database)];


This flow guarantees that the data passed to Prisma for a database write has been rigorously validated against the same schema used on the client, creating a robust and type-safe data pipeline.

AI Leverage for This Rule

Required Tools: Gemini Pro, Antigravity

* What it is good at:
  * Schema Generation: Gemini Pro is excellent at generating Zod schemas from various sources. You can provide it with: a TypeScript interface, a JSON object, a natural language description ("Create a Zod schema for a user with an email, a password of at least 8 characters, and an optional name"), or even a Prisma model definition.
  * Boilerplate: In Antigravity, an agent can be tasked to "add validation to this Server Action using a new Zod schema." It will create the schema file, import it into the action, and add the safeParse logic and error handling.
  * Refinement: You can ask an AI to refine existing schemas, for example, "Add a custom refinement to this schema to ensure the endDate is after the startDate."
* What it is bad or dangerous at:
  * Complex Business Logic: Do not rely on AI to generate highly complex or subtle validation rules that are core to your business logic. For instance, validation that depends on multiple, interdependent fields or requires checking against another database record should be manually written and thoroughly tested.
  * Security-Sensitive Validation: Validation for things like permissions, ownership, or access control should not be delegated to an AI. These rules are too critical to risk misinterpretation by the model.
* Context to provide:
  * For generation, provide a clear and complete description of the data structure, including data types, required vs. optional fields, and any constraints (e.g., min/max length, formats).
  * For refactoring, provide the Server Action code and the desired validation behavior.
  * The prisma/schema.prisma file if you want the Zod schema to align with the database model.


--------------------------------------------------------------------------------


Chapter 4: Client State Is for Ephemeral Interactions, Not Server Data

* How this is implemented in practice: Zustand stores are used to manage UI state that is not persisted on the server, such as the open/closed state of a modal, form input values, or theme toggles.
* Why this approach is the best tradeoff: It avoids creating a duplicate, client-side source of truth for server data, which is a primary cause of UI bugs, stale data, and complex synchronization logic.
* What concrete problem it solves: It prevents the application from displaying outdated or incorrect information to the user because the client-side cache of server data has fallen out of sync with the canonical data in the database.

The Invariant: The Server is the Single Source of Truth

A fundamental rule of modern full-stack development is that any data with a canonical source on the server (i.e., in your PostgreSQL database) must never be stored as a duplicate in a global client-side state manager like Zustand. The database is the single source of truth. The client should query for this data when needed (typically in Server Components) and treat it as read-only state.

Breaking this rule—by fetching data and storing it in a Zustand store—creates a "server-state duplication bug." You now have two sources of truth: the real data in the database and a copy on the client. This copy will inevitably become stale, leading to a cascade of problems. The UI will show incorrect information, user actions will be based on outdated data, and developers will be forced to write complex, error-prone logic to try to keep the two in sync.

Do:

* Use Zustand for true client-side state: UI toggles, uncontrolled form state, shopping cart contents before checkout, etc.
* Organize Zustand stores using a "Module Pattern," where each slice of state is in its own dedicated file for better maintainability.
* Fetch server data in Server Components and pass it down via props.
* For client components that need to re-fetch data, use Server Actions or a dedicated data-fetching library that is designed to manage server state caching (like React Query or SWR), not a global state manager.
* Use Zustand's persistence middleware carefully, only for client state that needs to survive a page refresh, and implement a hydration hook to prevent SSR/client mismatches.

Don't:

* Fetch a list of users and store them in useUserStore.setState({ users: data }).
* Store the details of a product from the database in a global Zustand store.
* Duplicate any data that is managed and persisted by your backend.

State Ownership Boundaries

The line between server and client state must be absolute. This diagram illustrates the correct ownership model.

graph TD
    subgraph OwnershipBoundary["Server-Side (Canonical Truth)"]
        A[(PostgreSQL Database)] --> B["Prisma ORM"];
        B --> C["Server Components / Server Actions"];
    end
    
    subgraph OwnershipBoundary2["Client-Side (Ephemeral State)"]
        D["Zustand Store<br/>- isModalOpen<br/>- formValues<br/>- theme"] --> E["Client Components"];
    end

    C -- "Data flows one way via Props" --> E;
    E -- "Mutations trigger Server Actions" --> C;
    
    style A fill:#d4edda,stroke:#155724
    style B fill:#d4edda,stroke:#155724
    style C fill:#d4edda,stroke:#155724
    style D fill:#d1ecf1,stroke:#0c5460
    style E fill:#d1ecf1,stroke:#0c5460


Server data flows down to the client for display. The client holds its own ephemeral UI state. When a mutation is needed, the client tells the server via a Server Action, the server updates the canonical source (the database), and the new state flows back down to the client on the next render. The Zustand store is never involved in managing the server's data.

AI Leverage for This Rule

Required Tools: Gemini CLI, Antigravity, NotebookLM

* What it is good at:
  * Identifying Anti-Patterns: Gemini CLI can be used to scan the entire repository for common anti-patterns, such as fetching data inside a useEffect and then calling useStore.setState with the result. A prompt could be: "Find all components that fetch data and then write it to a Zustand store. List the files and the lines of code."
  * Refactoring: In Antigravity, an agent can be tasked to refactor a component that incorrectly stores server data in Zustand. The goal would be to move the data fetching to a parent Server Component and have the data passed down as props.
  * Reasoning: Use NotebookLM loaded with Zustand and Next.js App Router documentation to reason about state management strategies. You can ask it questions like, "What is the recommended pattern for handling user session data in a Next.js app with Zustand to avoid hydration errors?"
* What it is bad or dangerous at:
  * Complex State Logic: AI can struggle with refactoring components that have complex, intertwined client and server state. It might incorrectly separate the logic, breaking the component's functionality.
  * Hydration Logic: Implementing SSR-safe persistence and hydration logic for Zustand requires careful handling of useEffect and checking if the component is mounted. AI-generated solutions here can often be naive and lead to hydration mismatch errors if not reviewed carefully.
* Context to provide:
  * The full code for the Zustand store module.
  * The full code for the component(s) that use the store.
  * A clear statement of which data is server state and which is client state.
  * The GEMINI.md file defining architectural principles.


--------------------------------------------------------------------------------


Chapter 5: Database Migrations Mandate a Direct, Unpooled Connection

* How this is implemented in practice: The schema.prisma file is configured with two distinct database connection strings: url for the connection-pooled runtime application and directUrl for CLI-based migration tasks.
* Why this approach is the best tradeoff: It allows the application to benefit from the performance and resilience of a serverless connection pooler at runtime, while ensuring that migration and introspection tools, which require a direct database connection, function reliably.
* What concrete problem it solves: It prevents critical CI/CD pipeline failures that occur when prisma migrate or prisma db push commands fail because the connection pooler does not support the specific SQL features (like prepared statements) that migrations require.

The Invariant: Two Paths to the Database

When using a serverless PostgreSQL provider like NeonDB with Prisma, you must acknowledge two distinct use cases for database access: high-concurrency application queries and low-concurrency management tasks. Serverless databases use external connection poolers to manage connections efficiently, which is ideal for the application at runtime. However, database management tools, including Prisma's migration engine, often need direct, privileged access that a pooler can interfere with.

The rule is non-negotiable for Prisma versions below 5.10 and remains a best practice: your Prisma schema must define both connection URLs. The url variable should contain the pooled connection string, and a separate directUrl variable should contain the direct, unpooled connection string. Prisma's CLI will automatically use directUrl for commands like migrate, db push, and introspect, while the generated Prisma Client used by your Next.js application will use the url.

Breaking this rule will lead to unpredictable and frustrating deployment failures. Your application may work perfectly in production, but your CI pipeline will fail on the migration step with cryptic errors. This forces manual interventions, creates schema drift between environments, and undermines the reliability of your automated deployment process.

Do:

* In your .env file, define both DATABASE_URL (pooled) and DIRECT_URL (unpooled).
* In schema.prisma, configure the datasource block to use both variables.
* Use npx prisma migrate dev or npx prisma db push in your development and CI environments to apply schema changes.
* Ensure your deployed application only has access to the pooled DATABASE_URL for security and performance.

Don't:

* Use a single, pooled connection string for both your application and Prisma's CLI tools.
* Run migration commands from an environment that cannot establish a direct, unpooled connection to the database.
* Disable connection pooling at the application level to make migrations work. This severely degrades runtime performance and scalability.

Prisma to NeonDB Request Lifecycle

This diagram illustrates the two separate, purpose-built connection paths required for a robust production setup.

graph TD
    subgraph Developer/CI Environment
        A["Prisma CLI<br>(e.g., `prisma migrate dev`)"]
    end
    
    subgraph Vercel Runtime
        B["Next.js Application<br>(Prisma Client)"]
    end

    subgraph schema.prisma
        C["datasource db {<br>  provider = 'postgresql'<br>  url = env('DATABASE_URL')<br>  directUrl = env('DIRECT_URL')<br>}"]
    end

    subgraph NeonDB
        D["Connection Pooler"]
        E[(PostgreSQL Instance)]
    end

    A -- "Uses `directUrl`" --> C;
    B -- "Uses `url`" --> C;
    
    C -- "For migrations (directUrl)" --> E;
    C -- "For queries (url)" --> D;
    D --> E;



This dual-path architecture is the key to balancing production performance with deployment reliability.

AI Leverage for This Rule

Required Tools: Gemini CLI, Antigravity

* What it is good at:
  * Configuration Auditing: Gemini CLI can be used to write a script that scans all schema.prisma files in a monorepo to ensure they contain both a url and a directUrl in the datasource block. This is invaluable for enforcing standards across large projects.
  * Boilerplate Generation: When initializing a new project in Antigravity, an agent can be instructed to "Set up Prisma with a NeonDB database, ensuring separate pooled and direct connection URLs are configured according to best practices." The agent can create the .env.example file and the schema.prisma with the correct structure.
  * Troubleshooting: If a migration fails in CI, you can provide the error log to Gemini Pro and ask: "Given this Prisma migration error from a NeonDB database, what is the likely cause related to connection pooling?" It can often identify the missing directUrl as the root cause.
* What it is bad or dangerous at:
  * Secret Management: Never allow an AI to generate or handle actual database connection strings. These are highly sensitive secrets. The AI should only work with environment variable names (e.g., env('DATABASE_URL')), not their values.
  * Migration Logic: Do not ask an AI to write complex database migration files (.sql). SQL migrations require a deep understanding of the data and the consequences of schema changes. AI-generated migrations can be destructive or inefficient.
* Context to provide:
  * The schema.prisma file.
  * The package.json file to check the Prisma version.
  * The name of the database provider (e.g., "NeonDB").
  * The CI/CD configuration file (e.g., cloudbuild.yaml) to show how migration commands are run.


--------------------------------------------------------------------------------


Chapter 6: Media Is an Offloaded, Specialized Concern

* How this is implemented in practice: All image and video assets are stored, optimized, and delivered via Cloudinary. The Next.js application interacts with Cloudinary for uploads and uses the next/image component with a Cloudinary loader for rendering.
* Why this approach is the best tradeoff: It decouples the complex and resource-intensive task of media management from the application server, leveraging a purpose-built, globally distributed infrastructure for optimal performance and cost-efficiency.
* What concrete problem it solves: It prevents bloated and slow server functions, high Vercel bandwidth and execution costs, poor image loading performance for users, and the need to write and maintain complex, in-house media processing logic.

The Invariant: The Application Server Does Not Handle Media Bytes

A production-grade web application must treat media asset management as a distinct and specialized service, not as a responsibility of the primary application server. The application's role is to orchestrate media operations (like uploads) and store references (URLs) to the assets, but never to process or serve the raw bytes of images or videos itself. Cloudinary is the designated service for this entire lifecycle.

Breaking this rule directly impacts both user experience and operational cost. Handling file uploads in a Vercel serverless function consumes significant memory and execution time, leading to higher costs and potential timeouts for large files. Serving images from the Next.js server instead of a dedicated image CDN like Cloudinary results in slower load times for users, especially those geographically distant from the server region, and consumes Vercel bandwidth, which could be used more efficiently for API traffic.

Do:

* Use Cloudinary for all media storage, optimization, transformation, and delivery.
* Implement file uploads on the client-side directly to Cloudinary or via a lightweight Server Action that brokers the upload request.
* Configure next/image to use the Cloudinary loader, offloading all image optimization to their service.
* Store only the Cloudinary asset URL or public ID in your PostgreSQL database, not the image data itself.
* Leverage the Cloudinary MCP (Model Context Protocol) server to allow AI agents to perform complex media operations via natural language.

Don't:

* Process multipart/form-data uploads containing large image or video files within a Vercel serverless function.
* Serve static images from the /public directory in Next.js if they are content-related (user uploads, product images, etc.). The /public folder is for application assets like logos and favicons.
* Write your own image resizing, cropping, or watermarking logic. Delegate this to Cloudinary's transformation APIs.

Cloudinary Asset Upload & Transformation Flow

This diagram shows the correct, decoupled flow for handling a user media upload, orchestrated by the Next.js backend but executed by Cloudinary.

graph TD
    A[User's Browser] -- "1. Selects image" --> B[Client Component];
    B -- "2. Invokes Server Action" --> C{Next.js Server Action};
    C -- "3. Calls MCP Client" --> D["CloudinaryMCPClient.callTool('upload', ...)"];
    D -- "4. Uploads to Cloudinary" --> E[(Cloudinary Storage & API)];
    E -- "5. Returns public_id/URL" --> D;
    D -- "6. Returns result" --> C;
    C -- "7. Stores asset URL in DB" --> F[Prisma Client];
    F --> G[(PostgreSQL)];
    C -- "8. Returns success to client" --> B;
    B -- "Renders <Image> with new URL" --> H["next/image component"];
    H -- "Requests optimized image from" --> I[Cloudinary CDN];


This architecture ensures the Vercel function in step C is extremely lightweight; it only handles logic, not heavy data transfer. The heavy lifting is done by Cloudinary's specialized infrastructure.

AI Leverage for This Rule

Required Tools: Vercel AI SDK, Cloudinary MCP Server

* What it is good at:
  * Agentic Media Management: This is a primary use case for AI. The source describes building a chat interface where a user can issue natural language commands like, "Find all images tagged 'product' in the catalog folder, make them 500px wide, and add a 'sale' watermark."
  * Dynamic Tool Usage: An AI model (like Claude), integrated via the Vercel AI SDK, can connect to a running Cloudinary MCP server. It calls listTools() to discover available operations (upload, search, transform) and then uses callTool() to execute them based on the user's request. The AI acts as the orchestrator for complex media workflows.
  * Schema Generation: The AI can dynamically generate Zod schemas for the parameters of each discovered Cloudinary tool, enabling the AI SDK to correctly structure its tool calls.
* What it is bad or dangerous at:
  * Upload Security: While the AI can orchestrate uploads, the initial security configuration (API keys, secrets, upload presets) must be done manually. Never expose your Cloudinary API secret to the client-side, and do not let an AI generate security policies without review.
  * Cost Management: An AI given free rein to perform transformations could inadvertently generate a large number of asset variations, leading to higher Cloudinary costs. Transformation rules and permissions should be constrained.
* Context to provide:
  * A running instance of the CloudinaryMCPClient class for the AI to interact with.
  * A clear system prompt instructing the AI on its role as a "Cloudinary media assistant" and informing it of the available tools.
  * The user's natural language request.


--------------------------------------------------------------------------------


Chapter 7: Vercel Runtimes Are a Deliberate Architectural Choice

* How this is implemented in practice: Functions are explicitly configured for either the Edge or Node.js runtime based on their specific requirements for latency, API compatibility, and resource consumption.
* Why this approach is the best tradeoff: It allows developers to optimize their application for both performance and functionality, using the fast, globally distributed Edge for latency-sensitive tasks and the robust Node.js runtime for complex, compatibility-dependent operations.
* What concrete problem it solves: It prevents the "one-size-fits-all" approach to serverless functions, which can lead to either high latency for global users (if everything is Node.js in a single region) or functionality limitations (if everything is forced onto the Edge).

The Invariant: The Runtime Matches the Workload

Vercel provides two distinct serverless function runtimes: Node.js and Edge. They are not interchangeable. The choice of runtime is a critical architectural decision that directly impacts performance, cost, and capability. The rule is to make a deliberate choice for each function based on its specific job.

* The Node.js Runtime: This is the workhorse. It offers full compatibility with the entire Node.js ecosystem. It's the correct choice for Server Components, Server Actions that perform database operations, and any function that relies on native Node.js APIs or packages with native dependencies.
* The Edge Runtime: This is the sprinter. Built on the V8 engine, it's designed for extreme low latency and runs physically closer to your users. It has a much smaller footprint and stricter constraints (e.g., no native Node APIs, smaller bundle size). It is the ideal choice for tasks like middleware (proxy.ts), authentication checks, and simple API routes that don't require heavy dependencies.

Breaking this rule leads to suboptimal performance and operational issues. Running database queries from the Edge is an anti-pattern that creates connection management nightmares. Conversely, running a simple redirect or A/B test logic in a Node.js function introduces unnecessary cold start latency compared to the near-instant execution of the Edge.

Do:

* Use the Node.js runtime (the default) for Server Components, Server Actions, and API routes that interact with your database or require Node.js-specific dependencies.
* Use the Edge runtime for proxy.ts (formerly middleware.ts), authentication checks, feature flag evaluation, and API routes that are lightweight and stateless.
* Deploy functions to multiple regions (for Pro/Enterprise plans) to reduce latency for a global user base.
* Be aware of runtime limits, especially the maximum duration. For long-running tasks, use background execution helpers like waitUntil or after.

Don't:

* Attempt to connect to a traditional database directly from an Edge function.
* Choose the Edge runtime for a function if it uses packages that rely on native Node.js APIs like fs or path.
* Ignore cold starts in the Node.js runtime; design your application to handle them gracefully. Vercel pre-warms containers, but latency spikes are still possible.

Vercel Runtime Decision Matrix

Feature	Node.js Runtime	Edge Runtime	Decision Guideline
Primary Use Case	Server components, data mutations, complex API logic	Middleware, A/B testing, redirects, auth checks	Match the runtime to the complexity of the task.
Cold Start	Slower (microVM isolation)	Near-instant (V8 isolate)	Use Edge for tasks where every millisecond of latency matters.
API Compatibility	Full Node.js API support	Web standards-based (e.g., fetch)	If you need a specific Node.js package or API, you must use Node.js.
Failover	Configurable via vercel.json	Automatic and global by default	Edge is inherently more resilient to regional outages.
Location	Region-first (up to 18 regions)	Global by default	Edge provides the lowest latency for a distributed user base.
Limits	Larger bundle size, longer duration	Smaller bundle size, shorter duration	Heavy computations or large dependencies require Node.js.

AI Leverage for This Rule

Required Tools: Gemini CLI, Antigravity

* What it is good at:
  * Dependency Analysis: An AI agent can analyze a function's package.json and source code to check for dependencies or API calls that are incompatible with the Edge runtime. This can be built into a CI check. Prompt: "Analyze the dependencies and API usage in this file. Is it compatible with the Vercel Edge runtime? Explain why or why not."
  * Code Generation: When asked to generate a new function, the AI can be instructed on the desired runtime. For example: "Generate a Vercel API route using the Edge runtime that reads a geolocation header and returns the country."
  * Configuration: An agent in Antigravity can modify the next.config.js or individual route configurations to explicitly set the runtime for a given function or route segment.
* What it is bad or dangerous at:
  * Performance Prediction: An AI cannot accurately predict the real-world latency or cold start performance of a function. It can reason about the theoretical differences between runtimes, but it cannot give you precise performance numbers. Performance testing must be done manually.
  * Security Configuration: Configuring advanced features like functionFailoverRegions or Secure Compute (dedicated IPs, VPNs) involves security and infrastructure decisions that should not be fully delegated to an AI.
* Context to provide:
  * The complete source code of the function to be analyzed.
  * The project's package.json file.
  * The business requirements for the function (e.g., "This needs the lowest possible latency globally" vs. "This needs to process a large file").


--------------------------------------------------------------------------------


High-Impact AI Prompt Cheat Sheet (80/20)

These prompts are designed for Gemini Pro and are structured to be used as-is, providing clear context, constraints, and expected output for common development tasks.

1. Architecture Design

Context: You are an expert cloud architect designing a full-stack Next.js 16 application on Vercel with a NeonDB serverless PostgreSQL database. The application requires user authentication, image uploads, and a public-facing blog. Constraints:

* Adhere strictly to the "Server Action First" pattern for all mutations.
* Place the client boundary as low in the component tree as possible.
* Use Zod for all data validation, end-to-end.
* Use Cloudinary for all media handling.
* Use Prisma as the ORM.
* Authentication must use a managed identity provider. Expected Output: A comprehensive architectural plan in Markdown. The plan must include:

1. A recommended file and directory structure.
2. A data model for the User, Post, and Image entities, presented as a Prisma schema.
3. A Zod schema for creating a new blog post.
4. A detailed explanation of the end-to-end flow for a user uploading a profile picture, from the client component to the database write, including the roles of Server Actions, Cloudinary, and Prisma.
5. A decision on which Vercel runtime (Edge or Node.js) to use for the blog pages vs. the image upload handling logic, with a justification for each choice.

2. Code Generation (Zod Schema from Prisma Model)

Context: I have a Prisma model defined in my schema.prisma file. I need a corresponding Zod schema for client-side and server-side validation. Constraints:

* The generated Zod schema must match the Prisma model's fields and types.
* Map Prisma types to appropriate Zod validators (e.g., String to z.string(), DateTime to z.date() or z.string().datetime(), Int to z.number().int()).
* Include .min(1) for all required string fields to prevent empty submissions.
* Make fields that are optional in Prisma (e.g., String?) optional in Zod using .optional(). Expected Output: A single TypeScript code block containing the complete Zod schema, ready to be copied into a src/validations/post.ts file.

[Prisma Model to provide]

model Post {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}


3. Refactoring (API Route to Server Action)

Context: You are a senior Next.js developer tasked with refactoring an existing API Route Handler to a modern, more efficient Server Action. Constraints:

* The business logic from the API route must be preserved exactly.
* The new Server Action must accept the same inputs and produce the same outputs or errors.
* The Server Action must use Zod for input validation using the provided schema.
* The client-side fetch call must be replaced with a direct invocation of the new Server Action. Expected Output: Two code blocks:

1. The complete code for the new Server Action (app/actions.ts).
2. The refactored client component code showing the removal of the fetch call and the new action={...} or onClick handler that calls the Server Action.

[Code to provide]

1. API Route: /pages/api/post/index.ts (Provide full file content)
2. Zod Schema: src/validations/post.ts (Provide full file content)
3. Client Component: components/CreatePostForm.tsx (Provide full file content)

4. Schema & Validation Design

Context: I need to design the data validation and database schema for a multi-tenant SaaS application's "Organization" feature. Constraints:

* An organization must have a unique slug for its URL, a non-empty name, and an associated owner (User).
* The slug must be lowercase, contain only letters, numbers, and dashes, and be between 3 and 50 characters.
* The user's role within the organization (e.g., 'OWNER', 'ADMIN', 'MEMBER') must be managed. Expected Output:

1. A schema.prisma block defining the Organization, User, and a MembersOnOrganizations join table to handle the many-to-many relationship and store the user's role.
2. A Zod schema in TypeScript for validating the creation of a new organization, including a .refine() call or regex for the custom slug validation.

5. Performance Optimization

Context: My Next.js page is loading slowly, and I suspect I have a client boundary issue. The page displays a user's dashboard with static layout elements and some interactive charts. Constraints:

* Analyze the provided component code.
* Assume data is fetched via Prisma.
* The goal is to minimize the client-side JavaScript bundle. Expected Output:

1. A clear diagnosis of the problem, explaining why the current component structure is inefficient.
2. A refactoring plan, detailing which parts of the component should be extracted into separate Server and Client Components.
3. The refactored code, split into multiple files (e.g., page.tsx (RSC), DashboardLayout.tsx (RSC), InteractiveChart.tsx (Client Component)), demonstrating the "pushing the boundary to the leaves" principle.

[Component Code to Provide] A single, large .tsx file that starts with 'use client' and contains both data fetching (useEffect) and stateful, interactive logic (useState).


--------------------------------------------------------------------------------


Gemini CLI Workflows

The Gemini CLI is a power tool for repository-wide analysis and modification. It operates best when guided by a clear plan and constrained by specific file references.

Repo-Wide Analysis: Auditing for Anti-Patterns

This workflow uses the CLI's ability to read multiple files to find architectural violations.

Goal: Find all instances where server data is incorrectly stored in a Zustand client state store.

Strategy:

1. Identify Stores: First, identify all Zustand store definitions.
2. Find Usage: Pick a state variable that looks like server data (e.g., users). Now, find where it's being set.
3. Generate Report: Consolidate the findings into a refactoring plan.

Incremental Refactors: Migrating to Cache Components

This workflow demonstrates a safe, step-by-step refactor managed through the CLI.

Goal: Convert a data-fetching function to use Next.js 16 Cache Components.

Strategy (Turn-Based Execution):

1. Initial Prompt:
  * Guardrail: The agent will propose adding 'use cache' and cacheTag('products'). Review this change.
2. Approval and Next Step:
  * Guardrail: You are verifying one atomic change at a time and controlling the agent's focus.
3. Final Action (Revalidation):

Debugging Production Issues with GEMINI.md

This workflow shows how to ground the AI in your project's specific rules to get more accurate help.

Goal: Debug why a form submission is failing validation unexpectedly.

Strategy:

1. Ground the Agent: The GEMINI.md file in your project root acts as a permanent system prompt. Start the session by referencing it.
2. Provide Runtime Context: Paste the server logs showing the validation error.
  * Guardrail: By forcing the agent to compare the schema (source of truth) with the implementation (what is running), you guide it toward finding the discrepancy (e.g., a field name mismatch, an incorrect data type coercion).
3. Request the Fix:

This structured, grounded approach prevents the AI from hallucinating generic solutions and forces it to operate within the established "constitution" of your project.
