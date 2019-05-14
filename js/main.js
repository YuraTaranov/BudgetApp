'use strict';

let startBtn = document.getElementById("start"),
	budgetValue = document.getElementsByClassName('budget-value')[0],
	dayBudgetValue = document.getElementsByClassName('daybudget-value')[0],
	levelValue = document.getElementsByClassName('level-value')[0],
	expensesValue = document.getElementsByClassName('expenses-value')[0],
	optionalExpensesValue = document.getElementsByClassName('optionalexpenses-value')[0],
	incomeValue = document.getElementsByClassName('income-value')[0],
    monthSavingsValue = document.getElementsByClassName('monthsavings-value')[0],
    yearSavingsValue = document.getElementsByClassName('yearsavings-value')[0],

    expensesItem = document.getElementsByClassName('expenses-item'),
    buttonAll = document.getElementsByTagName('button'),
	expensesBtn = document.getElementsByTagName('button')[0],
	optionalExpensesBtn = document.getElementsByTagName('button')[1],
    countBtn = document.getElementsByTagName('button')[2],
    optionalExpensesItem = document.querySelectorAll('.optionalexpenses-item'),
	incomeItem = document.querySelector('.choose-income'),
	checkSavings = document.querySelector('#savings'),
	sumValue = document.querySelector('.choose-sum'),
    percentValue = document.querySelector('.choose-percent'),
    yearValue = document.querySelector('.year-value'),
    monthValue = document.querySelector('.month-value'),
    dayValue = document.querySelector('.day-value');

    let money, time;

    expensesBtn.disabled = true;
    optionalExpensesBtn.disabled = true;
    countBtn.disabled = true;

    startBtn.addEventListener('click', function() {
        let pattern = /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/;

        time = prompt("Введите дату в формате YYYY-MM-DD", dateNow());
        money = +prompt("Ваш доход за месяц?", "50000");

        function dateNow () {
            let today = new Date(),
                dd = today.getDate(),
                mm = today.getMonth() + 1,
                yyyy = today.getFullYear();

                if (mm < 10) mm = '0' + mm;
                if (dd < 10) dd = '0' + dd;
            
            today = yyyy + '-' + mm + '-' + dd;
            return today;
        }
        while ( isNaN(money) || money == '' || money == null || money.toString().length > 9 ) {
            money = +prompt("Ваш доход за месяц?", "50000");
        }
        while (time == '' || time == null || time == 0 || !pattern.test(time)) {
            time = prompt("Введите дату в формате YYYY-MM-DD", dateNow());
        }

        appData.budget = money;
        appData.timeData = time;
        budgetValue.textContent = money.toFixed();
        yearValue.value = new Date(Date.parse(time)).getFullYear();
        monthValue.value = new Date(Date.parse(time)).getMonth() + 1;
        dayValue.value = new Date(Date.parse(time)).getDate();

        expensesBtn.disabled = false;
        optionalExpensesBtn.disabled = false;
        countBtn.disabled = false;
    });

    expensesBtn.addEventListener('click', function() {
        let sum = 0;

        for (let i = 0; i < expensesItem.length; i++) {
            let a = expensesItem[i].value;
            let b = +expensesItem[++i].value;
    
            if ( a != '' && b != '' && b != 0 && a.length < 50 && (typeof(b)) === 'number' && isNaN(b)==false)  {
                appData.expenses[a] = b;
                sum += +b;
                expensesValue.textContent = sum;
                appData.expVal = sum;
            } else {
                expensesValue.textContent = 'Неверные данные';
                i--;
                break;
            }
        };
    });

    optionalExpensesBtn.addEventListener('click', function() {
        optionalExpensesValue.textContent = '';

        for (let i = 0; i < optionalExpensesItem.length; i++) {
            let optExp = optionalExpensesItem[i].value;

            if ( optExp != '' && optExp.length <= 30 ) {
                appData.optionalExpenses[i] = optExp;
                optionalExpensesValue.textContent += appData.optionalExpenses[i] + ' ';
            } else if (optExp.length >= 30) {
                optionalExpensesValue.textContent = 'Превышен лимит символов';
                i--;
                break;
            } else {
                optionalExpensesValue.textContent = 'Введите данные в поле';
                i--;
                break;
            };
        }   
    });

    countBtn.addEventListener('click', function() {

        if (appData.budget != undefined && appData.expVal != undefined) {
            appData.moneyPerDay = Math.round( (appData.budget - +appData.expVal) / 30 );
            dayBudgetValue.textContent = appData.moneyPerDay;

            if (appData.moneyPerDay < 100) {
                levelValue.textContent = "Минимальный уровень достатка";
            } else if (appData.moneyPerDay > 100 && appData.moneyPerDay < 2000) {
                levelValue.textContent = 'Средний уровень достатка';
            } else if (appData.moneyPerDay > 2000) {
                levelValue.textContent = 'Высокий уровень достатка';
            } else {
                levelValue.textContent = 'Ошибка';
            };
        } else {
            dayBudgetValue.textContent = 'Для начала нажмите кнопку "Начать расчет" и заполните обязательные расходы';
        };
    });

    incomeItem.addEventListener('input', function() {
        let items = incomeItem.value;

        if (items.length < 70) {
            appData.income = items;
            incomeValue.textContent = appData.income;
        } else {
            incomeValue.textContent = 'Превышен лимит допустимого количества символов';
        }
        
    });

    sumValue.addEventListener('input', checkSav);
    percentValue.addEventListener('input', checkSav);
    
    function checkSav() {
        if (checkSavings.checked) {
            let sum = +sumValue.value;
            let percent = +percentValue.value;

            if ( typeof(sum) === 'number' && typeof(percent) === 'number' && isNaN(sum)==false && isNaN(percent)==false
            && sum.toString().length <= 9 && percent.toString().length <= 5) {
                appData.monthIncome = (sum / 100 / 12 * percent).toFixed(1);
                appData.yearIncome = (sum / 100 * percent).toFixed(1);
    
                monthSavingsValue.textContent = appData.monthIncome;
                yearSavingsValue.textContent = appData.yearIncome;
            } else if (sum.toString().length >= 9 || percent.toString().length >= 5) {
                monthSavingsValue.textContent = 'Превышен лимит символов';
                yearSavingsValue.textContent = '';
            } else {
                monthSavingsValue.textContent = 'Введите сумму и процент в цифрах';
                yearSavingsValue.textContent = '';
            }
        } else {
            monthSavingsValue.textContent = 'Поставьте галочку в вопросе о накоплениях';
            yearSavingsValue.textContent = '';
        }
    }
    
    let appData = {
        budget: money,
        timeData: time,
        expenses: {},
        optionalExpenses: {},
        income: []
    };