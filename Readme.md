## GraphQL ToDo Server

## 📋 Description
This project is a fully functional GraphQL server for a ToDo application, developed with the goal of learning GraphQL principles on the server side. The server provides an API for creating, reading, updating, and deleting tasks using a modern technology stack.

## 🛠 Tech Stack
* GraphQL - Query language for APIs
* Apollo Server - GraphQL server for Node.js
* MongoDB - NoSQL database for data storage
* Node.js - JavaScript runtime environment

## 🚀 Getting Started

### 🐳 Recommended: Run with Docker

The easiest and recommended way to run this project is using **Docker**.  
Docker provides a consistent runtime environment and removes the need to manually configure dependencies.

### 📦 Prerequisites
- **Docker** (v20+)
- **Docker Compose** (v2+)
- **Node.js** (version 18 or higher recommended)
- **MongoDB** (if required by the project)

⚠️ When running the project with Docker, **Node.js and MongoDB do not need to be installed locally**.

1. **Clone the repository**

```bash
git clone https://github.com/atomiccf/graphql_server.git
cd graphql_server
```
2. **Build and start the application**
```bash
docker compose up --build
```
3. **Database Initialization**
Before using the API, you must initialize the database with initial data.
This is done by running the install.sh script located in the install directory.
1.Navigate to the install directory:
```bash
cd install
```
2.Run the installation script:
```bash
./install.sh
```
The script will insert the required initial values into the database.
🌐 Accessing the API
After the containers are running and the database is initialized, the GraphQL API will be available at:
```bash
http://localhost:3000/graphql
```




