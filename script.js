"use strict";

const errorMesgEl = document.querySelector(".error_message");
const budgetInputEl = document.querySelector(".budget_input");
const expenseDelEl = document.querySelector(".expenses_input");
const expenseAmountEl = document.querySelector(".expenses_amount");
const tblRecordEl = document.querySelector(".tbl_data");
const cardsContainer = document.querySelector(".cards");

// Cards content
const budgetCardEl = document.querySelector(".budget_card");
const expensesCardEl = document.querySelector(".expenses_card");
const balanceCardEl = document.querySelector(".balance_card");

let itemList = [];
let totalBudget = 0;

// -------- Button Events
function btnEvents() {
  const btnBudgetCal = document.querySelector("#btn_budget");
  const btnExpensesCal = document.querySelector("#btn_expenses");

  // Budget event
  btnBudgetCal.addEventListener("click", (e) => {
    e.preventDefault();
    updateBudget();
  });

  // Expense event
  btnExpensesCal.addEventListener("click", (e) => {
    e.preventDefault();
    addExpense();
  });
}

// -------- Calling Button Events
document.addEventListener("DOMContentLoaded", btnEvents);

// ------------ Update Budget
function updateBudget() {
  const budgetValue = parseInt(budgetInputEl.value.trim(), 10);

  if (isNaN(budgetValue) || budgetValue <= 0) {
    displayError("Please enter a valid budget amount greater than 0.");
    return;
  }

  totalBudget += budgetValue; // Add new budget value to the existing total
  budgetCardEl.textContent = totalBudget; // Update budget card
  budgetInputEl.value = ""; // Clear input field
  updateBalance(); // Update balance after changing the budget
}

// ------------ Add Expense
function addExpense() {
  const expenseDescValue = expenseDelEl.value.trim();
  const expenseAmountValue = parseInt(expenseAmountEl.value.trim(), 10);

  if (!expenseDescValue || isNaN(expenseAmountValue) || expenseAmountValue <= 0) {
    displayError("Please enter a valid expense description and amount.");
    return;
  }

  // Store the expense in the list
  const expense = {
    id: itemList.length, // Assign sequential ID
    title: expenseDescValue,
    amount: expenseAmountValue,
  };
  itemList.push(expense);

  // Re-render the expense list
  renderExpenses();

  // Clear input fields
  expenseDelEl.value = "";
  expenseAmountEl.value = "";
  updateBalance();
}

// ------------ Render All Expenses
function renderExpenses() {
  // Clear existing records
  tblRecordEl.innerHTML = "";

  // Reassign IDs and render the list
  itemList.forEach((expense, index) => {
    expense.id = index; // Ensure IDs are sequential
    const html = `
      <ul class="tbl_tr_content" data-id="${expense.id}">
        <li>${expense.id + 1}</li>
        <li>${expense.title}</li>
        <li><span>$</span>${expense.amount}</li>
        <li>
          <button type="button" class="btn_edit">Edit</button>
          <button type="button" class="btn_delete">Delete</button>
        </li>
      </ul>`;
    tblRecordEl.insertAdjacentHTML("beforeend", html);
  });

  // Add event listeners for Edit and Delete buttons
  document.querySelectorAll(".btn_edit").forEach((btn, index) =>
    btn.addEventListener("click", () => editExpense(index))
  );

  document.querySelectorAll(".btn_delete").forEach((btn, index) =>
    btn.addEventListener("click", () => deleteExpense(index))
  );
}

// ------------ Edit Expense
function editExpense(id) {
  const expense = itemList[id];

  if (expense) {
    expenseDelEl.value = expense.title;
    expenseAmountEl.value = expense.amount;

    // Remove the expense from the list
    itemList.splice(id, 1);

    // Re-render the expense list
    renderExpenses();
    updateBalance();
  }
}

// ------------ Delete Expense
function deleteExpense(id) {
  // Remove the expense from the list
  itemList.splice(id, 1);

  // Re-render the expense list
  renderExpenses();
  updateBalance();
}

// ------------ Update Balance
function updateBalance() {
  const totalExpenses = itemList.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalBudget - totalExpenses;

  expensesCardEl.textContent = totalExpenses; // Update expenses card
  balanceCardEl.textContent = balance; // Update balance card
}

// ------------ Display Error Message
function displayError(message) {
  errorMesgEl.innerHTML = `<p>${message}</p>`;
  errorMesgEl.classList.add("error");
  setTimeout(() => {
    errorMesgEl.classList.remove("error");
  }, 2500);
}

// ------------ Delete Expense with Confirmation
// ------------ Delete Expense with Confirmation
function deleteExpense(id) {
  const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
  if (!confirmDelete) return; // Stop deletion if user cancels

  // Remove the expense from the list
  itemList = itemList.filter((item) => item.id !== id);

  // Remove the expense from the UI
  const expenseElement = document.querySelector(`.tbl_tr_content[data-id="${id}"]`);
  if (expenseElement) expenseElement.remove();

  // Reassign IDs after deletion
  updateExpenseIds();

  // Update balance after deletion
  updateBalance();
}




function deleteExpense(id) {
  const popup = document.getElementById("confirmPopup");
  popup.style.display = "flex"; // Show the popup

  // Handle "Yes" button
  document.getElementById("confirmYes").onclick = function () {
    // Remove the expense from the list
    itemList = itemList.filter((item) => item.id !== id);

    // Remove from UI
    const expenseElement = document.querySelector(`.tbl_tr_content[data-id="${id}"]`);
    if (expenseElement) expenseElement.remove();

    // Reassign IDs after deletion
    updateExpenseIds();

    // Update balance
    updateBalance();

    // Hide the popup
    popup.style.display = "none";
  };

  // Handle "No" button
  document.getElementById("confirmNo").onclick = function () {
    popup.style.display = "none"; // Close popup without deleting
  };
}

// Function to reassign IDs correctly after deletion
function updateExpenseIds() {
  itemList.forEach((item, index) => {
    item.id = index; // Assign new sequential IDs
  });

  // Update HTML elements
  const expenseRows = document.querySelectorAll(".tbl_tr_content");
  expenseRows.forEach((row, index) => {
    row.dataset.id = index;
    row.children[0].textContent = index + 1; // Update displayed ID
  });
}
