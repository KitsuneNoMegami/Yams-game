let gameData; // Variable pour stocker les données du jeu
let currentTurnIndex = 0; // Index du tour actuel
let scores = [0, 0]; // Initialisation des scores cumulés pour chaque joueur
let bonuses = [0, 0]; // Initialisation des bonus pour chaque joueur

function VerifEntrer(event) {
    // Vérifie si la touche appuyée est "Entrée"
    if (event.key === "Enter") {
        event.preventDefault(); // Empêche le comportement par défaut du formulaire
        ChargerDonneeJeu(); // Appelle la fonction pour charger les données du jeu
    }
}

async function ChargerDonneeJeu() {
    const fileName = document.getElementById("fileName").value || "exemple.json"; // Obtient le nom du fichier ou utilise "exemple.json" par défaut
    currentTurnIndex = 0; // Réinitialise l'index du tour actuel
    try {
        const response = await fetch(fileName); // Charge le fichier JSON
        gameData = await response.json(); // Convertit la réponse en JSON
        AfficherVueGlobale(); // Affiche la vue globale du jeu
    } catch (error) {
        console.error("Erreur de chargement des données JSON :", error); // Log l'erreur dans la console
        alert("Erreur de chargement des données JSON. Vérifiez le nom du fichier et réessayez."); // Alerte l'utilisateur en cas d'erreur
    }
}

function AfficherVueGlobale() {
    document.getElementById("globalView").style.display = "block"; // Affiche la vue globale
    document.getElementById("turnView").style.display = "none"; // Masque la vue des tours
    const globalSummary = document.getElementById("globalSummary");

    // Affiche les paramètres du jeu
    const gameParameters = gameData.parameters;
    const parametersDisplay = `
        <p><strong>Code de Jeu:</strong> ${gameParameters.code}</p>
        <p><strong>Date:</strong> ${gameParameters.date}</p>
    `;
    
    // Récupère les scores des joueurs
    const player1 = gameData.players[0];
    const player2 = gameData.players[1];
    const score1 = gameData.final_result.find(res => res.id_player === player1.id).score;
    const score2 = gameData.final_result.find(res => res.id_player === player2.id).score;

    // Met à jour l'affichage des résultats globaux
    globalSummary.innerHTML = `
        ${parametersDisplay}
        <p>${player1.pseudo} - Score Final : ${score1}</p>
        <p>${player2.pseudo} - Score Final : ${score2}</p>
    `;
}

function AfficherVueParTour() {
    document.getElementById("globalView").style.display = "none"; // Masque la vue globale
    document.getElementById("turnView").style.display = "block"; // Affiche la vue des tours
    AfficherTourActuel(); // Affiche le tour actuel
}

function AfficherTourActuel() {
    const navigationButtons = document.querySelectorAll('.navigation button');

    // Active/Désactive les boutons en fonction du tour actuel
    navigationButtons[0].classList.toggle('disabled', currentTurnIndex === 0); // Tour précédent
    navigationButtons[1].classList.toggle('disabled', currentTurnIndex === gameData.rounds.length - 1); // Tour suivant

    const player1 = gameData.players[0];
    const player2 = gameData.players[1];

    // Réinitialise les scores cumulés
    scores = [0, 0];

    // Recalcule les scores cumulés pour chaque tour jusqu'au tour actuel
    for (let i = 0; i <= currentTurnIndex; i++) {
        const turn = gameData.rounds[i];
        const player1Result = turn.results.find(result => result.id_player === player1.id);
        const player2Result = turn.results.find(result => result.id_player === player2.id);

        scores[0] += player1Result.score; // Ajoute le score du joueur 1
        scores[1] += player2Result.score; // Ajoute le score du joueur 2
    }

    const currentTurn = gameData.rounds[currentTurnIndex];
    const player1Result = currentTurn.results.find(result => result.id_player === player1.id);
    const player2Result = currentTurn.results.find(result => result.id_player === player2.id);

    const turnDisplay = document.getElementById("currentTurn");

    // Affiche les résultats du tour actuel
    turnDisplay.innerHTML = `
        <h3>Tour ${currentTurnIndex + 1}</h3>
        <div class="players">
            <div class="player">
                <h4>${player1.pseudo} :</h4>
                <p> - Dés : [${player1Result.dice.join(", ")}]</p>
                <p> - Challenge : ${player1Result.challenge}</p>
                <p> - Points : ${player1Result.score}</p>
            </div>
            <div class="player">
                <h4>${player2.pseudo} :</h4>
                <p> - Dés : [${player2Result.dice.join(", ")}]</p>
                <p> - Challenge : ${player2Result.challenge}</p>
                <p> - Points : ${player2Result.score}</p>
            </div>
        </div>
    `;

    // Affiche les scores cumulés
    document.getElementById("scorePlayer1").innerHTML = `${player1.pseudo} : ${scores[0]}`;
    document.getElementById("scorePlayer2").innerHTML = `${player2.pseudo} : ${scores[1]}`;
    
    // Si c'est le dernier tour, affiche les scores finaux avec les bonus
    if (currentTurnIndex === gameData.rounds.length - 1) {
        const finalScore1 = scores[0] + gameData.final_result.find(res => res.id_player === player1.id).bonus;
        const finalScore2 = scores[1] + gameData.final_result.find(res => res.id_player === player2.id).bonus;
        
        document.getElementById("scorePlayer1").innerHTML = `${player1.pseudo} : ${finalScore1} pts (dont ${gameData.final_result.find(res => res.id_player === player1.id).bonus} pts bonus)`;
        document.getElementById("scorePlayer2").innerHTML = `${player2.pseudo} : ${finalScore2} pts (dont ${gameData.final_result.find(res => res.id_player === player2.id).bonus} pts bonus)`;
    }
}

function AfficherTourPrecedent() {
    if (currentTurnIndex > 0) {
        currentTurnIndex--; // Diminue l'index du tour actuel
        AfficherTourActuel(); // Affiche le tour actuel
    }
}

function AfficherTourSuivant() {
    if (currentTurnIndex < gameData.rounds.length - 1) {
        currentTurnIndex++; // Augmente l'index du tour actuel
        AfficherTourActuel(); // Affiche le tour actuel
    }
}

function ChangerTheme() {
    const body = document.body;
    const themeToggleButton = document.getElementById("themeToggle");

    // Alterne la classe dark-theme pour changer le thème
    body.classList.toggle("dark-theme");

    // Change le texte du bouton en fonction du thème
    if (body.classList.contains("dark-theme")) {
        themeToggleButton.innerText = "☀️"; // Change le texte du bouton en thème clair
    } else {
        themeToggleButton.innerText = "🌙"; // Change le texte du bouton en thème sombre
    }
}
