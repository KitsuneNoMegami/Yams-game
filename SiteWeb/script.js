let gameData;
let currentTurnIndex = 0;
let scores = [0, 0];
let bonuses = [0, 0];

const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
let currentInput = [];

function VerifEntrer(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        ChargerDonneeJeu();
    }
}

async function ChargerDonneeJeu() {
    const fileName = document.getElementById("nomFichier").value || "exemple.json";
    ResetJeu();

    try {
        const response = await fetch(`bdd_yams/${fileName}`);
        gameData = await response.json();

        document.getElementById('btnvueglobale').classList.remove("invisible");
        document.getElementById('btnvuetour').classList.remove("invisible");

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
    document.getElementById("vueGlobale").style.display = "none";
    document.getElementById("vueTour").style.display = "flex";
    AfficherTourActuel();
}

function updateDiceImages(joueur1Result, joueur2Result) {
    const turnDisplay = document.getElementById("tourActuel");
    
    const diceImages1 = joueur1Result.dice.map(dice => `<img src="./Images/Dés_clair/${dice}.png" height="30rem" width="30rem">`).join('');
    const diceImages2 = joueur2Result.dice.map(dice => `<img src="./Images/Dés_clair/${dice}.png" height="30rem" width="30rem">`).join('');

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

function checkSequence() {
    if (currentInput.join(',') === sequence.join(',')) {
        afficherGif('./Images/code.gif', 2500, 'godmode');
        currentInput = [];
    } else if (currentInput.length >= sequence.length) {
        currentInput.shift();
    }
}

document.addEventListener('keydown', function(event) {
    currentInput.push(event.key);
    checkSequence();
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function afficherGif(path, duree, foncname){
    const existingContainer = document.getElementById("gifContainer");
    if (existingContainer) {
        document.body.removeChild(existingContainer);
    }
    const gifContainer = document.createElement("div");
    gifContainer.id = "gifContainer";

    const gifImage = document.createElement("img");
    gifImage.src = path;
    gifImage.alt = "GIF au Centre";
    gifContainer.appendChild(gifImage);

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    overlay.appendChild(gifContainer);
    document.body.appendChild(overlay);

    gifContainer.style.zIndex = "1000"; 
    gifContainer.style.display = "flex";
    gifContainer.style.justifyContent = "center";
    gifContainer.style.alignItems = "center";
    gifContainer.style.position = "absolute"; 
    gifContainer.style.top = "50%";
    gifContainer.style.left = "50%";
    gifContainer.style.transform = "translate(-50%, -50%)";

    setTimeout(() => {document.body.removeChild(overlay); }, duree);
    await sleep(duree + 500);
    window[foncname]();
}
