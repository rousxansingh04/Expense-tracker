# 💸 React Expense Tracker

A modern, beautiful, and fully functional Expense Tracker application built with React and Vite. It helps you keep track of your daily expenses, providing real-time calculations and persistence using local storage.

![Expense Tracker Preview](./screenshots/app-preview.png)

## ✨ Features

- **Add & Delete Expenses:** Easily log your expenses with a title and amount. Remove them with a single click.
- **Real-Time Summary:** Automatically calculates your Total Spent, Expense Count, Highest Expense, and Average Expense.
- **Dynamic Visual Cues:** The total amount turns **green** when you're under budget (≤ ₹1000) and **red** when you go over (> ₹1000).
- **Persistent Storage:** All data is saved directly in your browser's `localStorage`, meaning your expenses remain even if you refresh or close the page.
- **Premium UI:** Features a sleek dark mode, glassmorphism card designs, smooth hover animations, and modern typography (Inter + Outfit).
- **Mobile Responsive:** Works and looks great on both desktop and mobile devices.

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Styling:** Vanilla CSS with custom properties (CSS variables), Flexbox/Grid, and keyframe animations.
- **Typography:** Google Fonts (Inter & Outfit)

## 🛠️ Getting Started

To run this project locally on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rousxansingh04/Expense-tracker.git
   cd Expense-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the app:**
   Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173/`).

## 🧠 React Concepts Demonstrated
This project is an excellent example of core React principles:
- **Functional Components & JSX**
- **Props & Lifting State Up** (Child to Parent communication)
- **Hooks** (`useState` for reactive data, `useEffect` for syncing with local storage)
- **List Rendering** (`.map()`) with unique `key` props
- **Conditional Rendering** (Ternary operators and Logical AND `&&`)
- **Derived State** (Calculating totals from the existing array rather than storing duplicate state)

---
*Built with ❤️ using React.*
