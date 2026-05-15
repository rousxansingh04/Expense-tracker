// ============================================================
// SummaryCard.jsx — Shows a summary of all expenses
// ============================================================
// This component demonstrates:
//   1. The .reduce() array method — to calculate a total
//   2. Deriving values from props — no extra state needed
//   3. Conditional rendering — showing different UI based on data
// ============================================================

// ------------------------------------------------------------
// PROPS this component receives from its parent (App):
//
//   • expenses — an array of expense objects, each shaped like:
//                { id: 1716849600000, title: "Groceries", amount: 250 }
// ------------------------------------------------------------
export default function SummaryCard({ expenses }) {

  // ──────────────────────────────────────────────────────────
  // CALCULATING THE TOTAL WITH .reduce()
  // ──────────────────────────────────────────────────────────
  //
  // .reduce() is a built-in JavaScript array method that
  // "reduces" an entire array down to a SINGLE value.
  //
  // Think of it like a snowball rolling downhill — it visits
  // each item, picks up something, and grows bigger.
  //
  // ┌─────────────────────────────────────────────────────┐
  // │  Syntax:                                            │
  // │                                                     │
  // │  array.reduce((accumulator, currentItem) => {       │
  // │    return accumulator + something;                   │
  // │  }, initialValue);                                  │
  // │                                                     │
  // │  • accumulator  — the "running total" so far         │
  // │  • currentItem  — the current element being visited  │
  // │  • initialValue — what the accumulator starts at     │
  // └─────────────────────────────────────────────────────┘
  //
  // STEP-BY-STEP EXAMPLE:
  //
  //   expenses = [
  //     { id: 1, title: "Milk",    amount: 50  },
  //     { id: 2, title: "Bus",     amount: 30  },
  //     { id: 3, title: "Snacks",  amount: 120 },
  //   ];
  //
  //   expenses.reduce((acc, expense) => acc + expense.amount, 0)
  //
  //   Iteration 1:  acc = 0   + 50  = 50
  //   Iteration 2:  acc = 50  + 30  = 80
  //   Iteration 3:  acc = 80  + 120 = 200
  //                                   ───
  //   Final result:                   200  ✅
  //
  // The second argument (0) is crucial — it's the starting
  // value. Without it, .reduce() uses the first array element
  // as the starting value, which would be an OBJECT, not a
  // number, and the math would break.

  const totalAmount = expenses.reduce((accumulator, expense) => {
    return accumulator + expense.amount;
  }, 0); // ← 0 is the initial value of the accumulator

  // ──────────────────────────────────────────────────────────
  // OTHER DERIVED VALUES
  // ──────────────────────────────────────────────────────────
  //
  // We can calculate more stats from the same array.
  // These are "derived" values — we compute them from props
  // instead of storing them in separate state. This is a
  // React best practice: don't put in state what you can
  // calculate from existing state or props.

  // Total number of expenses
  const expenseCount = expenses.length;

  // Highest single expense
  // Math.max() finds the largest number in a set of numbers.
  // We use .map() first to extract just the amounts into a
  // plain number array, then spread (...) them as arguments.
  //
  //   expenses.map(e => e.amount)  →  [50, 30, 120]
  //   Math.max(...[50, 30, 120])   →  120
  //
  // If the array is empty, we default to 0.
  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((e) => e.amount))
      : 0;

  // Average expense
  // Total divided by count. We guard against dividing by 0.
  const averageExpense =
    expenses.length > 0
      ? totalAmount / expenseCount
      : 0;

  // ──────────────────────────────────────────────────────────
  // JSX — what gets rendered to the screen
  // ──────────────────────────────────────────────────────────

  return (
    <div className="summary-card">
      <h2>Expense Summary</h2>

      {/*
        We wrap the stats in a grid container.
        Each stat is a small card showing a label and value.
      */}
      <div className="summary-stats">

        {/* ── Total Spent ─────────────────────────────── */}
        {/*
          CONDITIONAL CSS CLASS using a ternary operator:

            condition ? valueIfTrue : valueIfFalse

          If totalAmount > 1000 → we add the class "total-danger" (red)
          If totalAmount ≤ 1000 → we add the class "total-safe" (green)

          We use template literals (`backtick strings`) to combine
          the base class "stat-value" with the conditional class:

            `stat-value ${condition ? "classA" : "classB"}`

          Template literals let you embed ${expressions} inside strings.
        */}
        <div className="stat">
          <span className="stat-label">💰 Total Spent</span>
          <span
            className={`stat-value ${
              totalAmount > 1000 ? "total-danger" : "total-safe"
            }`}
          >
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>

        {/* ── Number of Expenses ──────────────────────── */}
        <div className="stat">
          <span className="stat-label">🧾 Expenses</span>
          <span className="stat-value">{expenseCount}</span>
        </div>

        {/* ── Highest Expense ─────────────────────────── */}
        <div className="stat">
          <span className="stat-label">📈 Highest</span>
          <span className="stat-value">₹{highestExpense.toFixed(2)}</span>
        </div>

        {/* ── Average Expense ─────────────────────────── */}
        <div className="stat">
          <span className="stat-label">📊 Average</span>
          <span className="stat-value">₹{averageExpense.toFixed(2)}</span>
        </div>
      </div>

      {/*
        ── CONDITIONAL RENDERING ──────────────────────────
        In JSX, we can use the && (logical AND) operator to
        conditionally show elements:

          condition && <element />

        If condition is true  → React renders <element />
        If condition is false → React renders nothing

        Here we show a "tip" only when expenses exist.
      */}
      {expenseCount > 0 && (
        <p className="summary-tip">
          You've made <strong>{expenseCount}</strong> expense
          {expenseCount === 1 ? "" : "s"} so far. Keep tracking! 🚀
        </p>
      )}
    </div>
  );
}

// ============================================================
// KEY CONCEPTS RECAP:
// ============================================================
//
// 1. ARRAY .reduce()
//    Reduces an entire array to a single value by visiting
//    each element and accumulating a result.
//
//    array.reduce((accumulator, item) => {
//      return accumulator + item.value;
//    }, initialValue);
//
//    Common uses:
//      • Sum all numbers       → .reduce((a, b) => a + b, 0)
//      • Count occurrences     → .reduce((counts, item) => { ... }, {})
//      • Flatten nested arrays → .reduce((flat, arr) => [...flat, ...arr], [])
//
// 2. DERIVED STATE
//    totalAmount, highestExpense, and averageExpense are NOT
//    stored in useState. They're calculated directly from the
//    expenses prop every time the component re-renders.
//    Rule of thumb: if you can compute it, don't store it.
//
// 3. CONDITIONAL RENDERING WITH &&
//    {condition && <JSX />} renders the JSX only when the
//    condition is truthy. It's a clean alternative to an
//    if-else block for simple show/hide logic.
//
// 4. SPREAD OPERATOR (...)
//    Math.max(...[50, 30, 120]) spreads the array into
//    separate arguments: Math.max(50, 30, 120)
//    Without spread, Math.max([50, 30, 120]) returns NaN.
//
// ============================================================
