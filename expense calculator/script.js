
let addBtn = document.getElementById("add-trans");
let editingTransaction = null;
let totalBalance = 0;
let transactions = [];
let deleteAll = document.getElementById("DeleteAll")


function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});


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
    editingTransaction = null;
  } else {
    const transactionObj = { title, category: badge, amount, date };
    transactions.push(transactionObj);
    renderTransaction(transactionObj);
    updateBalance(parseFloat(amount));
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
    const toShow =selected === "all"? transactions: transactions.filter((t) => t.category === selected);
    toShow.forEach(renderTransaction);
  });
}
const datefilter = document.getElementById("dateSelec");
if (datefilter) {
  datefilter.addEventListener("change", () => {
    const selected = datefilter.value;
    document.querySelectorAll(".transaction").forEach((el) => el.remove());
    const toShow = selected === "today"? transactions: transactions.filter((t) => t.date === selected);
    toShow.forEach(renderTransaction);
  });
}