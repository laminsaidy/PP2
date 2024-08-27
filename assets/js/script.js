let playerScore = 0;
let computerScore = 0;
let playerChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
let computerChoices = [...playerChoices];
let playerSelection;
let computerSelection;
let roundsPlayed = 0;
let maxRounds = 5;

const choicesContainer = document.getElementById('choices');
choicesContainer.style.display = 'none';
document.getElementById('player-score').textContent = '';
document.getElementById('computer-score').textContent = '';


function startGame() {
    const usernameInput = document.getElementById('username');
    if (usernameInput.value.trim() === '') {
        alert('Please enter your name.');
        return;
    }

    const username = usernameInput.value;
    localStorage.setItem('playerName', username);
    document.getElementById('instructions').innerHTML = `<strong>Welcome, ${username}!</strong><br>Please choose your move.`;
    
   
    choicesContainer.style.display = 'block';
    document.getElementById('scoreboard').style.display = 'block';
    document.getElementById('playAgainBtn').style.display = 'none';
    document.getElementById('player-score').textContent = 'Player Score: 0';
    document.getElementById('computer-score').textContent ='Computer Score: 0';
    document.getElementById('username').style.display = 'none';
    document.getElementById('playgame').style.display = 'none';
   

    showPastScores();
}

window.onload = function() {
    const storedUsername = localStorage.getItem('playerName');
    if (storedUsername) {
        document.getElementById('username').value = storedUsername;
    }
    showPastScores(); 
};


document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
        playerSelection = button.value;
        computerSelection = computerChoices[Math.floor(Math.random() * computerChoices.length)];
        playRound();
    });
});


function playRound() {
    let result = determineWinner(playerSelection, computerSelection);
    updateScores(result);
    displayRoundResult(result);
    checkGameOver();
}

function determineWinner(player, computer) {
    if (player === computer) return 'draw';
    if ((player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') || 
        (player === 'scissors' && computer === 'paper') || 
        (player === 'lizard' && computer === 'spock') || 
        (player === 'spock' && computer === 'rock') ||
        (player === 'rock' && computer === 'lizard') ||
        (player === 'paper' && computer === 'spock') ||
        (player === 'scissors' && computer === 'lizard') ||
        (player === 'lizard' && computer === 'paper') ||
        (player === 'spock' && computer === 'scissors')) 
    {
        return 'player';
    }
    return 'computer';
}

function updateScores(winner) {
    if (winner === 'player') {
        playerScore++;
    } else if (winner === 'computer') {
        computerScore++;
    }
    document.getElementById('player-score').textContent = `Player Score: ${playerScore}`;
    document.getElementById('computer-score').textContent = `Computer Score: ${computerScore}`;
}

function displayRoundResult(result) {
    document.getElementById('computer-choice').textContent = `Computer chose: ${computerSelection}`;
    document.getElementById('result-text').innerHTML = `Result: ${result === 'draw'? 'It\'s a draw!' : result === 'player'? 'You win this round!' : 'You lose this round!'}`;
}

function checkGameOver() {
    roundsPlayed++;
    if (roundsPlayed >= maxRounds) {
        const scores = JSON.parse(localStorage.getItem('scores') || '[]');
        scores.push({ playerName: localStorage.getItem('playerName'), playerScore, computerScore });
        scores.sort((a, b) => b.playerScore - a.playerScore);
        localStorage.setItem('scores', JSON.stringify(scores.slice(0, 5)));
        document.getElementById('choices').style.display = 'none';
        document.getElementById('game-result').innerHTML = `<strong>Game Over!</strong><br>Player Score: ${playerScore}<br>Computer Score: ${computerScore}<br><br>Final Result: ${playerScore > computerScore? 'You won the game!' : playerScore < computerScore? 'You lost the game.' : 'The game was a draw.'}`;
        document.getElementById('playAgainBtn').style.display = 'block';
    }
}

document.getElementById('playAgainBtn').addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    roundsPlayed = 0;
    location.reload();
});

document.getElementById('backToMainPageBtn').addEventListener('click', () => {
    window.location.href = "index.html";
});

function showPastScores() {
    const scoresStr = localStorage.getItem('scores');
    if (!scoresStr) {
        console.error("No scores found in local storage.");
        return;
    }
    const scoresArr = JSON.parse(scoresStr);

    console.log("Retrieved scores:", scoresArr); 

   
    scoresArr.sort((a, b) => b.playerScore - a.playerScore);

    const scoresTableBody = document.querySelector('#past-scores-table tbody');
    scoresTableBody.innerHTML = ''; 

    scoresArr.forEach(scoreObj => {
        scoresTableBody.innerHTML += `
            <tr>
                <td>${scoreObj.playerName}</td>
                <td>${scoreObj.playerScore}</td>
                <td>${scoreObj.computerScore}</td>
            </tr>
        `;
    });

    console.log("Displayed scores:", scoresArr); 
}