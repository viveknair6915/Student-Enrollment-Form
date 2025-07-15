# Student Enrollment Form (JsonPowerDB Micro Project)

## Description
A simple, modern web application for enrolling students, built as a micro project to demonstrate integration with [JsonPowerDB (JPDB)](https://login2explore.com/jpdb.html). The form allows you to save, update, and reset student records in real-time using JPDB as the backend database.

## Features
- Add new student records (Roll No, Full Name, Class, Birth Date, Address, Enrollment Date)
- Update existing student records by Roll No
- Reset form to initial state
- All fields validated (no empty fields allowed)
- Clean, responsive UI
- All data stored in JPDB (SCHOOL-DB, STUDENT-TABLE)

## Benefits of using JsonPowerDB
- **Simple REST API**: Easy to use with JavaScript and web apps
- **NoSQL flexibility**: Store JSON documents directly
- **Real-time**: Fast CRUD operations
- **Cloud or On-Premise**: Use as per your needs
- **Secure**: Token-based authentication
- **Zero setup**: No server-side code required for this project

## Getting Started

### Prerequisites
- A [JsonPowerDB account](https://login2explore.com/jpdb.html) (free signup)
- Your JPDB API token (see below)
- Modern web browser (Chrome, Edge, Firefox, etc.)

### Setup Instructions
1. **Clone or Download this repository**
2. **Open `script.js`**
   - Replace `<YOUR_API_TOKEN_HERE>` with your JPDB API token
   - (Optional) Change DB/Relation names if needed
3. **Open `index.html` in your browser**
4. **Start using the form!**

### How the Form Works
- On page load, all fields except Roll No are disabled
- Enter a Roll No and move focus away (Tab or click elsewhere)
  - If Roll No exists: Data is loaded, you can update or reset
  - If Roll No does not exist: You can enter new data and save
- [Save] stores a new record, [Update] updates an existing one, [Reset] clears the form

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Benefits of using JsonPowerDB](#benefits-of-using-jsonpowerdb)
- [Getting Started](#getting-started)
- [Release History](#release-history)
- [Illustrations](#illustrations)
- [Scope of functionalities](#scope-of-functionalities)
- [Examples of use](#examples-of-use)
- [Project status](#project-status)
- [Sources](#sources)

## Release History
- v1.0.0 (Initial release): Student Enrollment Form with JPDB integration

## Illustrations
![Screenshot](https://user-images.githubusercontent.com/placeholder/your-screenshot.png)

## Scope of functionalities
- Student record management (add/update)
- Form validation
- JPDB REST API integration
- No server-side code required

## Examples of use
- School admin can enroll new students and update their details
- Demonstrates how to use JPDB for real-world web apps

## Project status
- **Completed**: Ready for use and demonstration

## Sources
- [JsonPowerDB Documentation](https://login2explore.com/jpdb.html)
- [JPDB REST API Docs](https://login2explore.com/jpdbdocs.html)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Made with ❤️ by Vivek V Nair**
