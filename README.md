# 🏥 TestInsure - Hospital ERP & Insurance Management System

![Java](https://img.shields.io/badge/Backend-Spring%20Boot-green) ![React](https://img.shields.io/badge/Frontend-React.js-blue) ![MySQL](https://img.shields.io/badge/Database-MySQL-orange) ![License](https://img.shields.io/badge/License-MIT-lightgrey)

TestInsure is a comprehensive full-stack Enterprise Resource Planning (ERP) system designed to unify hospital clinical operations and financial insurance verification. It simulates a modern, cashless healthcare workflow where bookings are validated against real-time insurance limits.

---

## 🚀 Project Architecture

This repository is structured as a monorepo with both backend and frontend components:

| Module      | Folder Name  | Tech Stack                     | Description |
|-------------|--------------|-------------------------------|-------------|
| Backend     | /TestInsure  | Spring Boot 3, JPA, MySQL     | REST APIs, Business Logic, Transactions |
| Frontend    | /frontend    | React.js, Vite, Bootstrap 5   | Patient Portal, Admin Dashboard |

---

## 🌟 Key Features

### 🩺 Patient Portal
- Smart Test Booking Engine
- Insurance Wallet with real-time balance updates
- Test Reports & Billing History

### 💼 Admin Console (Hospital Ops)
- Manage Tests, Pricing, Time Slots
- Verify insurance claims (TPA Simulation)
- Unified dashboard for clinical + financial workflows

---

## 🛠️ Quick Start Guide

### Prerequisites
- Java JDK 17+
- Node.js + npm
- MySQL Server

---

### 1. Backend Setup

Navigate to backend folder:

cd TestInsure

Configure database in:
src/main/resources/application.properties

Run server:

mvn spring-boot:run

---

### 2. Frontend Setup

Navigate to frontend folder:

cd frontend

Install dependencies:

npm install

Start development server:

npm run dev

---

