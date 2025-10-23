# PostgreSQL Setup for Dubai Estate Next.js App (Prisma)

This document outlines the steps to create a PostgreSQL database and user, configure the necessary permissions for Prisma, and connect it to the Dubai Estate Next.js application. This guide is intended for setting up the database on a new environment, such as a VPS.

**Prerequisites:**

- PostgreSQL installed on the server.
- Access to the `psql` command-line interface as a superuser (e.g., the default `postgres` user).

## Step-by-Step Guide

1.  **Access psql:**
    Connect to your PostgreSQL instance using a superuser account. You might need `sudo` depending on your server configuration.

    ```bash
    psql -U postgres
    # Or:
    # sudo -u postgres psql
    ```

    Enter the password for the `postgres` user when prompted.

2.  **Create the Database User:**
    Create the user `hamza` (or your preferred application username) with a secure password. **Replace `'your_strong_password'` with a strong, unique password for your production environment.**

    ```sql
    CREATE USER hamza WITH PASSWORD 'your_strong_password';
    ```

3.  **Create the Database:**
    Create the database named `dubai_estate`.

    ```sql
    CREATE DATABASE dubai_estate;
    ```

4.  **Grant Database Connection Privileges:**
    Allow the `hamza` user to connect to the `dubai_estate` database.

    ```sql
    GRANT ALL PRIVILEGES ON DATABASE dubai_estate TO hamza;
    ```

5.  **Grant Database Creation Privilege (for Prisma Migrate Dev):**
    Prisma needs this permission to create temporary "shadow databases" during development migrations (`prisma migrate dev`).

    ```sql
    ALTER USER hamza CREATEDB;
    ```

    _(Note: For production deployments using `prisma migrate deploy`, this step might not be strictly necessary after the initial setup, but it's often helpful during development phases even on staging servers)._

6.  **Connect to the Application Database:**
    Switch your `psql` session to operate within the `dubai_estate` database.

    ```sql
    \c dubai_estate
    ```

    You should see: `You are now connected to database "dubai_estate" as user "postgres".`

7.  **Grant Schema Permissions:**
    Give the `hamza` user the necessary permissions to use and create objects (like tables, sequences) within the default `public` schema.

    ```sql
    -- Allow user to access/use objects within the schema
    GRANT USAGE ON SCHEMA public TO hamza;

    -- Allow user to create new objects (tables, etc.) in the schema
    GRANT CREATE ON SCHEMA public TO hamza;
    ```

8.  **Set Default Privileges for Future Objects (Recommended):**
    This ensures that `hamza` automatically gets appropriate permissions on any new tables, sequences, or functions created later by Prisma migrations or other means within the `public` schema.

    ```sql
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO hamza;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO hamza;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO hamza;
    ```

9.  **Exit psql:**
    Leave the PostgreSQL command line.

    ```sql
    \q
    ```

10. **Configure `.env` File:**
    In your Next.js project directory on the server, create or edit the `.env` file. Add the `DATABASE_URL` and ensure other necessary environment variables are set correctly for production.

    ```env
    # Database connection string
    DATABASE_URL="postgresql://hamza:your_strong_password@localhost:5432/dubai_estate"

    # NextAuth configuration (adjust for production)
    NEXTAUTH_URL="https://your_production_domain.com" # Replace with your actual domain
    NEXTAUTH_SECRET="generate_a_strong_random_secret_here" # Use a tool like `openssl rand -base64 32` to generate

    # Add any other environment variables your application needs
    ```

    - Replace `your_strong_password` with the password set in Step 2.
    - Change `localhost` or `5432` if your database host or port differs.
    - **Crucially, set `NEXTAUTH_URL` to your production URL and generate a new, strong `NEXTAUTH_SECRET`.**

11. **Run Prisma Migrations:**
    Navigate to your project's root directory in the server's terminal. Deploy the database schema using Prisma Migrate.

    ```bash
    npx prisma migrate deploy
    ```

    - `migrate deploy` is the standard command for production as it applies existing migration files without needing a shadow database or generating new SQL.
    - If this is the absolute first deployment and no migrations exist yet, you might need to:
      - Generate migrations locally (`npx prisma migrate dev --name initial_setup`).
      - Commit the `prisma/migrations` folder.
      - Pull the changes on the server.
      - Then run `npx prisma migrate deploy`.

12. **Restart Your Application:**
    Ensure your Next.js application is restarted to pick up the new environment variables and database connection.

## Verification (Optional)

You can verify the connection and schema using Prisma Studio (requires Node.js/npx on the server):

```bash
npx prisma studio
```
