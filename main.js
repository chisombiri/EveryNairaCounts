const balance = document.querySelector('#balance');
const money_income = document.querySelector('#money-income');
const money_expense = document.querySelector('#money-expense');
const hist = document.querySelector('#hist');
const form = document.querySelector('#form');
const text = document.querySelector('#text');
const amount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

//Adding transaction before updating DOM
function addTransaction(e){
    e.preventDefault();

    if(text.value.trim() === '' || amount.value.trim() === ''){
        alert('Please add a transaction and amount')
    } else{
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        }

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        //Update values in the add form back to nothing
        text.value = '';
        amount.value = '';
    }
}

//Function to generate id for transaction
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

//Adding transactions to history on DOM
function addTransactionDOM(transaction){
    //Get income or expense
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    //Add class based on -ve or +ve value
    item.classList.add(transaction.amount < 0 ? 'expense' :  'income');

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
    `;

    hist.appendChild(item);
}

//Function to update total balance, income and ecpence
function updateValues(){
    const amounts = transactions.map(transaction => transaction.amount);

    const totalBalance = amounts.reduce((accumulator, item) => (accumulator += item), 0).toFixed(2);

    const income = amounts.filter(item => item > 0).reduce((accumulator, item) => (accumulator += item), 0).toFixed(2);

    const expense = (amounts.filter(item => item < 0).reduce((accumulator, item) => (accumulator += item), 0) * -1).toFixed(2);

    //Updating balance, income and expense on DOM
    balance.innerText = `₦${totalBalance}`;

    money_income.innerText = `₦${income}`;

    money_expense.innerText = `₦${expense}`;
}

//Function to remove transactions using id
function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

//Function to update local storage transactions
function updateLocalStorage(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

//Initialize app to add transaction from local storage to DOM
function init() {
    hist.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    
    updateValues();
}

init();

form.addEventListener('submit', addTransaction);