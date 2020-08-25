const balanceEl = document.querySelector('.balance .value')
const incomeTotalEl = document.querySelector('.income-total')
const outcomeTotalEl = document.querySelector('.outcome-total')
const chartEl = document.querySelector('.chart')

const expenseBtn = document.querySelector('.tab1')
const incomeBtn = document.querySelector('.tab2')
const allBtn = document.querySelector('.tab3')

const expenseEl = document.querySelector('#expense')
const incomeEl = document.querySelector('#income')
const allEl = document.querySelector('#all')

const expenseList = document.querySelector('#expense .list')
const incomeList = document.querySelector('#income .list')
const allList = document.querySelector('#all .list')

const expenseTitle = document.querySelector('#expense-title-input')
const expenseAmount = document.querySelector('#expense-amount-input')
const addExpense = document.querySelector('.add-expense')

const incomeTitle = document.querySelector('#income-title-input')
const incomeAmount = document.querySelector('#income-amount-input')
const addIncome = document.querySelector('.add-income')

let ENRTY_LIST = []

expenseBtn.addEventListener('click', () => {
    active(expenseBtn)
    inactive([incomeBtn, allBtn])
    show(expenseEl)
    hide([incomeEl, allEl])
})

incomeBtn.addEventListener('click', () => {
    active(incomeBtn)
    inactive([expenseBtn, allBtn])
    show(incomeEl)
    hide([expenseEl, allEl])
})

allBtn.addEventListener('click', () => {
    active(allBtn)
    inactive([expenseBtn, incomeBtn])
    show(allEl)
    hide([expenseEl, incomeEl])
})

addIncome.addEventListener('click', () => {
    if(!incomeTitle.value || !incomeAmount.value) return
    let income = {
        type: "income",
        title: incomeTitle.value,
        amount: parseFloat(incomeAmount.value),
    }
    ENRTY_LIST.push(income)
    updateUI()
    clearInput([incomeTitle, incomeAmount])
})

addExpense.addEventListener('click', () => {
    if(!expenseTitle.value || !expenseAmount.value) return
    let expense = {
        type: "expense",
        title: expenseTitle.value,
        amount: parseFloat(expenseAmount.value),
    }
    ENRTY_LIST.push(expense)
    updateUI()
    clearInput([expenseTitle, expenseAmount])
})

incomeList.addEventListener('click', deleteOrEdit)
expenseList.addEventListener('click', deleteOrEdit)
allList.addEventListener('click', deleteOrEdit)

function active(element) {
    element.classList.add('active')
}

function show(element) {
    element.classList.remove('hide')
}

function hide(elementsArray) {
    elementsArray.forEach(element => {
        element.classList.add('hide')
    })
}

function inactive(elementsArray) {
    elementsArray.forEach(element => {
        element.classList.remove('active')
    })
}

function clearInput(inputsArray) {
    inputsArray.forEach(input => {
        input.value = ''
    })
}

function calculateTotal(type, ENRTY_LIST) {
    let sum = 0
    ENRTY_LIST.forEach(entry => {
        if(entry.type == type) {
            sum += entry.amount
        }
    })
    return sum
}

function calculateBalance(income, outcome) {
    return income - outcome
}

function showEntry(list, type, title, amount, id) {
    const entry = `<li id="${id}" class="${type}">
                        <div class="entry">${title} : $${amount}</div>
                        <div id="edit"><i class="fas fa-edit"></i></div>
                        <div id="delete"><i class="fas fa-trash"></i></div>
                    </li>`
    const position = "afterbegin"
    list.insertAdjacentHTML(position, entry)
}

function updateUI() {
    income = calculateTotal("income", ENRTY_LIST)
    outcome = calculateTotal("expense", ENRTY_LIST)
    balance = Math.abs(calculateBalance(income, outcome))

    let sign = (income >= outcome) ? "$" : "-$"

    balanceEl.innerHTML = `<small>${sign}</small>${balance}`
    incomeTotalEl.innerHTML = `<small>$</small>${income}`
    outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`

    clearElement([incomeList, expenseList, allList])

    ENRTY_LIST.forEach((entry, index) => {
        if(entry.type == "income") {
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        } else if (entry.type == "expense") {
            showEntry(expenseList, entry.type, entry.title, entry.amount, index)
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index)
    })

}

function clearElement(elementsArray) {
    elementsArray.forEach(element => {
        element.innerHTML = ''
    })
}

function deleteEntry(ENTRY) {
    ENRTY_LIST.splice(ENTRY.id, 1)
    updateUI
}

function editEntry(ENTRY) {
    let entry = ENRTY_LIST[ENTRY.id]
    if(entry.type == "income") {
        incomeAmount.value = entry.amount
        incomeTitle.value = entry.title
    } else if (entry.type = "expense") {
        expenseAmount.value = entry.amount
        expenseTitle.value = entry.title
    }
    deleteEntry(ENTRY)
}

function deleteOrEdit(event) {
    const targetBtn = event.target
    const ENTRY = targetBtn.parentNode.parentNode
    if(targetBtn.className == "fas fa-trash") {
        deleteEntry(ENTRY)
    } else if (targetBtn.className == "fas fa-edit") {
        editEntry(ENTRY)
    }
    console.log(event)
}

