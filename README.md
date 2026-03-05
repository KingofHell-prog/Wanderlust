# Project Title: Wanderlust

Wanderlust is a full-stack "Major Project" web application designed to simplify travel planning by allowing users to explore,
create, and review travel listings globally. Inspired by platforms like Airbnb, it features a robust backend, interactive
maps, and secure user authentication.

---

### 🚀 Core Features

* **Complete CRUD Functionality**: Users can Create, Read, Update, and Delete travel listings with detailed descriptions and pricing.
* **User Authentication**: Implemented secure Signup and Login systems using **Passport.js** and **Passport-Local** to protect user data.
* **Interactive Mapping**: Integrated **Mapbox SDK** to display the exact geographical location of every listing on a dynamic map.
* **Image Uploads**: Supports cloud-based image hosting via **Cloudinary** for high-quality listing visuals.
* **Review System**: A dedicated feedback loop where authenticated users can leave ratings and comments on destinations.
* **Persistent Sessions**: Utilizes **Connect-Mongo** to ensure users remain logged in across server restarts by storing session data in **MongoDB Atlas**.

---

### 💻 Technical Stack

* **Frontend**: HTML5, CSS3 (Bootstrap 5.3.3), JavaScript, and **EJS-Mate** for templating.
* **Backend**: **Node.js** and **Express.js** for server-side logic and routing.
* **Database**: **MongoDB Atlas** for cloud-based NoSQL data storage.
* **Security**: Passport.js for session-based authentication and **Joi** for schema validation.
