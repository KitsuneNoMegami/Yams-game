let gameData; // Variable pour stocker les données du jeu
let currentTurnIndex = 0; // Index du tour actuel, commence à 0
let scores = [0, 0]; // Initialisation des scores cumulés pour chaque joueur
let bonuses = [0, 0]; // Initialisation des bonus pour chaque joueur

// Fonction pour vérifier si la touche "Entrée" est pressée
function VerifEntrer(event) {
    if (event.key === "Enter") { // Vérifie si la touche appuyée est "Entrée"
        event.preventDefault(); // Empêche le comportement par défaut du formulaire (soumission)
        ChargerDonneeJeu(); // Appelle la fonction pour charger les données du jeu
    }
}

// Fonction asynchrone pour charger les données du jeu à partir d'un fichier JSON
async function ChargerDonneeJeu() {
    const fileName = document.getElementById("nomFichier").value || "exemple.json"; // Obtient le nom du fichier ou utilise "exemple.json" par défaut
    currentTurnIndex = 0; // Réinitialise l'index du tour actuel
    try {
        const response = await fetch(fileName); // Charge le fichier JSON
        gameData = await response.json(); // Convertit la réponse en objet JSON
        AfficherVueGlobale(); // Appelle la fonction pour afficher la vue globale du jeu
    } catch (error) {
        console.error("Erreur de chargement des données JSON :", error); // Log l'erreur dans la console
        alert("Erreur de chargement des données JSON. Vérifiez le nom du fichier et réessayez."); // Alerte l'utilisateur en cas d'erreur
    }
}

// Fonction pour afficher la vue globale du jeu
function AfficherVueGlobale() {
    document.getElementById("vueGlobale").style.display = "flex"; // Affiche la vue globale
    document.getElementById("vueTour").style.display = "none"; // Masque la vue des tours
    const globalSummary = document.getElementById("resumeGlobal"); // Récupère l'élément pour afficher le résumé global

    // Affiche les paramètres du jeu
    const gameParameters = gameData.parameters;
    const parametersDisplay = `
        <p><strong>Code de Jeu:</strong> ${gameParameters.code}</p>
        <p><strong>Date:</strong> ${gameParameters.date}</p>
    `;
    
    // Récupère les scores des joueurs
    const joueur1 = gameData.players[0];
    const joueur2 = gameData.players[1];
    const score1 = gameData.final_result.find(res => res.id_player === joueur1.id).score; // Score du joueur 1
    const score2 = gameData.final_result.find(res => res.id_player === joueur2.id).score; // Score du joueur 2

    // Met à jour l'affichage des résultats globaux
    globalSummary.innerHTML = `
        ${parametersDisplay}
        <p>${joueur1.pseudo} - Score Final : ${score1}</p>
        <p>${joueur2.pseudo} - Score Final : ${score2}</p>
    `;
}

// Fonction pour afficher la vue du tour actuel
function AfficherVueParTour() {
    document.getElementById("vueGlobale").style.display = "none"; // Masque la vue globale
    document.getElementById("vueTour").style.display = "flex"; // Affiche la vue des tours
    AfficherTourActuel(); // Appelle la fonction pour afficher le tour actuel
}

// Fonction pour afficher les détails du tour actuel
function AfficherTourActuel() {
    const navigationButtons = document.querySelectorAll('.navigation button'); // Récupère les boutons de navigation

    // Active/Désactive les boutons en fonction du tour actuel
    navigationButtons[0].classList.toggle('disabled', currentTurnIndex === 0); // Bouton pour le tour précédent
    navigationButtons[1].classList.toggle('disabled', currentTurnIndex === gameData.rounds.length - 1); // Bouton pour le tour suivant

    const joueur1 = gameData.players[0]; // Récupère le premier joueur
    const joueur2 = gameData.players[1]; // Récupère le deuxième joueur

    // Réinitialise les scores cumulés
    scores = [0, 0];

    // Calcule les scores cumulés pour chaque tour jusqu'au tour actuel
    for (let i = 0; i <= currentTurnIndex; i++) {
        const turn = gameData.rounds[i]; // Récupère les résultats du tour
        const joueur1Result = turn.results.find(result => result.id_player === joueur1.id); // Résultat du joueur 1
        const joueur2Result = turn.results.find(result => result.id_player === joueur2.id); // Résultat du joueur 2

        scores[0] += joueur1Result.score; // Ajoute le score du joueur 1
        scores[1] += joueur2Result.score; // Ajoute le score du joueur 2
    }

    const currentTurn = gameData.rounds[currentTurnIndex]; // Récupère les résultats du tour actuel
    const joueur1Result = currentTurn.results.find(result => result.id_player === joueur1.id); // Résultat du joueur 1 pour le tour actuel
    const joueur2Result = currentTurn.results.find(result => result.id_player === joueur2.id); // Résultat du joueur 2 pour le tour actuel

    const turnDisplay = document.getElementById("tourActuel"); // Récupère l'élément pour afficher les résultats du tour actuel

    // Affiche les résultats du tour actuel
    turnDisplay.innerHTML = `
        <h3>Tour ${currentTurnIndex + 1}</h3>
        <div class="players">
            <div class="player">
                <h4>${joueur1.pseudo} :</h4>
                <p> - Dés : [${joueur1Result.dice.join(", ")}]</p>
                <p> - Challenge : ${joueur1Result.challenge}</p>
                <p> - Points : ${joueur1Result.score}</p>
            </div>
            <div class="player">
                <h4>${joueur2.pseudo} :</h4>
                <p> - Dés : [${joueur2Result.dice.join(", ")}]</p>
                <p> - Challenge : ${joueur2Result.challenge}</p>
                <p> - Points : ${joueur2Result.score}</p>
            </div>
        </div>
    `;

    // Affiche les scores cumulés
    document.getElementById("scoreJoueur1").innerHTML = `${joueur1.pseudo} : ${scores[0]}`;
    document.getElementById("scoreJoueur2").innerHTML = `${joueur2.pseudo} : ${scores[1]}`;
    
    // Si c'est le dernier tour, affiche les scores finaux avec les bonus
    if (currentTurnIndex === gameData.rounds.length - 1) {
        const finalScore1 = scores[0] + gameData.final_result.find(res => res.id_player === joueur1.id).bonus; // Score final du joueur 1 avec bonus
        const finalScore2 = scores[1] + gameData.final_result.find(res => res.id_player === joueur2.id).bonus; // Score final du joueur 2 avec bonus
        
        document.getElementById("scoreJoueur1").innerHTML = `${joueur1.pseudo} : ${finalScore1} pts (dont ${gameData.final_result.find(res => res.id_player === joueur1.id).bonus} pts bonus)`;
        document.getElementById("scoreJoueur2").innerHTML = `${joueur2.pseudo} : ${finalScore2} pts (dont ${gameData.final_result.find(res => res.id_player === joueur2.id).bonus} pts bonus)`;
    }
}

// Fonction pour afficher le tour précédent
function AfficherTourPrecedent() {
    if (currentTurnIndex > 0) {
        currentTurnIndex--; // Diminue l'index du tour actuel
        AfficherTourActuel(); // Appelle la fonction pour afficher le tour actuel
    }
}

// Fonction pour afficher le tour suivant
function AfficherTourSuivant() {
    if (currentTurnIndex < gameData.rounds.length - 1) {
        currentTurnIndex++; // Augmente l'index du tour actuel
        AfficherTourActuel(); // Appelle la fonction pour afficher le tour actuel
    }
}

// Fonction pour changer le thème de l'application
function ChangerTheme() {
    const body = document.body; // Récupère l'élément body du document
    const themeToggleButton = document.getElementById("toggleTheme"); // Récupère le bouton de changement de thème

    // Alterne la classe theme-sombre pour changer le thème
    body.classList.toggle("theme-sombre");

    // Change le texte du bouton en fonction du thème
    if (body.classList.contains("theme-sombre")) {
        themeToggleButton.innerText = "☀️"; // Change le texte du bouton en thème clair
    } else {
        themeToggleButton.innerText = "🌙"; // Change le texte du bouton en thème sombre
    }
}
