// --- 1. HTML要素の取得 ---
// まずは操作したいHTML要素をすべて取得して、変数に入れておく
const display = document.querySelector('.display'); // 計算結果を表示する画面
const switches = document.querySelectorAll('.switch');
const calculations = document.querySelectorAll('.calculation');
const resets = document.querySelectorAll('.reset');
const results = document.querySelectorAll('.result');

// 計算の状態を管理するための変数を初期化します。
let currentInput = "0"; // 現在ディスプレイに表示されている入力値。最初は"0"。
let operator = "";      // 選択された演算子 (+, -, *, /)。最初は空。
let left = null;        // 計算式の左辺の値。最初は未定なのでnull。
let right = null;       // 計算式の右辺の値。最初は未定なのでnull。
let isDot = false;      // 小数点がすでに入力されているかどうかのフラグ。
let isWaitingForSecondOperand = false; // 演算子が押され、2つ目の数値入力を待っている状態かどうかのフラグ。

/**
 * ディスプレイの表示を更新する関数
 * @param {string | number} value 表示したい値
 */
function updateDisplay(value) {
    display.textContent = value;
}

/**
 * オールクリア（AC）処理を行う関数
 * すべての計算状態を初期値に戻します。
 */
function clearAll() {
    currentInput = "0";
    operator = "";
    left = null;
    right = null;
    isWaitingForSecondOperand = false;
    isDot = false;
    updateDisplay("0"); // ディスプレイも"0"に戻す
}

function calculate(n1, op, n2) {
    let result = 0;
    switch (op) {
        case '+':
            result = n1 + n2;
            break;
        case '-':
            result = n1 - n2;
            break;
        case '*':
            result = n1 * n2;
            break;
        case '/':
            if (n2 === 0) return "Error";
            result = n1 / n2;
            break;
        default:
            return n2; 
    }
    return Math.round(result * 10000000000) / 10000000000;
}

// 最初に画面が表示されたとき、ディスプレイに初期値 "0" を表示する
updateDisplay(currentInput);

// forEachを使って、取得したボタンのリストそれぞれにクリックイベントを設定していく

// 数字ボタンの処理
switches.forEach(function (button) {
    button.addEventListener('click', function (e) {
        const value = e.target.textContent; // クリックされたボタンのテキストを取得
        // 演算子が押された直後か？
        if (isWaitingForSecondOperand === true) {
            // 直後なら、新しい数値で入力を上書きし、フラグを戻す
            currentInput = value;
            isWaitingForSecondOperand = false;
        } else {
	        if (currentInput === "0" && value !== ".") {
	            // 入力が"0"だけの時に、"."以外の数字が押されたら、上書き
	            currentInput = value;
	        }else if (value === ".") {
	            // 小数点が押された場合
	            if (!isDot) { // まだ小数点が入力されていなければ
	                currentInput += value; // 追記し、
	                isDot = true;          // 小数点が入力されたことを記録する
	            }
	        }else{
	            currentInput += value; // 追記し、
	        }
        }
        updateDisplay(currentInput); // 画面を更新
        console.log('数字ボタン:', e.target.textContent);
    });
});
// 演算子ボタンの処理
calculations.forEach(function (button) {
    button.addEventListener('click', function (e) {
        const newOperator = e.target.textContent;
        if (isWaitingForSecondOperand) {
            operator = newOperator;
            return;
        }
        if (left === null) {
            left = parseFloat(currentInput);
        } else {
            const right = parseFloat(currentInput);
            const result = calculate(left, operator, right);

            if (result === "Error") {
                clearAll();
                updateDisplay("Error");
                return;
            }

            updateDisplay(result);
            left = result;
        }
        operator = newOperator;
        isWaitingForSecondOperand = true;
        console.log('演算子ボタン:', e.target.textContent);
    });
});

// ACボタンの処理
resets.forEach(function (button) {
    button.addEventListener('click', function () {
        clearAll();
        console.log('ACボタンが押されました');
    });
});

// =ボタンの処理
results.forEach(function (button) {
    button.addEventListener('click', function () {
        if (left === null || operator === "" || isWaitingForSecondOperand){
            return;
        }
        const right = parseFloat(currentInput);
        const result = calculate(left, operator, right); 
        if (result === "Error") {
            clearAll();
            updateDisplay("Error");
            return;
        }

        updateDisplay(result);

        // 計算後の状態を更新
        currentInput = result.toString();
        left = result;
        operator = "";
        isWaitingForSecondOperand = true;        
        console.log('=ボタンが押されました');
    });
});
