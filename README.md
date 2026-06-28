# Backend Explorer

An interactive backend-development learning & demonstration platform. Every card on the
dashboard represents a real backend concept (Express routing, middleware, MVC, MongoDB,
error handling...) and every button click triggers a genuine HTTP request to a genuine
Node.js/Express/MongoDB server — nothing is mocked.

```
backend-explorer/
├── server/
│   ├── server.js              # app entry point — wires everything together
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── seed.js             # optional: seeds 3 sample products
│   ├── models/                 # Mongoose schemas (the "M" in MVC)
│   │   ├── Product.js
│   │   └── User.js
│   ├── controllers/            # business logic (the "C" in MVC)
│   │   ├── productController.js
│   │   ├── authController.js
│   │   └── demoController.js
│   ├── routes/                 # Express Router definitions
│   │   ├── products.js
│   │   ├── auth.js
│   │   └── demo.js
│   └── middleware/
│       ├── logger.js
│       ├── responseTime.js
│       ├── auth.js              # JWT auth guard
│       ├── errorHandler.js      # centralized 404 + error handler
│       └── asyncHandler.js
├── public/                      # static frontend (HTML/CSS/vanilla JS)
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── app.js               # dashboard + module router
│       ├── api.js               # fetch wrapper, feeds the inspector
│       ├── inspector.js          # the persistent request/response dock
│       └── modules/              # one file per dashboard module
├── package.json
├── .env.example
└── .gitignore
```

## 1. Local setup

```bash
cd backend-explorer
npm install
cp .env.example .env
# now open .env and paste your MongoDB Atlas connection string into MONGO_URI
npm run dev      # uses nodemon, auto-restarts on file changes
# or
npm start        # plain node, for production
```

Then open **http://localhost:5000** in your browser. The Express server serves both the
API (`/api/...`) and the frontend dashboard from the same process — there's nothing else
to run.

Optional: `npm run seed` will wipe and re-populate the `products` collection with 3 sample
items, useful for a quick demo without typing data in by hand.

## 2. Environment variables

Only `MONGO_URI` is strictly required to run the app. All variables live in `.env`
(copied from `.env.example`):

| Variable     | Required | Purpose                                              |
|--------------|----------|-------------------------------------------------------|
| `MONGO_URI`  | Yes      | MongoDB Atlas connection string                       |
| `JWT_SECRET` | Yes      | Signs login tokens for the Middleware/Auth module     |
| `PORT`       | No       | Defaults to 5000                                      |
| `NODE_ENV`   | No       | `development` or `production`                         |

`.env` is already in `.gitignore` — never commit it.

## 3. Setting up MongoDB Atlas (the only manual step)

You said you only want to handle the database setup — here's exactly what to do, end to end.

1. **Create a free account** at https://www.mongodb.com/cloud/atlas/register (or log in if
   you already have one).

2. **Create a cluster.**
   - Click **"Build a Database"**.
   - Choose the **M0 Free** tier (no credit card needed).
   - Pick any cloud provider/region close to you (e.g. AWS, closest region).
   - Give the cluster a name, e.g. `backend-explorer-cluster`, and click **Create**.
   - Wait 1–3 minutes for it to provision.

3. **Create a database user.**
   - You'll be prompted under "Security Quickstart" (or go to **Database Access** in the
     left sidebar → **Add New Database User**).
   - Choose **Password** authentication. tnLfNvi4m1fPiKVo
   - Set a username (e.g. `backend_explorer_user`) and a strong password — **save this
     password somewhere**, you'll need it for the connection string.
   - Under "Database User Privileges," choose **Read and write to any database** (fine for
     this project).
   - Click **Add User**.

4. **Allow network access.**
   - Go to **Network Access** in the left sidebar → **Add IP Address**.
   - For local development, click **"Allow Access from Anywhere"** (`0.0.0.0/0`) — simplest
     option for a learning project. For production you'd normally restrict this to your
     hosting provider's IPs.
   - Click **Confirm**.

5. **Get your connection string.**
   - Go to **Database** in the left sidebar, click **Connect** on your cluster.
   - Choose **"Drivers"**, select **Node.js** and the version shown.
   - Copy the connection string — it looks like:
     ```
     mongodb+srv://<username>:<password>@backend-explorer-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with the database user credentials from step 3.

6. **Name your database.**
   - MongoDB doesn't require you to "create" a database up front — it's created
     automatically the first time data is written to it. Just add a database name into the
     connection string path, right before the `?`:
     ```
     mongodb+srv://backend_explorer_user:yourpassword@backend-explorer-cluster.xxxxx.mongodb.net/backend-explorer?retryWrites=true&w=majority
     ```
     Here, `backend-explorer` is the database name (you can call it anything — `bedb`,
     `learning-app`, etc). The `products` and `users` collections inside it will be created
     automatically the first time you add a product or register a user.

7. **Paste it into `.env`:**
   ```
   MONGO_URI=mongodb+srv://backend_explorer_user:yourpassword@backend-explorer-cluster.xxxxx.mongodb.net/backend-explorer?retryWrites=true&w=majority
   ```
   If your password contains special characters (`@`, `#`, `%`, etc.), URL-encode them
   (e.g. `@` → `%40`).

8. **Run the app.** `npm start` (or `npm run dev`). If the connection succeeds you'll see:
   ```
   [DB] MongoDB connected -> backend-explorer-cluster-shard-...mongodb.net/backend-explorer
   Backend Explorer is running
   Local:   http://localhost:5000
   ```
   If it fails, double-check: the password in the URI, that the IP allowlist includes your
   current IP (or `0.0.0.0/0`), and that the database user has read/write privileges.

That's it — everything else (server, routes, controllers, models, frontend) is already
built and wired up.

## 4. Deploying

This is a single Node.js process serving both API and static frontend, so it deploys
cleanly to Render, Railway, Fly.io, or a basic VPS:

1. Push this folder to a GitHub repo.
2. On your host of choice, create a new Web Service pointed at the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add the same environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`)
   in the host's dashboard — never paste secrets into the repo itself.
5. Make sure MongoDB Atlas's Network Access allows connections from your host (either add
   the host's static IP, or keep `0.0.0.0/0` for simplicity).

## 5. What each module demonstrates

| # | Module | Concepts |
|---|--------|----------|
| 1 | Client & Server | Request/response round trip |
| 2 | HTTP Methods | GET / POST / PUT / DELETE against a real API |
| 3 | Express Router | Splitting routes into separate files, mounting with `app.use` |
| 4 | MVC Architecture | Route → Controller → Model → DB → Response trace |
| 5 | Middleware | Logger middleware, JWT auth middleware, 401 handling |
| 6 | MongoDB | Live CRUD on a real Atlas-hosted collection |
| 7 | Request & Response | Method, body, status, timing, inspected live |
| 8 | Error Handling | 400/404/500, validation errors, centralized error handler |

Built with: Node.js, Express.js, Mongoose/MongoDB, vanilla HTML/CSS/JS.
