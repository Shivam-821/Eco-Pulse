# Eco-Pulse: Feature Roadmap & Real-World Enhancement Analysis

> **Based on a full read of** [SYSTEM_DOCUMENTATION.md](file:///home/rajshivam/code/Web_Development/FullStack/Express_React/Eco-Pulse/backend/SYSTEM_DOCUMENTATION.md)

---

## 🔍 Current System Gaps (Honest Assessment)

Before proposing features, here are the real gaps in the current architecture that need filling:

| Gap | Impact |
|-----|--------|
| `completedPicture` is saved but never AI-verified — a team can upload *any* random image | Fraud / Gaming |
| `sendOTP` job is **commented out** — OTP auth flow is incomplete | Security risk |
| No rate limiting on dump registration — one user can spam the system | Abuse vector |
| `Recycle` model has no `collectedBy` or team assignment — pickup is blind | Operational gap |
| Complaints have no SLA / escalation — they can rot forever at `resolved: false` | User trust |
| `Event` and `Task` models exist in `/models` but have **zero controllers or routes** | Dead code |
| `nearbyBin.controller.js` is 112 bytes (stub) — SmartBin API is incomplete | Incomplete feature |
| No audit trail — who assigned what, when, and at what distance is not logged | Accountability |

---

## 🚀 Proposed New Features (Categorized by Real-World Impact)

---

### 🟥 TIER 1 — Critical / High Real-World Value

---

#### 1. 🔐 OTP-Based Phone Verification (Complete the Stub)

**Problem it solves:** Currently `sendOTP` job is commented out. Phone numbers are stored but never verified. A user can register with someone else's phone number — a huge trust and SMS-spam issue.

**What to build:**
- Activate the existing `sendOTP` BullMQ job type
- Add `phoneVerified: Boolean` field to `User` model
- Add `otpCode` + `otpExpiry` fields (store hashed OTP, 10-min expiry)
- New endpoints: `POST /auth/user/send-otp` → `POST /auth/user/verify-otp`
- Dump registration blocked until phone is verified

**Architecture impact:**
```
User registers → OTP queued via BullMQ → Twilio delivers → User verifies → 
phoneVerified = true → Can now report dumps
```

**Real-world value:** Prevents fake accounts, reduces SMS spam abuse, creates trusted citizen network

---

#### 2. 🤖 AI Completion Verification (Prevent Fraud on Task Completion)

**Problem it solves:** A cleaning team can upload *any* image (e.g., a photo from Google Images) and mark a dump as cleaned. `completedPicture` is never AI-validated — this is a massive accountability gap.

**What to build:**
- After `workCompleted` uploads `completedPicture`, run it through Gemini Vision
- AI checks: Is the location clearly visible? Is it free of waste? Does it match the original dump category?
- New field on `Regdump`: `aiCompletionVerified: Boolean`, `completionConfidence: Number`
- If AI verification fails → task stays in `completed: false`, admin gets alert
- Add `completionVerificationStatus: Enum["PENDING", "VERIFIED", "FLAGGED"]`

**Real-world value:** Eliminates the #1 corruption vector in municipal sanitation — "paper completions"

---

#### 3. 📊 SLA Enforcement & Auto-Escalation Engine (BullMQ Delayed Jobs)

**Problem it solves:** Complaints currently sit at `resolved: false` forever. In real municipalities, a "grievance" must be resolved within a mandated SLA window (India: 30 days under CPGRAMS). No escalation = no accountability.

**What to build:**
- On complaint creation, **enqueue a delayed BullMQ job** with `delay: SLA_HOURS * 3600 * 1000`
- New job type: `escalateComplaint`
- Worker checks if complaint is still unresolved → auto-escalates to admin → sends SMS
- Escalation levels: L1 (admin) → L2 (district admin) → L3 (state dashboard alert)
- New fields on `GeneralComplaint`: `slaDeadline: Date`, `escalationLevel: Number (0-3)`, `escalatedAt: Date`
- New endpoint: `GET /complain/overdue` (admin view of all SLA-breached complaints)

**Architecture pattern:** BullMQ delayed jobs — use existing Redis + BullMQ setup
```js
// In complain controller, after saving complaint:
await queueNotification("escalateComplaint", { 
  complaintId, district 
}, { delay: 72 * 60 * 60 * 1000 }); // 72-hour SLA
```

**Real-world value:** Makes Eco-Pulse legally meaningful — governments can adopt it because it enforces the same accountability as CPGRAMS

---

#### 4. 🗺️ Smart Bin Full-Alert & Auto-Dispatch (Complete the Stub)

**Problem it solves:** `SmartBin` model exists, `nearbyBin.controller.js` is a 112-byte empty stub. SmartBin data is collected but nothing acts on it.

**What to build:**
- `POST /bins/update-level` — IoT device / simulator posts fill-level updates
- When `fillLevel >= 80%` → status becomes `"red"` → **queue BullMQ job** `binOverflow`
- Worker finds nearest available team (using `$geoNear` MongoDB query) and auto-assigns
- Sends SMS to team: "Bin #XYZ at [address] is 90% full. Please collect within 2 hours."
- New endpoint: `GET /bins/nearby?lat=&lng=&radius=` — citizen app shows nearby bin status
- `Maintenance` model (already exists!) gets auto-created for repeated bin issues

**Architecture pattern:** Geospatial auto-dispatch — extends the existing Haversine routing logic to bins

**Real-world value:** Replaces expensive IoT middleware platforms like Enevo/Bigbelly — entirely open-source equivalent

---

### 🟧 TIER 2 — High Value / Architectural Showcase

---

#### 5. 🏆 Leaderboard & Eco-Credit Redemption System

**Problem it solves:** Credits are awarded but never redeemed — the gamification loop is broken. Citizens earn but can't use.

**What to build:**
- `GET /users/leaderboard?district=&period=weekly/monthly/alltime` — paginated ranking
- Credits redemption: `POST /users/redeem` — exchange credits for voucher codes (municipality discounts, public transport passes)
- New model: `Redemption` — `{ user, credits, reward, voucherCode, redeemedAt }`
- Voucher codes generated with `crypto.randomBytes(8).toString('hex')`
- Leaderboard computed via MongoDB aggregation (top N users by `credits` in district)
- Weekly cron job (extend existing `node-cron`) → auto-announce top 3 citizens via SMS

**Architecture pattern:** Aggregation pipeline + cron-based scheduled jobs

**Real-world value:** Makes civic participation addictive — the model municipalities are already experimenting with (Swachh Bharat app, Indore waste management gamification)

---

#### 6. 📡 Real-Time Dashboard with Socket.io (Activate What's Already There)

**Problem it solves:** `socket.controller.js` exists but is 219 bytes — a complete stub. Socket.io is installed but emitting nothing.

**What to build:**
- When a dump is registered → `io.to('admin-room').emit('new-dump', dumpData)`
- When a task is completed → `io.to('admin-room').emit('task-completed', { dumpId, team })`
- When bin fill level hits red → `io.to('admin-room').emit('bin-overflow', binData)`
- Admin joins room via `socket.on('join-admin-room', (adminId) => socket.join(...))`
- Live counter updates on admin dashboard — no refresh needed

**Architecture pattern:** Room-based Socket.io broadcasting — professional real-time pattern

**Real-world value:** Emergency command centers for disasters (floods, epidemics) depend on live operational dashboards — this demonstrates that pattern

---

#### 7. 📦 Recycling Marketplace & Collector Assignment

**Problem it solves:** `Recycle` model has no pickup workflow — requests are created and then nothing happens. There's no `collectedBy`, no team assignment, no tracking.

**What to build:**
- `POST /recycle/assign-collector/:recycleId` (admin-secured) — assign a team to collect
- `POST /recycle/mark-collected/:recycleId` (team-secured) — with collection proof photo
- New fields on `Recycle`: `assignedTeam: ObjectId`, `collectionProof: String`, `collectedAt: Date`
- Queue SMS to team when assigned: "New recycling pickup at [address] — [quantity] kg of [item]"
- Recycler gets credit: verified collection → `+5 Eco-Credits` to citizen
- `GET /recycle/my-requests` (user-secured) — citizen tracks their own requests

**Architecture pattern:** Mirrors the existing dump-assign-complete pattern — closes the loop

**Real-world value:** Waste-picker cooperatives (like Chintan or KKPKP in India) desperately need digital platforms to coordinate recyclable pickup — this directly serves them

---

#### 8. 🌍 Civic Event Management (Activate the Dead `Event` Model)

**Problem it solves:** `Event` model exists with full schema (participants array, GeoJSON location, status) but no controller, no routes, no APIs.

**What to build:**
- CRUD for cleanup events: `POST /events/create` (admin), `GET /events/upcoming?district=`
- `POST /events/:id/join` (user-secured) — citizen registers for a cleanup drive
- Joining an event = automatic community notification to nearby users (within 5km via `$geoNear`)
- Event completion → bulk award Eco-Credits to all verified participants
- BullMQ job: `eventReminder` — SMS reminder 24h before event

**Architecture pattern:** Geospatial notifications + bulk operations + scheduled reminders

**Real-world value:** Swachh Bharat Abhiyan actively organizes cleanliness drives — this gives municipalities a digital platform to coordinate them with verifiable citizen turnout

---

### 🟨 TIER 3 — Architecture Polish / Developer Experience

---

#### 9. 📋 Audit Log / Activity Trail

**Problem it solves:** No record of *who* assigned *what* task, at *what distance*, at *what time*. Zero accountability trail. Critical for anti-corruption.

**What to build:**
- New model: `AuditLog` — `{ actor, actorModel, action, targetModel, targetId, metadata, ip, timestamp }`
- Middleware `auditMiddleware(action)` — wraps route handlers
- Captures: task assignments, complaint resolutions, credit changes
- `GET /audit/logs` (super-admin only) — searchable, filterable log
- MongoDB TTL index on `timestamp` → auto-delete logs older than 1 year

**Architecture pattern:** Event sourcing light — industry-standard for compliance systems

---

#### 10. 🔄 Webhook System for Third-Party Integrations

**Problem it solves:** Municipal ERP systems, Swachh Bharat portal, or NGO dashboards can't consume Eco-Pulse data without polling the API.

**What to build:**
- New model: `WebhookSubscription` — `{ url, events[], secret, district, active }`
- When events occur (dump registered, task completed, complaint escalated) → POST payload to subscriber URLs
- HMAC-SHA256 signature on payload (using `crypto`) — same pattern as GitHub webhooks
- Retry logic via BullMQ: `webhookDelivery` job with 3 retry attempts
- `POST /webhooks/subscribe`, `DELETE /webhooks/:id`, `GET /webhooks/deliveries`

**Architecture pattern:** Webhook fan-out with BullMQ — used by Stripe, GitHub, Shopify

**Real-world value:** Smart cities need open data pipelines. This makes Eco-Pulse an open platform, not a closed app.

---

#### 11. 📈 Time-Series Analytics API

**Problem it solves:** Current `stats.controller.js` gives global totals. No trend data, no time-windowed analysis.

**What to build:**
- `GET /stats/trends?period=7d|30d|90d&district=&type=dumps|complaints|recycling`
- MongoDB aggregation with `$dateTrunc` (v5.0+) → group by day/week
- Response: array of `{ date, count, completionRate }` — ready for Chart.js/Recharts
- `GET /stats/heatmap?district=` — returns dump density by grid cell (for heatmap overlays)
- `GET /stats/team-performance` — per-team average resolution time, task count, completion rate

**Architecture pattern:** Read-optimized aggregation queries — standard analytics backend pattern

---

## 🏗️ Architectural Modifications to Existing Code

### Modification 1: Multi-Queue Architecture

**Current:** Single `notificationQueue` handles all job types  
**Problem:** SMS failures block email/push notifications; one queue for everything = poor observability

**Proposed:**
```
notificationQueue (SMS via Twilio)
escalationQueue   (complaint SLA enforcement)
analyticsQueue    (async stats computation)  
webhookQueue      (third-party delivery)
```

Each queue has independent concurrency, retry, and failure policies.

---

### Modification 2: `Regdump` Model Enhancement

Add fields to unlock fraud-prevention and analytics:

```js
// Add to registerDump.model.js
severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] }, // from AI
wasteType: { type: String },               // from AI (plastic, organic, etc.)
aiCompletionVerified: { type: Boolean, default: false },
completionVerificationStatus: { type: String, enum: ["PENDING", "VERIFIED", "FLAGGED"] },
slaDeadline: { type: Date },               // createdAt + SLA hours by severity
resolvedAt: { type: Date },                // when completed = true
resolutionTimeHours: { type: Number },     // resolvedAt - createdAt
```

---

### Modification 3: User Model — Engagement Fields

```js
// Add to user.model.js
phoneVerified: { type: Boolean, default: false },
lastActiveAt: { type: Date },
reportStreak: { type: Number, default: 0 },  // consecutive weeks with reports
totalCreditsEarned: { type: Number, default: 0 }, // historical (credits can be redeemed)
badges: [{ type: String }],                  // "First Reporter", "100-Credits Club", etc.
```

---

### Modification 4: Rate Limiting Per User (Not Just Per IP)

**Current:** `express-rate-limit` works on IP only — easily bypassed with VPN  
**Proposed:** Per-user rate limiting using Redis (store `rateLimit:userId:routeKey` counters)

```js
// middleware/userRateLimit.js
const key = `rateLimit:${req.user._id}:dump-register`;
const count = await redis.incr(key);
await redis.expire(key, 3600); // 1-hour window
if (count > 5) return res.status(429).json({ message: "Max 5 dump reports per hour" });
```

---

## 📊 Priority Matrix

| Feature | Real-World Value | Architecture Value | Implementation Effort | Priority |
|---------|-----------------|--------------------|-----------------------|----------|
| OTP Phone Verification | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Low (stub exists) | 🔴 P0 |
| AI Completion Verification | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Medium | 🔴 P0 |
| SLA Escalation Engine | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Medium | 🔴 P0 |
| SmartBin Auto-Dispatch | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Medium | 🟠 P1 |
| Real-Time Socket.io Dashboard | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Low (stub exists) | 🟠 P1 |
| Recycling Pickup Workflow | ⭐⭐⭐⭐ | ⭐⭐⭐ | Low | 🟠 P1 |
| Civic Event Management | ⭐⭐⭐⭐ | ⭐⭐⭐ | Medium | 🟡 P2 |
| Leaderboard + Credit Redemption | ⭐⭐⭐ | ⭐⭐⭐ | Medium | 🟡 P2 |
| Audit Log | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Low | 🟡 P2 |
| Webhook System | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | High | 🟢 P3 |
| Time-Series Analytics API | ⭐⭐⭐ | ⭐⭐⭐⭐ | Medium | 🟢 P3 |
| User-Level Rate Limiting | ⭐⭐ | ⭐⭐⭐⭐ | Low | 🟢 P3 |

---

## 🔗 Existing Dead Code to Activate (Quick Wins)

These are already partially built — minimal effort, high reward:

| File | State | What to Add |
|------|-------|------------|
| [socket.controller.js](file:///home/rajshivam/code/Web_Development/FullStack/Express_React/Eco-Pulse/backend/controllers/socket.controller.js) | 219 bytes — empty | Event emitters for dump, task, bin events |
| [nearbyBin.controller.js](file:///home/rajshivam/code/Web_Development/FullStack/Express_React/Eco-Pulse/backend/controllers/nearbyBin.controller.js) | 112 bytes — empty | `$geoNear` query on SmartBin collection |
| [event.model.js](file:///home/rajshivam/code/Web_Development/FullStack/Express_React/Eco-Pulse/backend/models/event.model.js) | Schema only | Full CRUD controller + routes |
| [task.model.js](file:///home/rajshivam/code/Web_Development/FullStack/Express_React/Eco-Pulse/backend/models/task.model.js) | Schema only | Merge or use as generic task tracker |
| [maintenance.model.js](file:///home/rajshivam/code/Web_Development/FullStack/Express_React/Eco-Pulse/backend/models/maintenance.model.js) | Schema only | Wire to SmartBin overflow → auto-create maintenance record |
| `sendOTP` job in queue | Commented out | Activate with phone verification flow |

