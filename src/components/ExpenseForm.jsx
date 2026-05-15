// ============================================================
// ExpenseForm.jsx — A form to add new expenses
// ============================================================
// This component uses two core React concepts:
//   1. useState  → to store what the user types in the inputs
//   2. props     → to send the new expense UP to the parent (App)
// ============================================================

// We import "useState" from React.
// useState lets us create variables that React "watches".
// When they change, React automatically re-renders (redraws) the UI.
import { useState } from "react";

// ------------------------------------------------------------
// The component receives one prop from its parent:
//   • onAddExpense — a function the parent passes down so we
//     can send the new expense data back up to it.
// ------------------------------------------------------------
export default function ExpenseForm({ onAddExpense }) {
  // ──────────────────────────────────────────────────────────
  // STATE — these are the "live" values tied to our two inputs
  // ──────────────────────────────────────────────────────────
  //
  // useState("") means "start with an empty string".
  // It returns an array with two items:
  //   [0] the current value   (title / amount)
  //   [1] a setter function   (setTitle / setAmount)
  //
  // We use array destructuring to name them clearly:

  const [title, setTitle] = useState("");   // what the user is buying
  const [amount, setAmount] = useState(""); // how much it costs

  // ──────────────────────────────────────────────────────────
  // EVENT HANDLER — runs every time the user types in an input
  // ──────────────────────────────────────────────────────────
  //
  // Instead of writing separate handlers for each input, we use
  // ONE handler and check which input fired the event by looking
  // at `e.target.name` (the "name" attribute on the <input>).

  const handleChange = (e) => {
    // `e` is the event object that React gives us automatically.
    // `e.target` is the actual <input> element the user typed in.
    // `e.target.name` tells us WHICH input it was ("title" or "amount").
    // `e.target.value` is the text the user typed.

    if (e.target.name === "title") {
      setTitle(e.target.value);   // update the title state
    } else if (e.target.name === "amount") {
      setAmount(e.target.value);  // update the amount state
    }
  };

  // ──────────────────────────────────────────────────────────
  // SUBMIT HANDLER — runs when the user clicks "Add Expense"
  // ──────────────────────────────────────────────────────────

  const handleSubmit = (e) => {
    // By default, a <form> submission reloads the entire page.
    // We call preventDefault() to STOP that — we're handling
    // everything in JavaScript, no page reload needed.
    e.preventDefault();

    // ── Basic validation ────────────────────────────────────
    // .trim() removes whitespace from both ends of a string.
    // If either field is empty after trimming, we stop here.
    if (title.trim() === "" || amount.trim() === "") {
      alert("Please fill in both fields!");
      return; // exit the function early — don't add the expense
    }

    // ── Build the expense object ────────────────────────────
    // We create a plain JavaScript object with the data we need.
    // • Date.now() gives a unique number (milliseconds since 1970)
    //   which we use as a simple unique ID.
    // • parseFloat() converts the amount string ("12.50") into
    //   an actual number (12.5) so we can do math with it later.
    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      amount: parseFloat(amount),
    };

    // ── Send it to the parent ───────────────────────────────
    // We call the function that was passed down as a prop.
    // This is how child → parent communication works in React:
    //   Parent gives child a function via props,
    //   Child calls that function with data.
    onAddExpense(newExpense);

    // ── Reset the form ──────────────────────────────────────
    // After adding, we clear both inputs so the user can
    // immediately type a new expense.
    setTitle("");
    setAmount("");
  };

  // ──────────────────────────────────────────────────────────
  // JSX — what gets rendered to the screen
  // ──────────────────────────────────────────────────────────
  //
  // JSX looks like HTML but it's actually JavaScript.
  // Key differences from HTML:
  //   • className instead of class
  //   • htmlFor instead of for
  //   • camelCase for event attributes (onChange, onSubmit)
  //   • Use {curly braces} to embed JavaScript expressions

  return (
    // The <form> element wraps our inputs.
    // onSubmit fires when the form is submitted (button click or Enter key).
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add New Expense</h2>

      {/* ── Title Input ──────────────────────────────────── */}
      <div className="form-group">
        <label htmlFor="title">Expense Title</label>
        <input
          type="text"
          id="title"
          name="title"           // used by handleChange to identify this input
          placeholder="e.g. Groceries"
          value={title}           // controlled input — React state drives the value
          onChange={handleChange}  // fires on every keystroke
        />
      </div>

      {/* ── Amount Input ─────────────────────────────────── */}
      <div className="form-group">
        <label htmlFor="amount">Amount (₹)</label>
        <input
          type="number"
          id="amount"
          name="amount"           // used by handleChange to identify this input
          placeholder="e.g. 250"
          min="0"                 // prevents negative numbers via browser UI
          step="0.01"             // allows decimals like 49.99
          value={amount}          // controlled input
          onChange={handleChange}  // fires on every keystroke
        />
      </div>

      {/* ── Submit Button ────────────────────────────────── */}
      {/* type="submit" means clicking this triggers the form's onSubmit */}
      <button type="submit" className="btn-add">
        ➕ Add Expense
      </button>
    </form>
  );
}

// ============================================================
// KEY CONCEPTS RECAP:
// ============================================================
//
// 1. CONTROLLED INPUTS
//    The input's `value` comes from React state, and every
//    keystroke updates state via onChange → setState.
//    React is the "single source of truth" for the input value.
//
// 2. LIFTING STATE UP
//    This form doesn't store the expense list itself — it sends
//    each new expense UP to the parent via the onAddExpense prop.
//    The parent (App) owns the list and passes it to other components.
//
// 3. EVENT OBJECT (e)
//    Every event handler receives an event object with info like:
//      e.target       → the DOM element that triggered the event
//      e.target.value → current value of an input
//      e.target.name  → the "name" attribute of the element
//      e.preventDefault() → stops the browser's default behavior
//
// ============================================================
