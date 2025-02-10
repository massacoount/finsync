#!/bin/bash
# This script creates five mobile-friendly HTML files using Tailwind CSS

# Create Dashboard (index.html)
cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto p-4">
    <!-- Header / Navigation -->
    <header class="flex flex-col md:flex-row items-center justify-between mb-6">
      <nav class="flex space-x-4 mb-4 md:mb-0">
        <a href="index.html" class="text-blue-500 hover:underline">Dashboard</a>
        <a href="accounts.html" class="text-blue-500 hover:underline">Accounts</a>
        <a href="transactions.html" class="text-blue-500 hover:underline">Transactions</a>
        <a href="goals.html" class="text-blue-500 hover:underline">Goals</a>
        <a href="record-transaction.html" class="text-blue-500 hover:underline">Record Transaction</a>
      </nav>
      <h1 class="text-2xl font-bold">Dashboard</h1>
    </header>
    
    <!-- Account Summary Cards -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-100 p-4 rounded-lg shadow">
        <h3 class="font-bold mb-2">Checking (USD)</h3>
        <p>Balance: $5,000</p>
      </div>
      <div class="bg-green-100 p-4 rounded-lg shadow">
        <h3 class="font-bold mb-2">Savings (EUR)</h3>
        <p>Balance: €3,500</p>
      </div>
      <div class="bg-red-100 p-4 rounded-lg shadow">
        <h3 class="font-bold mb-2">Credit Card (USD)</h3>
        <p>Balance: -$1,200</p>
      </div>
      <div class="bg-yellow-100 p-4 rounded-lg shadow">
        <h3 class="font-bold mb-2">Cash (USD)</h3>
        <p>Balance: $300</p>
      </div>
    </section>
    
    <!-- Recent Transactions -->
    <section class="mb-6">
      <h2 class="text-xl font-bold mb-4">Recent Transactions</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="px-4 py-2">Date</th>
              <th class="px-4 py-2">Description</th>
              <th class="px-4 py-2">Account</th>
              <th class="px-4 py-2">Amount</th>
              <th class="px-4 py-2">Category</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr class="border-t">
              <td class="px-4 py-2">2025-02-08</td>
              <td class="px-4 py-2">Grocery Shopping</td>
              <td class="px-4 py-2">Checking</td>
              <td class="px-4 py-2">-$150.00</td>
              <td class="px-4 py-2">Groceries</td>
            </tr>
            <tr class="border-t">
              <td class="px-4 py-2">2025-02-07</td>
              <td class="px-4 py-2">Salary Deposit</td>
              <td class="px-4 py-2">Checking</td>
              <td class="px-4 py-2">$2,000.00</td>
              <td class="px-4 py-2">Income</td>
            </tr>
            <tr class="border-t">
              <td class="px-4 py-2">2025-02-06</td>
              <td class="px-4 py-2">Utility Bill</td>
              <td class="px-4 py-2">Checking</td>
              <td class="px-4 py-2">-$75.00</td>
              <td class="px-4 py-2">Utilities</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    
    <!-- Notifications -->
    <section>
      <h2 class="text-xl font-bold mb-4">Notifications</h2>
      <ul class="list-disc list-inside">
        <li>Low balance alert for Cash account.</li>
        <li>Upcoming credit card payment due in 3 days.</li>
      </ul>
    </section>
  </div>
</body>
</html>
EOF

# Create Accounts Management (accounts.html)
cat << 'EOF' > accounts.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Accounts Management</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto p-4">
    <!-- Header / Navigation -->
    <header class="flex flex-col md:flex-row items-center justify-between mb-6">
      <nav class="flex space-x-4 mb-4 md:mb-0">
         <a href="index.html" class="text-blue-500 hover:underline">Dashboard</a>
         <a href="accounts.html" class="text-blue-500 hover:underline">Accounts</a>
         <a href="transactions.html" class="text-blue-500 hover:underline">Transactions</a>
         <a href="goals.html" class="text-blue-500 hover:underline">Goals</a>
         <a href="record-transaction.html" class="text-blue-500 hover:underline">Record Transaction</a>
      </nav>
      <h1 class="text-2xl font-bold">Accounts Management</h1>
    </header>
    
    <!-- Add New Account Button -->
    <div class="mb-4">
      <button class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Add New Account</button>
    </div>
    
    <!-- Accounts Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="px-4 py-2">Account Name</th>
            <th class="px-4 py-2">Type</th>
            <th class="px-4 py-2">Currency</th>
            <th class="px-4 py-2">Balance</th>
            <th class="px-4 py-2">Spending Limit</th>
            <th class="px-4 py-2">Payment Method</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr class="border-t">
            <td class="px-4 py-2">Checking</td>
            <td class="px-4 py-2">Checking</td>
            <td class="px-4 py-2">USD</td>
            <td class="px-4 py-2">$5,000</td>
            <td class="px-4 py-2">$1,000</td>
            <td class="px-4 py-2">Debit Card</td>
            <td class="px-4 py-2 space-x-2">
              <button class="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600">Edit</button>
              <button class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">Delete</button>
            </td>
          </tr>
          <tr class="border-t">
            <td class="px-4 py-2">Savings</td>
            <td class="px-4 py-2">Savings</td>
            <td class="px-4 py-2">EUR</td>
            <td class="px-4 py-2">€3,500</td>
            <td class="px-4 py-2">€500</td>
            <td class="px-4 py-2">Bank Transfer</td>
            <td class="px-4 py-2 space-x-2">
              <button class="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600">Edit</button>
              <button class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">Delete</button>
            </td>
          </tr>
          <tr class="border-t">
            <td class="px-4 py-2">Credit Card</td>
            <td class="px-4 py-2">Credit Card</td>
            <td class="px-4 py-2">USD</td>
            <td class="px-4 py-2">-$1,200</td>
            <td class="px-4 py-2">$0</td>
            <td class="px-4 py-2">Credit Card</td>
            <td class="px-4 py-2 space-x-2">
              <button class="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600">Edit</button>
              <button class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
EOF

# Create Transaction History (transactions.html)
cat << 'EOF' > transactions.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Transaction History</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto p-4">
    <!-- Header / Navigation -->
    <header class="flex flex-col md:flex-row items-center justify-between mb-6">
      <nav class="flex space-x-4 mb-4 md:mb-0">
         <a href="index.html" class="text-blue-500 hover:underline">Dashboard</a>
         <a href="accounts.html" class="text-blue-500 hover:underline">Accounts</a>
         <a href="transactions.html" class="text-blue-500 hover:underline">Transactions</a>
         <a href="goals.html" class="text-blue-500 hover:underline">Goals</a>
         <a href="record-transaction.html" class="text-blue-500 hover:underline">Record Transaction</a>
      </nav>
      <h1 class="text-2xl font-bold">Transaction History</h1>
    </header>
    
    <!-- Filter Section -->
    <section class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex flex-col">
        <label for="filterDate" class="font-bold mb-1">Date:</label>
        <input type="date" id="filterDate" name="filterDate" class="p-2 border border-gray-300 rounded" />
      </div>
      <div class="flex flex-col">
        <label for="filterCategory" class="font-bold mb-1">Category:</label>
        <select id="filterCategory" name="filterCategory" class="p-2 border border-gray-300 rounded">
          <option value="">All</option>
          <option value="groceries">Groceries</option>
          <option value="entertainment">Entertainment</option>
          <option value="utilities">Utilities</option>
        </select>
      </div>
      <div class="flex flex-col">
        <label for="filterAccount" class="font-bold mb-1">Account:</label>
        <select id="filterAccount" name="filterAccount" class="p-2 border border-gray-300 rounded">
          <option value="">All</option>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="credit">Credit Card</option>
          <option value="cash">Cash</option>
        </select>
      </div>
      <div class="flex flex-col justify-end">
        <button type="button" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Filter</button>
      </div>
    </section>
    
    <!-- Transactions Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="px-4 py-2">Date</th>
            <th class="px-4 py-2">Description</th>
            <th class="px-4 py-2">Account</th>
            <th class="px-4 py-2">Amount</th>
            <th class="px-4 py-2">Category</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr class="border-t">
            <td class="px-4 py-2">2025-02-08</td>
            <td class="px-4 py-2">Grocery Shopping</td>
            <td class="px-4 py-2">Checking</td>
            <td class="px-4 py-2">-$150.00</td>
            <td class="px-4 py-2">Groceries</td>
          </tr>
          <tr class="border-t">
            <td class="px-4 py-2">2025-02-07</td>
            <td class="px-4 py-2">Salary Deposit</td>
            <td class="px-4 py-2">Checking</td>
            <td class="px-4 py-2">$2,000.00</td>
            <td class="px-4 py-2">Income</td>
          </tr>
          <tr class="border-t">
            <td class="px-4 py-2">2025-02-06</td>
            <td class="px-4 py-2">Utility Bill</td>
            <td class="px-4 py-2">Checking</td>
            <td class="px-4 py-2">-$75.00</td>
            <td class="px-4 py-2">Utilities</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
EOF

# Create Financial Goals & Settings (goals.html)
cat << 'EOF' > goals.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Financial Goals & Settings</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto p-4">
    <!-- Header / Navigation -->
    <header class="flex flex-col md:flex-row items-center justify-between mb-6">
      <nav class="flex space-x-4 mb-4 md:mb-0">
         <a href="index.html" class="text-blue-500 hover:underline">Dashboard</a>
         <a href="accounts.html" class="text-blue-500 hover:underline">Accounts</a>
         <a href="transactions.html" class="text-blue-500 hover:underline">Transactions</a>
         <a href="goals.html" class="text-blue-500 hover:underline">Goals</a>
         <a href="record-transaction.html" class="text-blue-500 hover:underline">Record Transaction</a>
      </nav>
      <h1 class="text-2xl font-bold">Financial Goals & Settings</h1>
    </header>
    
    <form class="bg-white shadow rounded-lg p-6">
      <!-- Spending Limits Section -->
      <fieldset class="mb-6">
        <legend class="font-bold mb-2">Spending Limits</legend>
        <div class="mb-4">
          <label for="checkingLimit" class="block font-bold mb-1">Checking Account Limit (USD)</label>
          <input type="number" id="checkingLimit" name="checkingLimit" placeholder="e.g. 1000" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label for="savingsLimit" class="block font-bold mb-1">Savings Account Limit (EUR)</label>
          <input type="number" id="savingsLimit" name="savingsLimit" placeholder="e.g. 500" class="w-full p-2 border border-gray-300 rounded" />
        </div>
      </fieldset>
      
      <!-- Financial Goals Section -->
      <fieldset class="mb-6">
        <legend class="font-bold mb-2">Financial Goals</legend>
        <div class="mb-4">
          <label for="goalType" class="block font-bold mb-1">Goal Type</label>
          <select id="goalType" name="goalType" class="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Goal</option>
            <option value="savings">Savings</option>
            <option value="debt">Debt Repayment</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="goalAmount" class="block font-bold mb-1">Goal Amount</label>
          <input type="number" id="goalAmount" name="goalAmount" placeholder="e.g. 10000" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label for="goalDeadline" class="block font-bold mb-1">Goal Deadline</label>
          <input type="date" id="goalDeadline" name="goalDeadline" class="w-full p-2 border border-gray-300 rounded" />
        </div>
      </fieldset>
      
      <!-- Notification Settings Section -->
      <fieldset class="mb-6">
        <legend class="font-bold mb-2">Notification Settings</legend>
        <div class="mb-4">
          <label class="inline-flex items-center">
            <input type="checkbox" id="lowBalanceNotify" name="lowBalanceNotify" class="form-checkbox" />
            <span class="ml-2">Low Balance Notification</span>
          </label>
        </div>
        <div>
          <label class="inline-flex items-center">
            <input type="checkbox" id="dueDateNotify" name="dueDateNotify" class="form-checkbox" />
            <span class="ml-2">Credit Card Due Date Notification</span>
          </label>
        </div>
      </fieldset>
      
      <div class="flex justify-end space-x-4">
        <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Save Settings</button>
        <button type="reset" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </form>
  </div>
</body>
</html>
EOF

# Create Record New Transaction (record-transaction.html)
cat << 'EOF' > record-transaction.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Record New Transaction</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto p-4">
    <!-- Header / Navigation -->
    <header class="flex flex-col md:flex-row items-center justify-between mb-6">
      <nav class="flex space-x-4 mb-4 md:mb-0">
         <a href="index.html" class="text-blue-500 hover:underline">Dashboard</a>
         <a href="accounts.html" class="text-blue-500 hover:underline">Accounts</a>
         <a href="transactions.html" class="text-blue-500 hover:underline">Transactions</a>
         <a href="goals.html" class="text-blue-500 hover:underline">Goals</a>
         <a href="record-transaction.html" class="text-blue-500 hover:underline">Record Transaction</a>
      </nav>
      <h1 class="text-2xl font-bold">Record New Transaction</h1>
    </header>
    
    <form class="bg-white shadow rounded-lg p-6">
      <!-- Transaction Details -->
      <fieldset class="mb-6">
        <legend class="font-bold mb-2">Transaction Details</legend>
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <div class="flex-1">
            <label for="date" class="block font-bold mb-1">Date</label>
            <input type="date" id="date" name="date" required class="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div class="flex-1">
            <label for="time" class="block font-bold mb-1">Time</label>
            <input type="time" id="time" name="time" required class="w-full p-2 border border-gray-300 rounded" />
          </div>
        </div>
        <div class="mb-4">
          <label for="description" class="block font-bold mb-1">Description / Memo</label>
          <textarea id="description" name="description" rows="2" placeholder="e.g. Grocery shopping at Market Place" class="w-full p-2 border border-gray-300 rounded"></textarea>
        </div>
      </fieldset>
      
      <!-- Accounts & Payment Methods -->
      <fieldset class="mb-6">
        <legend class="font-bold mb-2">Accounts & Payment Methods</legend>
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <div class="flex-1">
            <label for="fromAccount" class="block font-bold mb-1">From Account</label>
            <select id="fromAccount" name="fromAccount" class="w-full p-2 border border-gray-300 rounded">
              <option value="checking">Checking (USD)</option>
              <option value="savings">Savings (EUR)</option>
              <option value="credit">Credit Card (USD)</option>
              <option value="cash">Cash (USD)</option>
            </select>
          </div>
          <div class="flex-1">
            <label for="paymentMethod" class="block font-bold mb-1">Payment Method</label>
            <select id="paymentMethod" name="paymentMethod" class="w-full p-2 border border-gray-300 rounded">
              <option value="cash">Cash</option>
              <option value="debit">Debit Card</option>
              <option value="credit">Credit Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
        </div>
        <div class="mb-4">
          <label for="toAccount" class="block font-bold mb-1">To Account (for transfers)</label>
          <select id="toAccount" name="toAccount" class="w-full p-2 border border-gray-300 rounded">
            <option value="">-- Select Account --</option>
            <option value="checking">Checking (USD)</option>
            <option value="savings">Savings (EUR)</option>
            <option value="credit">Credit Card (USD)</option>
            <option value="cash">Cash (USD)</option>
          </select>
        </div>
      </fieldset>
      
      <!-- Amount & Currency -->
      <fieldset class="mb-6">
        <legend class="font-bold mb-2">Amount & Currency</legend>
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <div class="flex-1">
            <label for="amount" class="block font-bold mb-1">Amount</label>
            <input type="number" id="amount" name="amount" step="0.01" required class="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div class="flex-1">
            <label for="currency" class="block font-bold mb-1">Currency</label>
            <input type="text" id="currency" name="currency" value="USD" readonly class="w-full p-2 border border-gray-300 rounded bg-gray-100" />
          </div>
        </div>
        <div class="mb-4">
          <label for="conversionRate" class="block font-bold mb-1">Conversion Rate (if applicable)</label>
          <input type="number" id="conversionRate" name="conversionRate" step="0.0001" placeholder="Enter conversion rate" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label for="convertedAmount" class="block font-bold mb-1">Converted Amount</label>
          <input type="text" id="convertedAmount" name="convertedAmount" placeholder="Auto-calculated" readonly class="w-full p-2 border border-gray-300 rounded bg-gray-100" />
        </div>
      </fieldset>
      
      <!-- Double-Entry Accounting Details -->
      <fieldset class="mb-6">
        <legend class="font-bold mb-2">Double-Entry Accounting Details</legend>
        <details class="p-2 border border-gray-300 rounded">
          <summary class="font-bold cursor-pointer">Show Double-Entry Details</summary>
          <div class="flex flex-col md:flex-row gap-4 mt-4">
            <div class="flex-1">
              <label for="debitAccount" class="block font-bold mb-1">Debit Account</label>
              <input type="text" id="debitAccount" name="debitAccount" placeholder="Debit Account" readonly class="w-full p-2 border border-gray-300 rounded bg-gray-100" />
            </div>
            <div class="flex-1">
              <label for="debitAmount" class="block font-bold mb-1">Debit Amount</label>
              <input type="number" id="debitAmount" name="debitAmount" step="0.01" placeholder="0.00" readonly class="w-full p-2 border border-gray-300 rounded bg-gray-100" />
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-4 mt-4">
            <div class="flex-1">
              <label for="creditAccount" class="block font-bold mb-1">Credit Account</label>
              <input type="text" id="creditAccount" name="creditAccount" placeholder="Credit Account" readonly class="w-full p-2 border border-gray-300 rounded bg-gray-100" />
            </div>
            <div class="flex-1">
              <label for="creditAmount" class="block font-bold mb-1">Credit Amount</label>
              <input type="number" id="creditAmount" name="creditAmount" step="0.01" placeholder="0.00" readonly class="w-full p-2 border border-gray-300 rounded bg-gray-100" />
            </div>
          </div>
        </details>
      </fieldset>
      
      <!-- Categorization & Tagging -->
      <fieldset class="mb-6">
        <legend class="font-bold mb-2">Categorization & Tagging</legend>
        <div class="mb-4">
          <label for="category" class="block font-bold mb-1">Category</label>
          <select id="category" name="category" class="w-full p-2 border border-gray-300 rounded">
            <option value="groceries">Groceries</option>
            <option value="entertainment">Entertainment</option>
            <option value="utilities">Utilities</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="tags" class="block font-bold mb-1">Tags (comma separated)</label>
          <input type="text" id="tags" name="tags" placeholder="e.g. Vacation, Emergency Fund" class="w-full p-2 border border-gray-300 rounded" />
        </div>
      </fieldset>
      
      <!-- Notifications & Goals -->
      <fieldset class="mb-6">
        <legend class="font-bold mb-2">Notifications & Goals</legend>
        <div class="mb-4">
          <label class="inline-flex items-center">
            <input type="checkbox" id="budgetAlert" name="budgetAlert" class="form-checkbox" />
            <span class="ml-2">Budget Alert</span>
          </label>
        </div>
        <div class="mb-4">
          <label class="inline-flex items-center">
            <input type="checkbox" id="lowBalanceAlert" name="lowBalanceAlert" class="form-checkbox" />
            <span class="ml-2">Low Balance Alert</span>
          </label>
        </div>
        <div class="mb-4">
          <label for="financialGoal" class="block font-bold mb-1">Link to Financial Goal</label>
          <select id="financialGoal" name="financialGoal" class="w-full p-2 border border-gray-300 rounded">
            <option value="">-- None --</option>
            <option value="savings">Savings</option>
            <option value="debt">Debt Repayment</option>
          </select>
        </div>
      </fieldset>
      
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Save Transaction</button>
        <button type="reset" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </form>
  </div>
</body>
</html>
EOF

echo "All files created successfully!"
echo "Open index.html in your browser to view the Dashboard."
