# DONATEHUB — Old Clothes & Book Donation Drive Tracker

> **"Give More. Waste Less."**  
> *College Project Leap Java + DBMS Capstone Project*

DONATEHUB is a full-stack, enterprise-grade donation drive management platform for collecting, cataloging, verifying, and distributing donated clothes and books to accredited shelters, orphanages, and community schools.

---

## 🌟 Key Features

### For Donors (`ROLE_USER`)
- **Account Registration & Secure Login**: Fast signup with BCrypt encrypted passwords and JWT token authentication.
- **Personalized Dashboard**: Real-time stats on total donations made, total items donated, and total items distributed to charity.
- **Drive Discovery**: Browse active campaigns with venue location, target dates, and item counts.
- **Item Donation Form**: Donate items specifying campaign, category, condition (`NEW`, `GOOD`, `WORN`), quantity, and notes.
- **Donation Tracking**: Real-time status lifecycle tracking (`PENDING` → `COLLECTED` → `DISTRIBUTED`).
- **Profile Management**: Update contact and delivery address information.

### For Administrators (`ROLE_ADMIN`)
- **Protected Access**: Admin login with strict backend role enforcement (`ROLE_ADMIN`). No public admin signup.
- **Interactive Dashboard**: Live metrics for Total Users, Active Drives, Items Collected, Distributed Items, Storage Inventory, and Registered Recipients.
- **Live Visual Analytics**: SVG charts showing monthly collection/distribution velocity, category share, and drive fulfillment ratios.
- **Drives Management**: Create, edit, monitor, and close campaigns with start/end date validation.
- **Inventory & Status Updates**: Inspect donated items, verify incoming stock, and mark as `COLLECTED` with collection dates.
- **Recipient Registry**: Manage partner organizations (orphanages, shelters, schools, NGOs, community centers).
- **Distribution Fulfillment**: Record handovers to recipients with automated inventory availability checks.
- **Category Control**: Organize items into structured categories (Winter Clothing, Children's Books, School Textbooks, etc.).
- **Audit Logs**: Comprehensive, tamper-evident audit trail capturing user IDs, timestamps, target entities, and actions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router 6, Axios, Tailwind CSS, Lucide Icons |
| **Backend** | Java 17 / 25, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, Hibernate, Bean Validation |
| **Database** | MySQL (Database: `donatehub_db`), HikariCP Connection Pool |
| **Authentication** | JWT (JSON Web Tokens via JJWT 0.12.6) + BCrypt Password Encoding |
| **API Docs** | Swagger / OpenAPI 3 (`springdoc-openapi-starter-webmvc-ui` 2.6.0) |
| **Build Tools** | Apache Maven 3.9+, Node.js 20+ LTS, npm 10+ |

### Local Configuration

The backend uses `DB_PASSWORD` to override the local MySQL password (default: `root`) and `JWT_SECRET` to override its development-only JWT signing key. Set a unique, randomly generated `JWT_SECRET` of at least 32 bytes outside development; never use the fallback in a deployed environment.

---

## 🏗️ Architecture

```text
React 18 Frontend (Vite, Tailwind, React Router)
   │
   ▼ HTTP / JSON (JWT Bearer Token in Authorization header)
Spring Boot 3 REST Controllers
   │
   ▼
Spring Security Filter Chain (Role check: ROLE_ADMIN, ROLE_USER)
   │
   ▼
Service Layer (Business rules, availability checks, date validation, audit logging)
   │
   ▼
Spring Data JPA Repositories
   │
   ▼
Hibernate 6 ORM
   │
   ▼
MySQL 8+ Database (donatehub_db)
```

---

## 🗄️ Database Tables & Schema

All 9 major entities have dedicated normalized tables in `donatehub_db`:

1. **`users`**: `id`, `full_name`, `email` (UNIQUE), `phone`, `password`, `address`, `role`, `created_at`, `updated_at`
2. **`admins`**: `id`, `name`, `email` (UNIQUE), `password`, `role`, `created_at`, `updated_at`
3. **`donation_drives`**: `id`, `name`, `description`, `start_date`, `end_date`, `location`, `status`, `created_at`, `updated_at`
4. **`donors`**: `id`, `user_id` (FK → users), `name`, `email`, `phone`, `address`, `created_at`, `updated_at`
5. **`item_categories`**: `id`, `name` (UNIQUE), `description`, `created_at`, `updated_at`
6. **`donated_items`**: `id`, `drive_id` (FK → donation_drives), `donor_id` (FK → donors), `category_id` (FK → item_categories), `item_name`, `description`, `quantity`, `condition`, `collection_date`, `status`, `created_at`, `updated_at`
7. **`recipients`**: `id`, `organization_name`, `contact_person`, `email`, `phone`, `address`, `organization_type`, `created_at`, `updated_at`
8. **`distributions`**: `id`, `item_id` (FK → donated_items), `recipient_id` (FK → recipients), `quantity`, `distribution_date`, `notes`, `distributed_by`, `admin_id` (FK → admins), `created_at`
9. **`audit_logs`**: `id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `created_at`

### Entity Relationships
- **User → Donor**: One-to-One / Many-to-One (`user_id`)
- **Donor → DonatedItem**: One-to-Many (`donor_id`)
- **DonationDrive → DonatedItem**: One-to-Many (`drive_id`)
- **Category → DonatedItem**: One-to-Many (`category_id`)
- **DonatedItem → Distribution**: One-to-Many (`item_id`)
- **Recipient → Distribution**: One-to-Many (`recipient_id`)
- **Admin → Distribution**: Many-to-One (`admin_id`)

---

## ⚖️ Business Rules Enforced in Service Layer

1. **Collection Precondition**: An item can **only** be distributed after it has been collected (`status == COLLECTED` or partially distributed). Distributing an uncollected `PENDING` item returns `HTTP 400: Item must be collected before distribution.`
2. **Quantity Constraint**: Distribution quantity cannot exceed available quantity:
   $$\text{Available} = \text{Donated Quantity} - \text{Total Distributed Quantity}$$
   If a user requests more than available, the service layer rejects with `HTTP 400: Distribution quantity exceeds available quantity.`
3. **Positive Quantities**: All item donation and distribution quantities must be $\ge 1$.
4. **Date Integrity**: Drive `endDate` cannot be before `startDate`.
5. **Unique Credentials**: Emails must be unique across the system.
6. **Integrity References**: Every donation must reference an existing drive, donor, and category; distributions must reference a valid recipient.
7. **Data Ownership**: Donors can only access and view their own donation records.
8. **Role Authorization**: All `/api/admin/**` endpoints are protected exclusively for `ROLE_ADMIN`.

---

## 🔐 Default Credentials

### Default Administrator
- **Email**: `admin@donatehub.com`
- **Password**: `Admin@123`
- **Role**: `ROLE_ADMIN`

### Seeded Sample Donors (Password: `User@123`)
- `sarah.jenkins@example.com`
- `michael.chang@example.com`
- `elena.rostova@example.com`
- `david.miller@example.com`
- `priya.sharma@example.com`

---

## 🚀 Setup & Execution Guide

### 1. Prerequisites
- Java 17 or higher
- Maven 3.8+
- Node.js 18+ and npm
- MySQL 8.0+ running on port 3306 with credentials `root` / `root`

### 2. MySQL Database Setup
Open MySQL command line or MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS donatehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Run Entire Application with Spring Boot (Recommended)
The React frontend is embedded directly into Spring Boot (`src/main/resources/static`). You can run the entire full-stack application with a single command:

```bash
cd donatehub/backend
mvn spring-boot:run
```

Once started, open your browser:
- **Web App (Landing Page)**: [http://localhost:8080](http://localhost:8080)
- **Donor Login**: [http://localhost:8080/login](http://localhost:8080/login)
- **Donor Registration**: [http://localhost:8080/signup](http://localhost:8080/signup)
- **Active Drives**: [http://localhost:8080/drives](http://localhost:8080/drives)
- **Admin Portal**: [http://localhost:8080/admin/login](http://localhost:8080/admin/login)
- **Swagger OpenAPI Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **API Spec (JSON)**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### 4. Optional: Run Frontend via Vite Dev Server (Port 5173)
If you want hot module reloading during frontend development:
```bash
cd donatehub/frontend
npm install   # First time only
npm run dev   # Starts Vite dev server on port 5173 (proxies /api to 8080)
```
- Access at [http://localhost:5173](http://localhost:5173)

---

## 📮 Postman Collection
Import `DonateHub_Postman_Collection.json` into Postman to test:
- User Registration & Login
- Admin Login
- Active Drives Retrieval
- Drive Creation
- Donation Submission & User Dashboard
- Recipient Registration
- Distribution Record Fulfillment
- Analytics & Reports
