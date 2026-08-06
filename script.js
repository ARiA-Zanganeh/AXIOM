let firstNumber = "";
let operator = "";
let secondNumber = "";
let result = "";
let shouldResetDisplay = false;

const MAX_DIGITS = 12;

const display = document.getElementById("display");
const history = document.getElementById("history");
const themeToggle = document.getElementById("themeToggle");

const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");

const clearBtn = document.querySelector(".clear");
const deleteBtn = document.querySelector(".delete");
const equalBtn = document.querySelector(".equal");


// ---------- Display helpers ----------

// Adjusts the display font size based on how many characters are shown
function updateFontSize(){
    const len = display.textContent.length;
    if(len > 14){
        display.style.fontSize = "2.2rem";
    } else if(len > 10){
        display.style.fontSize = "2.6rem";
    } else {
        display.style.fontSize = "3rem";
    }
}

// Updates the small faded history line above the display
function updateHistory(text){
    history.textContent = text || "\u00A0"; // non-breaking space keeps the height when empty
}


// ---------- Core calculator logic (shared by both mouse clicks and keyboard) ----------

// Handles typing a digit or a dot
function inputDigit(value){

    if(shouldResetDisplay){
        display.textContent = "0";
        shouldResetDisplay = false;
    }

    // Prevent multiple dots
    if(value === "." && display.textContent.includes(".")){
        return;
    }

    // Stop adding digits once the max length is reached
    const digitsOnly = display.textContent.replace("-", "").replace(".", "");
    if(digitsOnly.length >= MAX_DIGITS && display.textContent !== "0"){
        return;
    }

    // If dot is pressed first
    if(value === "." && display.textContent === "0"){
        display.textContent = "0.";
    }

    // If display currently shows the initial zero
    else if(display.textContent === "0"){
        display.textContent = value;
    }

    // Append the digit
    else {
        display.textContent += value;
    }

    updateFontSize();
}

// Handles pressing an operator (+, -, ×, ÷)
function inputOperator(op){

    // If there's already a first number and operator, calculate the running total first
    if(firstNumber !== "" && operator !== ""){
        secondNumber = display.textContent;
        calculate();
        firstNumber = result;
    }

    else{
        firstNumber = display.textContent;
    }

    operator = op;

    // Show the running expression in the history strip
    updateHistory(firstNumber + " " + operator);

    display.textContent = "0";
    updateFontSize();
}

// Clears everything back to the initial state
function clearAll(){
    display.textContent = "0";
    firstNumber = "";
    secondNumber = "";
    operator = "";
    result = "";
    shouldResetDisplay = false;
    updateFontSize();
    updateHistory("");
}

// Deletes the last character
function deleteLast(){
    if(display.textContent.length > 1){
        display.textContent = display.textContent.slice(0,-1);
    }
    else{
        display.textContent = "0";
    }
    updateFontSize();
}

// Calculate function - performs the math based on the selected operator
function calculate(){

    if(operator === "+"){
        result = Number(firstNumber) + Number(secondNumber);
    }

    else if(operator === "-"){
        result = Number(firstNumber) - Number(secondNumber);
    }

    else if(operator === "×"){
        result = Number(firstNumber) * Number(secondNumber);
    }

    else if(operator === "÷"){

        if(Number(secondNumber) === 0){
            result = "Error";
        }

        else{
            result = Number(firstNumber) / Number(secondNumber);
        }
    }

    return result;
}

// Handles the equal action
function inputEqual(){

    if(operator === "" || firstNumber === ""){
        return; // nothing to calculate yet
    }

    secondNumber = display.textContent;

    // Show the full expression in the history strip before showing the result
    updateHistory(firstNumber + " " + operator + " " + secondNumber + " =");

    calculate();
    display.textContent = result;
    shouldResetDisplay = true;
    updateFontSize();
}


// ---------- Mouse / touch events ----------

numbers.forEach(function(button){
    button.addEventListener("click", function(){
        inputDigit(button.textContent);
    });
});

operators.forEach(function(button){
    button.addEventListener("click", function(){
        inputOperator(button.textContent);
    });
});

clearBtn.addEventListener("click", clearAll);
deleteBtn.addEventListener("click", deleteLast);
equalBtn.addEventListener("click", inputEqual);


// ---------- Keyboard support ----------

const OPERATOR_KEY_MAP = {
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷"
};

document.addEventListener("keydown", function(e){

    // Digits 0-9
    if(e.key >= "0" && e.key <= "9"){
        inputDigit(e.key);
        return;
    }

    // Dot (both period key and numpad decimal)
    if(e.key === "."){
        inputDigit(".");
        return;
    }

    // Operators
    if(OPERATOR_KEY_MAP[e.key]){
        inputOperator(OPERATOR_KEY_MAP[e.key]);
        return;
    }

    // Equal (Enter or =)
    if(e.key === "Enter" || e.key === "="){
        e.preventDefault(); // stop Enter from doing things like submitting a form
        inputEqual();
        return;
    }

    // Delete last character (Backspace)
    if(e.key === "Backspace"){
        deleteLast();
        return;
    }

    // Clear everything (Escape)
    if(e.key === "Escape"){
        clearAll();
        return;
    }

});


// ---------- Dark mode toggle ----------

// Restore saved theme preference on page load
if(localStorage.getItem("axiom-theme") === "dark"){
    document.body.classList.add("dark-theme");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", function(){

    document.body.classList.toggle("dark-theme");

    const isDark = document.body.classList.contains("dark-theme");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("axiom-theme", isDark ? "dark" : "light");

});