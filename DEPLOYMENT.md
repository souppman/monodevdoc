# Production Deployment Guide

This guide details how to deploy your Monorepo. You have two main options:
1.  **Hybrid (Recommended):** Railway (Backend) + Vercel (Frontend). Best for Next.js performance.
2.  **All-in-Railway:** Everything on Railway. Simpler to manage, all services in one visual graph.

## 1. Prerequisites (Common)

### Deployment Branch
You **can** use your current branch (`ryan`) or any other branch you prefer.
1.  **Push your code:** `git push origin ryan` (or your branch name).
2.  **Configure Railway/Vercel:** When importing the project, simply select `ryan` (or your chosen branch) as the **Production Branch** in the settings.
    *   *Note:* Any push to this branch will trigger a redeploy.

---

## 2. All-in-Railway Strategy (Simpler)

Deploy all 4 services (Frontend + 3 Backend) in a single Railway project.

### Step 1: Create Project & Deploy Backend
**Crucial Concept:** In Railway, you will add your `monodevdoc` repository **4 separate times** to the same project.

**How to Add a Service:**
1.  Look for the **floating toolbar** on the left side of the canvas.
2.  Click the **`+` (Plus Icon)**.
3.  Select **"GitHub Repo"** -> **"monodevdoc"**.
4.  *Alternative:* You can also **Right-Click** anywhere on the empty background grid and select "New" -> "GitHub Repo".

For *each* service below, add the repo, then configure the **Root Directory**:
1.  Click the **Service Card** (the box representing the repo you just added).
2.  Click the **"Settings"** tab at the top.
3.  Scroll down to the **"Build"** section (or "Service" section depending on the UI version).
4.  Find **"Root Directory"**.
5.  Enter the path (e.g., `/services/bff`) and click **Save** (or it autosaves).

Follow the "Backend Deployment" steps below to deploy **RAG**, **Journal**, and **BFF**.

### Step 2: Deploy Frontend on Railway
Add a 4th service for the web app.

**Service D: Web App (Next.js)**
*   **Root Directory:** `/` (Empty)
*   **Build Command:** `pnpm install && pnpm --filter web build`
*   **Start Command:** `pnpm --filter web start`
*   **Networking:** Make this service Public (Generate Domain).
*   **Environment Variables:**
    *   `BFF_URL`: The **Public Domain** of `Service C: BFF` (e.g., `https://bff-production.up.railway.app`).
    *   *Note:* Even though they are in the same project, the browser needs the *Public* URL to reach the API.

---

## 3. Hybrid Strategy (Railway + Vercel)

### Backend Deployment (Railway)

We will deploy 3 services. **CRITICAL:** For all services, leave **Root Directory** as `/` (Empty) so they can access shared workspace files.

### Service A: RAG Service (Python Docker)
*   **Root Directory:** `/` (Empty)
*   **Builder:** Click "Nixpacks" (or whatever is shown) and switch to **"Dockerfile"**.
*   **Dockerfile Path:** `/services/rag-service/Dockerfile`
*   **Environment Variables:**
    *   `PINECONE_API_KEY`: [Your Pinecone Key]
    *   `PINECONE_ENVIRONMENT`: `us-west1-gcp` (or your region)
    *   `PINECONE_INDEX_NAME`: `devdoc-index`
    *   `SUPABASE_URL`: [Your Supabase Project URL]
    *   `SUPABASE_SERVICE_KEY`: [Your Supabase Service/Secret Key]

### Service B: Journal Service (Node.js Docker)
*   **Root Directory:** `/` (Empty)
*   **Builder:** Click "Nixpacks" (or whatever is shown) and switch to **"Dockerfile"**.
*   **Dockerfile Path:** `/services/journal-service/Dockerfile`
*   **Environment Variables:**
    *   `DATABASE_URL`: [Supabase Transaction Pooler URL] (e.g., `postgres://...:6543/...`)
    *   `RAG_SERVICE_URL`: [Internal Networking URL of RAG Service] (e.g., `http://rag-service.railway.internal:8000`)
    *   `GITHUB_TOKEN`: [Your Personal Access Token]
    *   `PORT`: `3000` (Railway injects this, but good to set default)

### Service C: BFF (Node.js Nixpacks)
*   **Root Directory:** `/` (Empty)
*   **Build Command:** `pnpm install && pnpm --filter bff build`
*   **Start Command:** `pnpm --filter bff start`
*   **Environment Variables:**
    *   `JOURNAL_SERVICE_URL`: [Internal Networking URL of Journal Service]
    *   `RAG_SERVICE_URL`: [Internal Networking URL of RAG Service]
    *   `GITHUB_CLIENT_ID`: [Your GitHub OAuth Client ID]
    *   `GITHUB_CLIENT_SECRET`: [Your GitHub OAuth Secret]
    *   `JWT_SECRET`: [Generate a long random string]
    *   `NODE_ENV`: `production`

---

## 4. Frontend Deployment (Vercel Option)

If you prefer Vercel for the frontend:

*   **Import Project:** Select your GitHub Repo.
*   **Framework Preset:** Next.js
*   **Root Directory:** `apps/web` (Vercel will ask to edit this)
*   **Branch:** Select `production` in the deployment settings.
*   **Environment Variables:**
    *   `BFF_URL`: The **Public Domain** of your `Service C: BFF` from Railway (e.g., `https://bff-production.up.railway.app`).
        *   *Note:* Ensure you expose the BFF service to the public internet in Railway settings.

---

## 4. Verification

1.  **Deploy Backend First:** Get the RAG, Journal, and BFF services running.
2.  **Get BFF URL:** Copy the public domain from Railway.
3.  **Deploy Frontend:** Add `BFF_URL` to Vercel and deploy.
4.  **Test:**
    *   Log in via GitHub.
    *   Create a Journal Entry (Tests BFF -> Journal communication).
    *   Generate Docs (Tests BFF -> RAG communication).
