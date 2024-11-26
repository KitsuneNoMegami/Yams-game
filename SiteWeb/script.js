let gameData;
let currentTurnIndex = 0;
let scores = [0, 0];
let bonuses = [0, 0];
const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
let currentInput = [];

document.addEventListener('wheel', Scroll, { passive: false });
document.addEventListener("keydown", VerifEntrer);

const button = document.getElementById('charger');
button.addEventListener('click', function() {
    button.classList.add('loading');
})
function Scroll(event) {
    if ((window.scrollY === 0 && event.deltaY < 0) || 
        (window.innerHeight + window.scrollY >= document.body.offsetHeight && event.deltaY > 0)) {
        event.preventDefault();
    }
}

function VerifEntrer(event) {
    console.debug(event.key);
    if (event.key === "Enter") {
        event.preventDefault();
        ChargerDonneeJeu();
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        AfficherTourSuivant();
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        AfficherTourPrecedent();
    }
}

async function ChargerDonneeJeu() {
    const fileName = document.getElementById("nomFichier").value || "tx68ar7tor";
    ResetJeu();
    
    try {
        gameData = {
            parameters: {},
            players: [],
            rounds: [],
            final_result: []
        };

        const response1 = await fetch(`http://yams.iutrs.unistra.fr:3000/api/games/${fileName}/parameters`);
        gameData.parameters = await response1.json();

        const response2 = await fetch(`http://yams.iutrs.unistra.fr:3000/api/games/${fileName}/players`);
        gameData.players = await response2.json();

        for (let i = 1; i < 14; i++) {
            const response3 = await fetch(`http://yams.iutrs.unistra.fr:3000/api/games/${fileName}/rounds/${i}`);
            gameData.rounds.push(await response3.json());
        }

        const response4 = await fetch(`http://yams.iutrs.unistra.fr:3000/api/games/${fileName}/final-result`);
        gameData.final_result = await response4.json();

        document.getElementById('btnvueglobale').classList.remove("invisible");
        document.getElementById('btnvuetour').classList.remove("invisible");
        button.classList.remove('loading');
    } catch (error) {
        console.error("Erreur de chargement des données JSON :", error);
        alert("Erreur de chargement des données JSON. Vérifiez le nom du fichier et réessayez.");
    }
}

function AfficherVueGlobale() {
    document.getElementById("vueGlobale").style.display = "flex";
    document.getElementById("vueTour").style.display = "none";

    const globalSummary = document.getElementById("resumeGlobal");
    const gameParameters = gameData.parameters;
    const parametersDisplay = `
        <p><strong>Code de Jeu:</strong> ${gameParameters.code}</p>
        <p><strong>Date:</strong> ${gameParameters.date}</p>
    `;

    const joueur1 = gameData.players[0];
    const joueur2 = gameData.players[1];
    const score1 = gameData.final_result.find(res => res.id_player === joueur1.id).score;
    const score2 = gameData.final_result.find(res => res.id_player === joueur2.id).score;

    globalSummary.innerHTML = `
        ${parametersDisplay}
        <p>${joueur1.pseudo} - Score Final : ${score1}</p>
        <p>${joueur2.pseudo} - Score Final : ${score2}</p>
    `;
}

function AfficherVueParTour() {
    currentTurnIndex = 0;
    document.getElementById("vueGlobale").style.display = "none";
    document.getElementById("vueTour").style.display = "flex";
    AfficherTourActuel();
}

function updateDiceImages(joueur1Result, joueur2Result) {
    const turnDisplay = document.getElementById("tourActuel");

    const diceImages1 = joueur1Result.dice.map(dice => `<img src="./Images/Dés_clair/${dice}.png" height="30rem" width="30rem" alt="${dice}">`).join('');
    const diceImages2 = joueur2Result.dice.map(dice => `<img src="./Images/Dés_clair/${dice}.png" height="30rem" width="30rem" alt="${dice}">`).join('');

    turnDisplay.innerHTML = `
        <h3>Tour ${currentTurnIndex + 1}</h3>
        <div class="players">
            <div class="player">
                <h4>${gameData.players[0].pseudo} :</h4>
                <div class="des">${diceImages1}</div>
                <p> - Challenge : ${joueur1Result.challenge}</p>
                <p> - Points : ${joueur1Result.score}</p>
            </div>
            <div class="player">
                <h4>${gameData.players[1].pseudo} :</h4>
                <div class="des">${diceImages2}</div>
                <p> - Challenge : ${joueur2Result.challenge}</p>
                <p> - Points : ${joueur2Result.score}</p>
            </div>
        </div>
    `;
}

function AfficherTourPrecedent() {
    if (currentTurnIndex > 0) {
        currentTurnIndex--;
        AfficherTourActuel();
    }
}

function AfficherTourActuel() {
    const navigationButtons = document.querySelectorAll('.navigation button');
    navigationButtons[0].classList.toggle('disabled', currentTurnIndex === 0);
    navigationButtons[1].classList.toggle('disabled', currentTurnIndex === gameData.rounds.length - 1);

    const joueur1 = gameData.players[0];
    const joueur2 = gameData.players[1];
    scores = [0, 0];

    for (let i = 0; i <= currentTurnIndex; i++) {
        const turn = gameData.rounds[i];
        const joueur1Result = turn.results.find(result => result.id_player === joueur1.id);
        const joueur2Result = turn.results.find(result => result.id_player === joueur2.id);
        scores[0] += joueur1Result.score;
        scores[1] += joueur2Result.score;
    }

    const currentTurn = gameData.rounds[currentTurnIndex];
    const joueur1Result = currentTurn.results.find(result => result.id_player === joueur1.id);
    const joueur2Result = currentTurn.results.find(result => result.id_player === joueur2.id);
    updateDiceImages(joueur1Result, joueur2Result);

    document.getElementById("scoreJoueur1").innerHTML = `${joueur1.pseudo} : ${scores[0]}`;
    document.getElementById("scoreJoueur2").innerHTML = `${joueur2.pseudo} : ${scores[1]}`;
    
    if (currentTurnIndex === gameData.rounds.length - 1) {
        const finalScore1 = scores[0] + gameData.final_result.find(res => res.id_player === joueur1.id).bonus;
        const finalScore2 = scores[1] + gameData.final_result.find(res => res.id_player === joueur2.id).bonus;

        document.getElementById("scoreJoueur1").innerHTML = `${joueur1.pseudo} : ${finalScore1} pts (dont ${gameData.final_result.find(res => res.id_player === joueur1.id).bonus} pts bonus)`;
        document.getElementById("scoreJoueur2").innerHTML = `${joueur2.pseudo} : ${finalScore2} pts (dont ${gameData.final_result.find(res => res.id_player === joueur2.id).bonus} pts bonus)`;
    }
}

function AfficherTourSuivant() {
    if (currentTurnIndex < gameData.rounds.length - 1) {
        currentTurnIndex++;
        AfficherTourActuel();
    }
}

function ResetJeu() {
    gameData = null;
    currentTurnIndex = 0;
    scores = [0, 0];
    bonuses = [0, 0];
    document.getElementById("resumeGlobal").innerHTML = "";
    document.getElementById("tourActuel").innerHTML = "";
    document.getElementById("scoreJoueur1").innerHTML = "";
    document.getElementById("scoreJoueur2").innerHTML = "";
    document.getElementById("vueGlobale").style.display = "none";
    document.getElementById("vueTour").style.display = "none";
    document.getElementById('btnvueglobale').classList.add("invisible");
    document.getElementById('btnvuetour').classList.add("invisible");
    document.getElementById("nomFichier").value = "";
}
