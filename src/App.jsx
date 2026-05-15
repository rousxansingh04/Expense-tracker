// ============================================================
// App.jsx — The Root Component (the "brain" of the app)
// ============================================================
//
// This is the TOP-LEVEL component. It:
//   1. Owns the expenses data (single source of truth)
//   2. Loads saved data from localStorage on first render
//   3. Saves data to localStorage whenever it changes
//   4. Passes data + handler functions down to child components
//
// COMPONENT TREE:
//
//   App  ←── owns the state
//   ├── SummaryCard    ←── receives: expenses (read-only)
//   ├── ExpenseForm    ←── receives: onAddExpense (function)
//   └── ExpenseList    ←── receives: expenses + onDeleteExpense
//
// Data flows DOWN via props, actions flow UP via callbacks.
// ============================================================

// We import two hooks from React: useState and useEffect
import { useState, useEffect } from "react";

// Import our CSS styles
import "./App.css";

// Import the three child components
import SummaryCard from "./components/SummaryCard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

// ────────────────────────────────────────────────────────────
// A constant for the localStorage key.
// Using a constant avoids typos — if we misspell the variable
// name, JavaScript throws an error. If we misspell a string,
// it silently fails.
// ────────────────────────────────────────────────────────────
const STORAGE_KEY = "expense-tracker-data";

export default function App() {

  // ══════════════════════════════════════════════════════════
  // useState — Creating Reactive State
  // ══════════════════════════════════════════════════════════
  //
  // useState is a React "hook" (a special function that hooks
  // into React's internal systems).
  //
  //   const [value, setValue] = useState(initialValue);
  //
  // It returns an array with exactly two items:
  //   [0] value    — the current state value
  //   [1] setValue  — a function to UPDATE that value
  //
  // When you call setValue(newValue), React:
  //   1. Updates the value
  //   2. Re-renders this component (and its children)
  //   3. The UI automatically reflects the new data
  //
  // ┌───────────────────────────────────────────────────────┐
  // │  IMPORTANT: Never modify state directly!              │
  // │                                                       │
  // │    expenses.push(newItem)     ← ❌ WRONG (mutation)   │
  // │    setExpenses([...expenses, newItem]) ← ✅ CORRECT   │
  // │                                                       │
  // │  Always create a NEW array/object so React detects    │
  // │  the change and re-renders.                           │
  // └───────────────────────────────────────────────────────┘
  //
  // Here we initialize expenses as an empty array [].
  // The useEffect below will replace it with saved data
  // from localStorage (if any) on the very first render.

  const [expenses, setExpenses] = useState([]);

  // We also track whether we've finished loading from
  // localStorage. This prevents the "save" effect from
  // running before the "load" effect has completed
  // (which would overwrite saved data with an empty array).
  const [isLoaded, setIsLoaded] = useState(false);

  // ══════════════════════════════════════════════════════════
  // useEffect #1 — LOAD from localStorage (runs ONCE)
  // ══════════════════════════════════════════════════════════
  //
  // useEffect is another React hook. It lets you run "side
  // effects" — code that interacts with things OUTSIDE of
  // React (localStorage, APIs, timers, DOM manipulation).
  //
  //   useEffect(effectFunction, dependencyArray);
  //
  // The DEPENDENCY ARRAY controls WHEN the effect runs:
  //
  //   useEffect(fn, [])       → runs ONCE after first render
  //   useEffect(fn, [a, b])   → runs when `a` or `b` changes
  //   useEffect(fn)           → runs after EVERY render (rare)
  //
  // ┌───────────────────────────────────────────────────────┐
  // │  WHY [] (empty array)?                                │
  // │                                                       │
  // │  An empty dependency array means "I depend on nothing │
  // │  — just run me once when the component first appears  │
  // │  on screen." Perfect for initial data loading.        │
  // └───────────────────────────────────────────────────────┘

  useEffect(() => {
    // Try to read saved expenses from localStorage.
    // localStorage stores everything as STRINGS, so we need
    // JSON.parse() to convert the string back to an array.
    //
    // localStorage.getItem(key) returns:
    //   • The saved string, if the key exists
    //   • null, if the key doesn't exist (first visit)

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData !== null) {
      try {
        // JSON.parse() converts a JSON string back into a
        // JavaScript array/object. We wrap this in try/catch
        // to prevent the app from crashing if the data is corrupted.
        const parsedExpenses = JSON.parse(savedData);
        
        // Edge Case: Validate that the parsed data is actually an array.
        // If someone manually edited localStorage and saved an object {} 
        // instead, calling .map() or .reduce() later would break.
        if (Array.isArray(parsedExpenses)) {
          setExpenses(parsedExpenses);
        } else {
          console.warn("Invalid data in localStorage (not an array). Resetting to empty list.");
          setExpenses([]);
        }
      } catch (error) {
        // Edge Case: The data in localStorage is not valid JSON
        console.error("Failed to parse expenses from localStorage:", error);
        setExpenses([]); // fallback to safe default
      }
    }

    // Mark loading as complete so the save effect can start
    setIsLoaded(true);
  }, []); // ← empty array = run only once on mount

  // ══════════════════════════════════════════════════════════
  // useEffect #2 — SAVE to localStorage (runs on changes)
  // ══════════════════════════════════════════════════════════
  //
  // This effect runs every time the `expenses` array changes.
  // We list `expenses` in the dependency array so React knows
  // to re-run this effect whenever expenses is updated.
  //
  // ┌───────────────────────────────────────────────────────┐
  // │  WHY [expenses] ?                                     │
  // │                                                       │
  // │  We want to save EVERY time expenses changes:         │
  // │    • User adds an expense    → save                   │
  // │    • User deletes an expense → save                   │
  // │                                                       │
  // │  React compares the OLD and NEW value of `expenses`.  │
  // │  If they're different, the effect function runs.      │
  // └───────────────────────────────────────────────────────┘

  useEffect(() => {
    // Don't save until the initial load is complete.
    // Without this guard, the sequence would be:
    //   1. Component mounts with expenses = []
    //   2. This effect runs → saves [] to localStorage  ← BUG!
    //   3. Load effect runs → reads [] from localStorage
    //   4. User's saved data is lost!
    if (!isLoaded) return;

    // JSON.stringify() converts a JavaScript array/object
    // into a JSON string so localStorage can store it:
    //   [ { id: 1, title: "Milk", amount: 50 } ]
    //    → '[ {"id":1,"title":"Milk","amount":50} ]'
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses, isLoaded]); // ← re-run when expenses or isLoaded changes

  // ══════════════════════════════════════════════════════════
  // HANDLER FUNCTIONS — passed down to children as props
  // ══════════════════════════════════════════════════════════

  // ── Add a new expense ─────────────────────────────────────
  // Called by ExpenseForm when the user submits the form.
  // `expense` is the object created by ExpenseForm:
  //   { id: 1716849600000, title: "Groceries", amount: 250 }
  //
  // We create a NEW array using the spread operator (...):
  //   [...expenses, expense]
  //
  // This means: "copy all existing items, then add the new one
  // at the end." We NEVER mutate the original array.

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
    //          ^^^^^^^^^^^^  ^^^^^^^
    //          copy old ones  add new one
  };

  // ── Delete an expense ─────────────────────────────────────
  // Called by ExpenseList when the user clicks a delete button.
  // `id` is the unique identifier of the expense to remove.
  //
  // .filter() creates a NEW array containing only the items
  // that PASS the test (return true).
  //
  //   [1, 2, 3, 4].filter(n => n !== 3)  →  [1, 2, 4]
  //
  // So we keep every expense whose id does NOT match the
  // one we want to delete.

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    //                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //                          keep only expenses with a different id
  };

  // ══════════════════════════════════════════════════════════
  // JSX — The UI Layout
  // ══════════════════════════════════════════════════════════
  //
  // We render our three child components and pass them the
  // data and functions they need via PROPS.
  //
  // Think of props like function arguments:
  //   <SummaryCard expenses={expenses} />
  //   is similar to:
  //   SummaryCard({ expenses: expenses })

  return (
    <div className="app">
      {/* ── App Header ────────────────────────────────────── */}
      <header className="app-header">
        <h1>💸 Expense Tracker</h1>
        <p>Track your spending, stay in control</p>
      </header>

      <main className="app-main">
        {/* ── Summary Section ─────────────────────────────── */}
        {/*
          SummaryCard only needs to READ the expenses to
          calculate totals, so we pass just the array.
        */}
        <SummaryCard expenses={expenses} />

        {/* ── Form Section ────────────────────────────────── */}
        {/*
          ExpenseForm doesn't need the expenses array — it only
          needs a way to SEND new expenses up to us. So we pass
          our handleAddExpense function as a prop.

          Inside ExpenseForm, this arrives as `onAddExpense`.
        */}
        <ExpenseForm onAddExpense={handleAddExpense} />

        {/* ── List Section ────────────────────────────────── */}
        {/*
          ExpenseList needs BOTH:
            • The expenses array (to display them)
            • A delete function (to remove them)
        */}
        <ExpenseList
          expenses={expenses}
          onDeleteExpense={handleDeleteExpense}
        />
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="app-footer">
        <p>Built with React ⚛️ | Data saved in your browser</p>
      </footer>
    </div>
  );
}

// ============================================================
// KEY CONCEPTS RECAP:
// ============================================================
//
// 1. useState
//    Creates reactive state. When you call the setter function,
//    React re-renders the component with the new value.
//    ⚠️ Never mutate state directly — always create new
//    arrays/objects.
//
// 2. useEffect(fn, [])  — Run Once
//    The empty dependency array [] means the effect runs only
//    after the FIRST render. Used here to load saved data.
//
// 3. useEffect(fn, [expenses])  — Run on Change
//    Listing `expenses` in the dependency array means the
//    effect runs every time `expenses` changes. Used here to
//    save data whenever the user adds or deletes an expense.
//
// 4. localStorage
//    A browser API that stores key-value pairs persistently.
//    Data survives page refreshes and browser restarts.
//    • setItem(key, string)  — save
//    • getItem(key)          — load (returns string or null)
//    • Data must be converted: JSON.stringify ↔ JSON.parse
//
// 5. IMMUTABLE STATE UPDATES
//    • Add:    setExpenses([...old, newItem])
//    • Delete: setExpenses(old.filter(item => item.id !== id))
//    • Edit:   setExpenses(old.map(item =>
//                item.id === id ? { ...item, ...changes } : item
//              ))
//
// 6. LIFTING STATE UP
//    App owns the state and passes it DOWN to children.
//    Children communicate UP by calling functions received
//    as props. This one-way data flow makes the app
//    predictable and easy to debug.
//
// ============================================================
