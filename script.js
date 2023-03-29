'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Juan Sánchez',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'María Portazgo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Estefanía Pueyo',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Javier Rodríguez',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let sorted = false;
let currentAccount, timer, saldo, inside;

//init app
const createUsernames = () => {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};



console.log(accounts);
createUsernames();



btnLogin.addEventListener('click', (e) => {
  //prevent form from submitting
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  console.log(`Intento de login con usuario ${username} y el pin ${pin}`);

//recorre las cuentas (accounts) y busca el que coincida con el username
// compara el pin, puede ser nulo si user no existe
currentAccount = accounts.find(
  (account) => account.username === username
);


if (currentAccount?.pin === pin) {
  console.log('Datos correctos')
  labelWelcome.textContent = `Bienvenido ${
    currentAccount.owner.split(" ")[0]
  }`
  containerApp.style.opacity = 100;
  inputLoginUsername.value = inputLoginPin.value = "";

    inputLoginPin.blur();

    updateUI(currentAccount);
    
    }
    inside=true;
});

const updateUI = (currentAccount) => {
 // const { movements } = currentAccount;
  

  displayMovements(currentAccount);
  
  //mostrar balance
  calcAndDisplayBalance(currentAccount.movements);

  //mostrar resumen
  calcAndDisplaySummary(currentAccount);

}

const displayMovements = (currentAccount) => {
  const { movements } = currentAccount
  containerMovements.innerHTML = "";


  movements.forEach((mov, i) => {

    const type =mov>0 ? "deposit" : "withdrawal";

    const html = `<div class="movements__row">
                      <div class="movements__type movements__type--${type}">
                        ${i + 1} ${type}
                      </div>
                      <div class="movements__value">${mov.toFixed(2)}€</div>
                    </div>`;

                    containerMovements.insertAdjacentHTML("afterbegin", html);


  });
}


const calcAndDisplayBalance = (movements) => {

   const balance = movements.reduce((acc, mov) => acc + mov, 0);

    labelBalance.textContent = `${balance.toFixed(2)}€`;
    saldo = balance;
  };
  
  console.log(saldo);


const calcAndDisplaySummary  = (currentAccount) =>{
  const { movements } = currentAccount;

  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov)=> acc + mov, 0)
    labelSumIn.textContent= `${incomes.toFixed(2)}€`;

  const out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov)=> acc + mov, 0)
    labelSumOut.textContent= `${Math.abs(out).toFixed(2)}€`;

    //calculo de intereses:
    //teniendo en cuenta solo ingresos superiores a 100€
    //y que el in teres es de cada usuario
    //y que los intereses sean superiores a 2€

   const interest = movements
    .filter((mov) => mov > 100)
    .map((mov) => (mov * currentAccount.interestRate) / 100)
    .filter((int) => int >= 2)
    .reduce((acc, interest) => acc + interest, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}€`;
    
    }


    btnTransfer.addEventListener('click', function (e) {
      e.preventDefault();
      const amountTransfer = Number(inputTransferAmount.value);
      const recieverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value
      );

      
      if (
        amountTransfer > 0 &&
        recieverAcc &&
        saldo >= amountTransfer &&
        recieverAcc?.username !== currentAccount.username
      ) {


        currentAccount.movements.push(-amountTransfer);
        recieverAcc.movements.push(amountTransfer);
        //Add transfer Date
        //currentAccount.movementsDates.push(new Date());
        //recieverAcc.movementsDates.push(new Date());
        updateUI(currentAccount);
      }
      inputTransferAmount.value  = inputTransferTo.value = '';
      inputTransferTo.blur();
     
    });

    btnLoan.addEventListener('click', function (e) {
      e.preventDefault();
      const request = Number(inputLoanAmount.value);
      if ( request > 0)
        
          currentAccount.movements.push(request);
          saldo +=request;
          updateUI(currentAccount);
      
      inputLoanAmount.value = '';
      inputLoanAmount.blur();
    });

    btnClose.addEventListener('click', function (e) {
      e.preventDefault();
      const accUserName = inputCloseUsername.value;
      const accPin = Number(inputClosePin.value);
      if (
        accUserName === currentAccount.username &&
        accPin === currentAccount.pin
      ) {
        accounts.splice(
          accounts.findIndex(acc => acc === currentAccount),
          1
        );
        currentAccount = '';
        containerApp.style.opacity = 0;
        labelWelcome.textContent = 'Inicia Sesion';
      }
      inputCloseUsername.value = inputClosePin.value = '';
    });