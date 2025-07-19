🧠 ReadLess - Smart Link Saver with Auto-Summary

ReadLess is a full-stack web application that lets users save URLs, automatically fetch their metadata (title, favicon, summary), and organize them efficiently. Built with Next.js, MongoDB, and JWT authentication, it focuses on simplicity, speed, and smart reading.


---

🚀 Features

✅ User Authentication

Register/Login with email + password

JWT stored securely in httpOnly cookies


🔖 Bookmark Management

Save a URL and get:

Page title

Favicon

Summary (via Jina AI API)


Optional: drag-and-drop reorder via orderIndex

Add tags for filtering


📑 View Bookmarks

Paginated and filterable bookmark list

Search by tag


❌ Delete Bookmark

Delete your saved bookmarks safely


🛠 Edit Bookmark

Update title, summary, tags, or order index




---

🧱 Tech Stack

Frontend

Next.js 14 (App Router)

React 18

Tailwind CSS


Backend

Next.js API routes

MongoDB + Mongoose

JWT (jsonwebtoken)

bcryptjs (for hashing passwords)

cheerio (for HTML scraping)

zod (for input validation)



---

📂 Folder Structure (Relevant)

app/
├── api/
│   ├── user/
│   │   └── route.ts         # POST: login/register
│   ├── user/me/route.ts     # GET: current user
│   ├── user/logout/route.ts # DELETE: logout
│   ├── bookmark/
│   │   └── route.ts         # GET/POST bookmarks
│   └── bookmark/[id]/
│       └── route.ts         # PATCH/DELETE bookmarks
models/
├── User.ts
├── Bookmark.ts
lib/
├── dbConnect.ts
├── auth.ts
├── authHelpers.ts
zod/
├── userSchema.ts
├── bookmarkSchema.ts


---

🧪 Validation (Zod)

All user and bookmark inputs are schema-validated before DB writes

Errors are formatted using treeifyError



---

🔐 Middleware

middleware.ts protects /api/bookmark/* routes via JWT auth.


---

🌐 API Endpoints

Method	Route	Description

POST	/api/user	Register or Login
GET	/api/user/me	Fetch current user
DELETE	/api/user/logout	Logout
POST	/api/bookmark	Save a bookmark
GET	/api/bookmark	List bookmarks (filter/paginate)
PATCH	/api/bookmark/:id	Update bookmark
DELETE	/api/bookmark/:id	Delete bookmark



---

🔗 Summary Generation

Jina AI summarization endpoint is used:

GET https://r.jina.ai/http://<encoded-url>

Backend fetches this directly (not client)

Rate limiting and error fallback are handled



---

🛠 Local Setup

# 1. Clone repo
$ git clone https://github.com/yourname/readless.git

# 2. Install deps
$ cd readless
$ npm install

# 3. Add .env.local
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret_key

# 4. Run dev server
$ npm run dev


---

💡 What I'd Do Next

Add user onboarding / tutorial

Improve drag-drop reorder UI

Add full-text search on titles/summaries

Create shareable links (public view)



---

📸 Screenshots

  


---

🧑‍💻 Author

Suraj Kumar Gupta
B.Tech CSE, REC Mainpuri


---

📃 License

MIT

