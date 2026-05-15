// ============================================================
// ExpenseList.jsx — Displays all expenses in a list
// ============================================================
// This component demonstrates two important React concepts:
//   1. Rendering lists with .map()
//   2. Passing data from parent → child via props
// ============================================================

// ------------------------------------------------------------
// PROPS this component receives from its parent (App):
//
//   • expenses     — an array of expense objects, each shaped like:
//                    { id: 1716849600000, title: "Groceries", amount: 250 }
//
//   • onDeleteExpense — a function to call when the user clicks
//                       the delete button, so the parent can
//                       remove that expense from its state.
// ------------------------------------------------------------
export default function ExpenseList({ expenses, onDeleteExpense }) {

  // ──────────────────────────────────────────────────────────
  // EMPTY STATE — if there are no expenses yet, show a message
  // ──────────────────────────────────────────────────────────
  //
  // expenses.length gives us the number of items in the array.
  // If it's 0 (falsy), we return early with a friendly message
  // instead of rendering an empty list.

  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <p>🧾 No expenses yet. Add your first one above!</p>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // JSX — render the list
  // ──────────────────────────────────────────────────────────

  return (
    <div className="expense-list">
      <h2>Your Expenses</h2>

      {/* ── The <ul> (unordered list) wraps all our items ── */}
      <ul>
        {/*
          ====================================================
          HOW .map() WORKS
          ====================================================

          .map() is a built-in JavaScript array method.
          It loops through every item in an array and returns
          a NEW array where each item has been transformed.

          Syntax:
            array.map((currentItem, index) => {
              return <something based on currentItem>;
            })

          In plain JS:
            [1, 2, 3].map(n => n * 2)  →  [2, 4, 6]

          In React, we use .map() to convert an array of DATA
          into an array of JSX ELEMENTS that React can render.

          Example:
            ["Apple", "Banana"].map(fruit => <li>{fruit}</li>)
            → renders two <li> elements on screen

          ====================================================
          THE KEY PROP
          ====================================================

          When rendering a list, React needs a way to tell
          items apart (so it knows which ones changed, were
          added, or removed). We give each element a unique
          `key` prop.

          Rules for keys:
            • Must be unique among siblings
            • Should be stable (don't use array index if the
              list can be reordered or items can be deleted)
            • We use expense.id (a timestamp) which is unique

          ====================================================
        */}

        {expenses.map((expense) => (
          // Each <li> represents one expense.
          // We set key={expense.id} so React can efficiently
          // track this specific item in the list.
          <li key={expense.id} className="expense-item">

            {/* ── Left side: expense info ──────────────── */}
            <div className="expense-info">
              {/*
                expense.title  → the name, e.g. "Groceries"
                expense.amount → the cost, e.g. 250

                .toFixed(2) formats the number to always show
                two decimal places:  250 → "250.00"
              */}
              <span className="expense-title">{expense.title}</span>
              <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
            </div>

            {/* ── Right side: delete button ────────────── */}
            {/*
              When the user clicks this button, we call
              onDeleteExpense and pass it the expense's id.

              The parent (App) will use this id to find and
              remove the correct expense from its state array.

              NOTE: We wrap the call in an arrow function:
                () => onDeleteExpense(expense.id)

              If we wrote just:
                onDeleteExpense(expense.id)    ← WRONG!

              ...it would call the function IMMEDIATELY when
              the component renders, not when the user clicks.
              The arrow function creates a "wrapper" that only
              runs when the click actually happens.
            */}
            <button
              className="btn-delete"
              onClick={() => onDeleteExpense(expense.id)}
              aria-label={`Delete ${expense.title}`}
            >
              🗑️ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// KEY CONCEPTS RECAP:
// ============================================================
//
// 1. ARRAY .map() IN JSX
//    We convert an array of data objects into an array of <li>
//    elements. React renders each element in the returned array.
//
//    data array:   [{ id: 1, title: "Milk" }, { id: 2, title: "Bread" }]
//                           ↓  .map()  ↓
//    JSX array:    [<li>Milk</li>,  <li>Bread</li>]
//
// 2. THE key PROP
//    Every item in a .map() list MUST have a unique `key`.
//    React uses it internally to efficiently update the DOM
//    when items are added, removed, or reordered.
//    ⚠️  Never use array index as key if items can be deleted!
//
// 3. PASSING FUNCTIONS AS PROPS
//    The parent passes onDeleteExpense down as a prop.
//    The child calls it with the specific expense's id.
//    This is how the child "tells" the parent to do something.
//
// 4. ARROW FUNCTIONS IN onClick
//    onClick={() => fn(arg)}  → calls fn(arg) only on click
//    onClick={fn(arg)}        → calls fn(arg) immediately! BUG!
//
// ============================================================
