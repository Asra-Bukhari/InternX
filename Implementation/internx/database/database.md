# InternX Database Design

## Overview
InternX uses MongoDB (NoSQL) database to store all platform data in a document-based structure.

The database is connected through Mongoose in the backend and contains the following main collections:

---

## 📦 Collections

### 1. users
Stores all platform users (students, businesses, admins).

### 2. profiles
Stores additional student details like skills, university, and availability.

### 3. projects
Stores internship/project postings created by businesses.

### 4. applications
Stores student applications for projects.

### 5. messages
Stores chat messages between users.

### 6. reviews
Stores ratings and feedback after project completion.

### 7. payments
Stores payment transactions between businesses and students.

---

## 🔗 Key Relationships

- One User → One Profile (if student)
- One Business → Many Projects
- One Project → Max 10 Applications
- One Student → One Active Project
- Messages → Between Users (optional project-based chat)

---

## 🧠 Business Rules Enforced in Backend

- Student can apply to only one active project
- Each project can have maximum 10 applicants
- Only verified users can apply
- Payment is released after project completion

---

## Sample Data Included

- Student: Asra Bukhari (FAST NUCES)
- Business: Ali Ahmed (Company owner)