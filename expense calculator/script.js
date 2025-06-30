let addBtn = document.getElementById("add-trans");
let editingTransaction = null;
let totalBalance = 0;
let transactions = [];
let expenseTotal = 0
let catExpense = document.getElementById("catExpense")
let deleteAll = document.getElementById("Deletebtn");



function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("totalBalance", totalBalance);
}

function loadFromLocalStorage() {
  const storedTransactions = localStorage.getItem("transactions");
  const storedBalance = localStorage.getItem("totalBalance");
  transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
  totalBalance = storedBalance ? parseFloat(storedBalance) : 0;
}

function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});
if (deleteAll) {
  deleteAll.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all transactions?")) {
      transactions = [];
      totalBalance = 0;
      localStorage.removeItem("transactions");
      localStorage.removeItem("totalBalance");

      document.getElementById("balance").textContent = `$0.00`;
      document.getElementById("right-panel").innerHTML = "";
    }
  });
}

const logoutBtn = document.getElementById("logOut");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {

    window.location.href = "page1.html";
  });
}
addBtn.addEventListener("click", () => {
  const titleInput = document.getElementById("title");
  const badgeSelect = document.getElementById("category");
  const amountInput = document.getElementById("amount");
  const dateInput = document.getElementById("date");

  const title = titleInput.value.trim();
  const badge = badgeSelect.value;
  const amount = amountInput.value.trim();
  const date = dateInput.value;

  if (title === "" || amount === "") {
    alert("Please fill all fields");
    return;
    
  }
  

  if (editingTransaction) {
    editingTransaction.querySelector(".title").textContent = `➡️ ${title}`;
    editingTransaction.querySelector(".badge").textContent = badge;
    editingTransaction.querySelector(".amount").textContent = `$${amount}`;
    editingTransaction.querySelector(".Tdate").textContent = date;
    setBadgeColor(editingTransaction.querySelector(".badge"), badge);

    // Update the transaction in the array
    const idx = Array.from(document.querySelectorAll(".transaction")).indexOf(
      editingTransaction
    );
    if (idx > -1) {
      // Adjust balance
      totalBalance -= parseFloat(transactions[idx].amount);
      totalBalance += parseFloat(amount);
      transactions[idx] = { title, category: badge, amount, date };
      saveToLocalStorage();
      updateBalance(0); // Just update display
    }
    editingTransaction = null;
  } else {
    const transactionObj = { title, category: badge, amount, date };
    transactions.push(transactionObj);
    renderTransaction(transactionObj);
    updateBalance(parseFloat(amount));
    saveToLocalStorage();
  }

  titleInput.value = "";
  badgeSelect.value = "bill";
  amountInput.value = "";
  dateInput.value = "Today";
  closeModal();
});

function renderTransaction(data) {
  const transaction = document.createElement("div");
  transaction.classList.add("transaction");
  transaction.innerHTML = `
    <span class="title">➡️ ${data.title}</span>
    <span class="badge">${data.category}</span>
    <span class="amount">$${data.amount}</span>
    <span class="Tdate">${data.date}</span>
    <div class="btns">
      <a href="#"><i class="fa-solid fa-pen edit"></i></a>
      <a href="#"><i class="fa-solid fa-trash trash"></i></a>
    </div>
  `;

  const badgeElement = transaction.querySelector(".badge");
  setBadgeColor(badgeElement, data.category);

  transaction.querySelector(".trash").addEventListener("click", () => {
    const amtValue = parseFloat(data.amount);
    totalBalance -= amtValue;
    document.getElementById("balance").textContent = `$${totalBalance.toFixed(
      2
    )}`;
    transactions = transactions.filter((t) => t !== data);
    transaction.remove();
    saveToLocalStorage();
  });

  transaction.querySelector(".edit").addEventListener("click", () => {
    document.getElementById("title").value = data.title;
    document.getElementById("category").value = data.category;
    document.getElementById("amount").value = data.amount;
    document.getElementById("date").value = data.date;
    openModal();
    editingTransaction = transaction;
  });

  document.getElementById("right-panel").appendChild(transaction);
}

function updateBalance(amt) {
  totalBalance += amt;
  document.getElementById("balance").textContent = `$${totalBalance.toFixed(
    2
  )}`;
  saveToLocalStorage();
}

function setBadgeColor(badgeElement, category) {
  switch (category) {
    case "rent":
      badgeElement.style.backgroundColor = "orange";
      break;
    case "bill":
      badgeElement.style.backgroundColor = "blue";
      break;
    case "grocery":
      badgeElement.style.backgroundColor = "green";
      break;
    case "others":
      badgeElement.style.backgroundColor = "red";
      break;
    default:
      badgeElement.style.backgroundColor = "gray";
  }
}

const filterSelect = document.getElementById("filter");

if (filterSelect) {
  filterSelect.addEventListener("change", () => {
    const selected = filterSelect.value;
    document.querySelectorAll(".transaction").forEach((el) => el.remove());

    const toShow =
      selected === "all"
        ? transactions
        : transactions.filter((t) => t.category === selected);
    let expenseTotal = 0;
    toShow.forEach((t) => {
      expenseTotal += parseFloat(t.amount);
    });
    if (catExpense) {
      catExpense.textContent = `Category Expense: $${expenseTotal.toFixed(2)}`;
    }
    toShow.forEach(renderTransaction);
  });
}
const datefilter = document.getElementById("dateSelec");
if (datefilter) {
  datefilter.addEventListener("change", () => {
    const selected = datefilter.value;
    document.querySelectorAll(".transaction").forEach((el) => el.remove());
    const toShow =
      selected === "today"
        ? transactions
        : transactions.filter((t) => t.date === selected);
    toShow.forEach(renderTransaction);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  document.getElementById("balance").textContent = `$${totalBalance.toFixed(2)}`;
  transactions.forEach(renderTransaction);
});
