# 🐳 Docker Beginner's Guide: Dubai Estate Project

Welcome to the world of Docker! Since you're new to Linux and Docker, this guide is written just for you. We'll use simple analogies to explain everything.

## 🧐 What is Docker? (The Lunchbox Analogy)

Imagine you have a **Recipe (Code)** for a sandwich.
- **Without Docker:** You have to go to your friend's kitchen (Server/OS), hope they have the right bread, knife, and ingredients (Node.js, Postgres, dependencies). If their kitchen is different from yours, the sandwich might fail!
- **With Docker:** You pack the sandwich, the ingredients, the knife, and even the *kitchen table* into a magical, sealed **Lunchbox (Container)**. Now, you can give this lunchbox to anyone, and when they open it, the sandwich is exactly perfectly prepared, every time.

**Key Concepts:**
1.  **Dockerfile (The Recipe Card):** Instructions on how to build the lunchbox.
2.  **Image (The Packed Lunchbox):** The frozen, ready-to-go state of your app.
3.  **Container (The Lunchbox Opened):** The running instance of your app.
4.  **Docker Compose (The Tray):** A tray that holds multiple lunchboxes (App, Database) together so you can eat a full meal.

---

## 🏗️ Your Project Structure

I analyzed your project `dubai-estate` and found:
- **Frontend & Backend:** It's a **Next.js** Fullstack application. (Not MERN - there is no separate Express/Mongo).
- **Database:** **PostgreSQL** (Managed by Prisma).
- **WordPress:** I saw some WordPress assets, but no active WordPress code. We will stick to the core app for now to keep things simple.

We created two files for you:
1.  `Dockerfile`: Tells Docker how to run your Next.js app.
2.  `docker-compose.yml`: Tells Docker to run both Next.js and PostgreSQL together.

---

## 🚀 How to Start (The Easy Part)

Since you are on Linux (Arch), open your terminal in the project folder and run:

### 1. Start the Environment
```bash
docker compose up
```
*   **What this does:** It reads the `docker-compose.yml`, builds your app, downloads the database, connects them, and starts everything.
*   **First time:** It might take a few minutes to download the "images" (ingredients).
*   **Success:** You will see logs scrolling. Once it stops moving fast, open **http://localhost:3000** in your browser.

### 2. Stop the Environment
Press `Ctrl + C` in the terminal.
Or, open a new terminal and run:
```bash
docker compose down
```

---

## 🕵️ Explain Like I'm 5: The Files

### The `Dockerfile`
This file is used to build your **App Container**.

```dockerfile
FROM node:20-alpine      # "Start with a lightweight Linux machine that has Node.js installed."
WORKDIR /app             # "Create a folder called /app."
COPY package*.json ./    # "Copy our dependency list (shopping list) first."
RUN npm install          # "Buy/Install all the ingredients (libraries)."
COPY . .                 # "Copy all our actual code into the folder."
EXPOSE 3000              # "Open a window (port) at number 3000 so we can see in."
CMD ["npm", "run", "dev"]# "Run the start command."
```

### The `docker-compose.yml`
This file orchestrates the whole show.

**Service: `db` (Postgres)**
- It downloads a standard PostgreSQL image.
- We set a username/password (`devuser`/`devpassword`).
- **Volumes:** `postgres_data:/var/lib/postgresql/data`.
    - *Analogy:* This is like a **safe**. Even if you throw away the lunchbox (delete container), the safe stays. Next time you start Docker, your database data is still there!

**Service: `app` (Next.js)**
- It builds your `Dockerfile`.
- **Environment:** We tell it `DATABASE_URL` is `postgresql://devuser...`.
    - *Note:* We use the hostname `db` because Docker creates a private network where containers can talk to each other by name.
- **Volumes:** `.:/app`.
    - *Analogy:* This is a **magic portal**. It connects your real folder on your laptop to the folder inside the container. When you save a file in VS Code, it instantly updates inside the container!

---

## 🛠️ Common Tasks

### "I want to install a new package!"
Since your code is synced, you can just install it on your machine, but it's better to do it inside the container to match the environment.
1.  Keep the app running.
2.  Open a new terminal.
3.  Enter the container:
    ```bash
    docker compose exec app sh
    ```
4.  Now you are "inside" the box! Run your command:
    ```bash
    npm install specific-package
    ```
5.  Type `exit` to leave.

### "I want to see my Database data"
You have **Prisma**. You can run Prisma Studio from your host machine if you have Node installed, OR run it via Docker (slightly more complex).
For now, since you exposed port `5432` in the `docker-compose.yml`, you can use any DB tool (like DBeaver) on your Arch Linux machine to connect:
- **Host:** localhost
- **Port:** 5432
- **User:** devuser
- **Password:** devpassword
- **Database:** dubai_estate_db

---

## ⚠️ Troubleshooting (The "It's Not Working" Section)

**Problem:** "Port is already allocated"
**Solution:** You might have something else running on port 3000 or 5432. Stop other Node apps or Postgres services on your machine.

**Problem:** "Database connection error"
**Solution:** Wait a few seconds. Sometimes the App starts faster than the Database. We added a `depends_on` and a command to retry, but sometimes patience is key.

**Problem:** "Permission denied"
**Solution:** On Linux, you might need to run docker with `sudo` if you haven't added your user to the docker group.
*   **Fix:** `sudo usermod -aG docker $USER` (Then log out and back in).

Enjoy your new Super-Power! 🐳