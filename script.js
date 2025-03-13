const cards = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
let playerCards = [];
let computerCards = [];
let tutorialMode = false;

const introScreen = document.getElementById('intro-screen');
const tutorialScreen = document.getElementById('tutorial-screen');
const gameScreen = document.getElementById('game-screen');
const playerCardsDiv = document.getElementById('player-cards');
const computerCardsDiv = document.getElementById('computer-cards');
const playerScoreSpan = document.getElementById('player-score');
const computerScoreSpan = document.getElementById('computer-score');
const messageBox = document.getElementById('message-box');
const tutorialBox = document.getElementById('tutorial-box');
const drawCardBtn = document.getElementById('draw-card');
const standBtn = document.getElementById('stand');
const playAgainBtn = document.getElementById('play-again');

document.getElementById('tutorial-btn').addEventListener('click', () => {
    introScreen.classList.add('hidden');
    tutorialScreen.classList.remove('hidden');
    tutorialMode = true;
});

document.getElementById('play-btn').addEventListener('click', startGame);

document.getElementById('start-after-tutorial').addEventListener('click', () => {
    tutorialScreen.classList.add('hidden');
    startGame();
});

drawCardBtn.addEventListener('click', playerDraw);
standBtn.addEventListener('click', playerStand);
playAgainBtn.addEventListener('click', resetGame);

function drawCard() {
    return cards[Math.floor(Math.random() * cards.length)];
}

function calculateScore(cards) {
    if (cards.reduce((a, b) => a + b, 0) === 21 && cards.length === 2) {
        return "Blackjack";
    }
    let score = cards.reduce((a, b) => a + b, 0);
    if (cards.includes(11) && score > 21) {
        cards[cards.indexOf(11)] = 1;
        score = cards.reduce((a, b) => a + b, 0);
    }
    return score;
}

function displayCards(cardsArray, container, showAll = false) {
    container.innerHTML = '';
    cardsArray.forEach((card, index) => {
        if (showAll || index === 0) {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.textContent = card;
            container.appendChild(cardDiv);
        } else {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.textContent = '?';
            container.appendChild(cardDiv);
        }
    });
}

function updateScores() {
    const playerScore = calculateScore(playerCards);
    playerScoreSpan.textContent = playerScore === "Blackjack" ? "Blackjack!" : playerScore;
    computerScoreSpan.textContent = '?';
}

function showTutorialMessage(msg) {
    if (tutorialMode) {
        tutorialBox.textContent = `(Tutorial: ${msg})`;
        tutorialBox.classList.remove('hidden');
    }
}

function startGame() {
    introScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playerCards = [];
    computerCards = [];
    drawCard(); // Aquecer o baralho
    for (let i = 0; i < 2; i++) {
        playerCards.push(drawCard());
        computerCards.push(drawCard());
    }
    displayCards(playerCards, playerCardsDiv, true);
    displayCards(computerCards, computerCardsDiv, false);
    updateScores();
    messageBox.textContent = "Sua vez! Pegar carta ou parar?";
    showTutorialMessage("Você ganhou 2 cartas pra começar! O objetivo é ficar perto de 21 sem passar.");
    if (tutorialMode) {
        setTimeout(() => showTutorialMessage("O computador também pegou 2, mas só mostra uma por enquanto. Mistério!"), 2000);
    }
    checkImmediateWin();
}

function checkImmediateWin() {
    if (calculateScore(playerCards) === "Blackjack") {
        messageBox.textContent = "Você ganhou com um BLACKJACK! Tá muito chique!";
        showTutorialMessage("BLACKJACK! Suas 2 cartas somaram 21 direto. Vitória instantânea!");
        endGame();
    }
}

function playerDraw() {
    playerCards.push(drawCard());
    displayCards(playerCards, playerCardsDiv, true);
    updateScores();
    messageBox.textContent = "Pegou mais uma! E agora?";
    showTutorialMessage("Nova carta na mão! Veja se ainda tá abaixo de 21 pra não estourar.");
    const playerScore = calculateScore(playerCards);
    if (playerScore > 21) {
        messageBox.textContent = "Oops, estourou! Perdeu, mas foi quase!";
        showTutorialMessage("Passou de 21? Isso é 'estourar'. Fim de jogo pra você dessa vez.");
        endGame();
    } else if (playerScore === 21) {
        messageBox.textContent = "Você fez 21! Vitória na raça!";
        showTutorialMessage("21 exatos! Você ganhou sem estourar, parabéns!");
        endGame();
    }
}

function playerStand() {
    messageBox.textContent = "Você parou! Hora do computador jogar.";
    showTutorialMessage("Você parou! Agora o computador joga até pelo menos 17 pontos.");
    let computerScore = calculateScore(computerCards);
    while (computerScore !== "Blackjack" && computerScore < 17) {
        computerCards.push(drawCard());
        computerScore = calculateScore(computerCards);
        displayCards(computerCards, computerCardsDiv, true);
        showTutorialMessage("O computador pegou mais cartas pra chegar a 17 ou mais. Vamos ver no que dá!");
    }
    endGame();
}

function endGame() {
    displayCards(computerCards, computerCardsDiv, true);
    const playerScore = calculateScore(playerCards);
    const computerScore = calculateScore(computerCards);
    computerScoreSpan.textContent = computerScore === "Blackjack" ? "Blackjack!" : computerScore;
    messageBox.textContent += `\nSua mão final: ${playerScore}, Computador: ${computerScore}`;
    showTutorialMessage("Hora da verdade! Vamos comparar os pontos pra ver quem ganha.");

    if (playerScore === "Blackjack" || (playerScore <= 21 && (computerScore > 21 || playerScore > computerScore))) {
        messageBox.textContent = "Você venceu, mandou muito bem!";
        showTutorialMessage(playerScore === "Blackjack" ? "BLACKJACK instantâneo!" : "Seus pontos são maiores e não estourou. Vitória sua!");
    } else if (playerScore > 21) {
        messageBox.textContent = "Você estourou, que pena! Perdeu dessa vez.";
        showTutorialMessage("Mais de 21 = derrota. Cuidado na próxima!");
    } else if (computerScore > 21) {
        messageBox.textContent = "O computador estourou! Você ganhou, show de bola!";
        showTutorialMessage("Computador passou de 21, então você leva essa!");
    } else if (playerScore === computerScore) {
        messageBox.textContent = "Empate! Foi por pouco, hein!";
        showTutorialMessage("Mesmos pontos? Empate! Ninguém ganha, ninguém perde.");
    } else {
        messageBox.textContent = "Que triste, você perdeu! O computador levou essa.";
        showTutorialMessage("Computador teve mais pontos sem estourar. Ele venceu dessa vez.");
    }

    drawCardBtn.classList.add('hidden');
    standBtn.classList.add('hidden');
    playAgainBtn.classList.remove('hidden');
}

function resetGame() {
    playerCards = [];
    computerCards = [];
    drawCardBtn.classList.remove('hidden');
    standBtn.classList.remove('hidden');
    playAgainBtn.classList.add('hidden');
    tutorialBox.classList.add('hidden');
    startGame();
}
