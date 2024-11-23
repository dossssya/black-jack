// Функция создания и перетасовки колоды
function createDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }

    return deck.sort(() => Math.random() - 0.5); // Перетасовка
}

// Функция подсчёта очков
function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (let card of hand) {
        if (card.value === "A") {
            aces++;
            score += 11;
        } else if (["K", "Q", "J"].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

// Элементы управления
const playerHandEl = document.getElementById("player-hand");
const dealerHandEl = document.getElementById("dealer-hand");
const playerScoreEl = document.getElementById("player-score");
const dealerScoreEl = document.getElementById("dealer-score");
const startButton = document.getElementById("start-game");
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const messageEl = document.getElementById("message");

// Переменные игры
let deck, playerHand, dealerHand, playerScore, dealerScore, gameOver;

// Функция для начала игры
function startGame() {
    deck = createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);
    gameOver = false;

    updateUI();

    startButton.disabled = true;
    hitButton.disabled = false;
    standButton.disabled = false;
}

// Функция для раздачи карт игроку
function hit() {
    if (gameOver) return;

    playerHand.push(deck.pop());
    playerScore = calculateScore(playerHand);

    if (playerScore > 21) {
        messageEl.textContent = "You busted! Dealer wins.";
        endGame();
    }

    updateUI();
}

// Функция для завершения хода игрока
function stand() {
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        dealerScore = calculateScore(dealerHand);
    }

    if (dealerScore > 21) {
        messageEl.textContent = "Dealer busted! You win!";
    } else if (dealerScore > playerScore) {
        messageEl.textContent = "Dealer wins!";
    } else if (dealerScore < playerScore) {
        messageEl.textContent = "You win!";
    } else {
        messageEl.textContent = "It's a tie!";
    }

    endGame();
}

// Завершение игры
function endGame() {
    gameOver = true;
    startButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;
    updateUI();
}

// Обновление интерфейса
// Обновление интерфейса
function updateUI() {
    // Обновляем карты игрока
    playerHandEl.innerHTML = playerHand.map(card => createCardHTML(card)).join("");

    // Обновляем карты дилера
    dealerHandEl.innerHTML = dealerHand.map((card, index) => {
        // Скрыть первую карту дилера, если игра не завершена
        if (!gameOver && index === 0) {
            return `<div class="card back"></div>`;
        }
        return createCardHTML(card);
    }).join("");

    // Обновляем очки
    playerScoreEl.textContent = `Player Score: ${playerScore}`;
    dealerScoreEl.textContent = gameOver ? `Dealer Score: ${dealerScore}` : "Dealer Score: ?";
}


// Создание HTML для карты
// Создание HTML для карты с цветом масти
function createCardHTML(card) {
    // Определение класса масти
    const suitClass = {
        "♠": "spades",
        "♥": "hearts",
        "♦": "diamonds",
        "♣": "clubs"
    }[card.suit];

    return `<div class="card ${suitClass}">${card.value}${card.suit}</div>`;
}


// События кнопок
startButton.addEventListener("click", startGame);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);

