let gameData;  // Déclare une variable pour stocker les données du jeu.
let currentTurnIndex = 0;  // Déclare une variable pour suivre l'index du tour actuel.
let scores = [0, 0];  // Initialise un tableau pour stocker les scores des deux joueurs (joueur1 et joueur2).
let bonuses = [0, 0];  // Initialise un tableau pour stocker les bonus des deux joueurs.

const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];  // Déclare une séquence d'actions (comme un code secret) que l'on attend de l'utilisateur.
let currentInput = [];  // Crée un tableau pour stocker les entrées actuelles de l'utilisateur pendant qu'il tape.

function VerifEntrer(event) {  // Fonction qui vérifie si l'utilisateur appuie sur la touche "Entrée".
    if (event.key === "Enter") {  // Si l'utilisateur appuie sur la touche "Entrée".
        event.preventDefault();  // Empêche le comportement par défaut de cette touche (comme soumettre un formulaire).
        ChargerDonneeJeu();  // Appelle la fonction pour charger les données du jeu depuis un fichier.
    }
}

async function ChargerDonneeJeu() {  // Fonction pour charger les données du jeu à partir d'un fichier JSON.
    const fileName = document.getElementById("nomFichier").value || "exemple.json";  // Récupère le nom du fichier du jeu que l'utilisateur a entré ou prend "exemple.json" par défaut.
    ResetJeu();  // Appelle la fonction ResetJeu pour réinitialiser l'état du jeu.

    try {  // Essaye de charger les données du jeu.
        const response = await fetch(`bdd_yams/${fileName}`);  // Essaie de charger le fichier JSON à partir de l'URL donnée.
        gameData = await response.json();  // Convertit le fichier JSON en un objet JavaScript (données du jeu).

        document.getElementById('btnvueglobale').classList.remove("invisible");  // Rend visible le bouton pour voir la vue globale du jeu.
        document.getElementById('btnvuetour').classList.remove("invisible");  // Rend visible le bouton pour voir la vue du tour actuel.
    } catch (error) {  // Si une erreur se produit (par exemple si le fichier est introuvable).
        console.error("Erreur de chargement des données JSON :", error);  // Affiche l'erreur dans la console pour le débogage.
        alert("Erreur de chargement des données JSON. Vérifiez le nom du fichier et réessayez.");  // Affiche un message d'erreur à l'utilisateur.
    }
}

function AfficherVueGlobale() {  // Fonction pour afficher la vue globale du jeu.
    document.getElementById("vueGlobale").style.display = "flex";  // Affiche la vue globale du jeu.
    document.getElementById("vueTour").style.display = "none";  // Cache la vue du tour actuel.
    const globalSummary = document.getElementById("resumeGlobal");  // Trouve l'élément HTML où afficher le résumé global.

    const gameParameters = gameData.parameters;  // Récupère les paramètres du jeu (comme le code du jeu et la date).
    const parametersDisplay = `
        <p><strong>Code de Jeu:</strong> ${gameParameters.code}</p>
        <p><strong>Date:</strong> ${gameParameters.date}</p> 
    `; // Afficher le code et la date du jeu 

    const joueur1 = gameData.players[0];  // Récupère les informations du premier joueur.
    const joueur2 = gameData.players[1];  // Récupère les informations du deuxième joueur.
    const score1 = gameData.final_result.find(res => res.id_player === joueur1.id).score;  // Trouve le score final du premier joueur.
    const score2 = gameData.final_result.find(res => res.id_player === joueur2.id).score;  // Trouve le score final du deuxième joueur.

    globalSummary.innerHTML = `
        ${parametersDisplay}  // Affiche les paramètres du jeu.
        <p>${joueur1.pseudo} - Score Final : ${score1}</p>  // Affiche le score final du premier joueur.
        <p>${joueur2.pseudo} - Score Final : ${score2}</p>  // Affiche le score final du deuxième joueur.
    `;
}

function AfficherVueParTour() {  // Fonction pour afficher la vue détaillée du tour actuel.
    document.getElementById("vueGlobale").style.display = "none";  // Cache la vue globale du jeu.
    document.getElementById("vueTour").style.display = "flex";  // Affiche la vue du tour actuel.
    AfficherTourActuel();  // Appelle la fonction pour afficher les détails du tour actuel.
}

function updateDiceImages(joueur1Result, joueur2Result) {  // Fonction pour mettre à jour les images des dés pour chaque joueur.
    const turnDisplay = document.getElementById("tourActuel");  // Trouve l'élément HTML où afficher les résultats du tour actuel.

    // Crée les images des dés pour le premier joueur, en utilisant un tableau d'images des dés.
    const diceImages1 = joueur1Result.dice.map(dice => `<img src="./Images/Dés_clair/${dice}.png" height="30rem" width="30rem" alt="${dice}">`).join('');
    // Crée les images des dés pour le deuxième joueur.
    const diceImages2 = joueur2Result.dice.map(dice => `<img src="./Images/Dés_clair/${dice}.png" height="30rem" width="30rem" alt="${dice}">`).join('');

    turnDisplay.innerHTML = `
        <h3>Tour ${currentTurnIndex + 1}</h3>  // Affiche le numéro du tour actuel.
        <div class="players">  // Commence la section pour afficher les résultats des joueurs.
            <div class="player">  // Section pour le premier joueur.
                <h4>${gameData.players[0].pseudo} :</h4>  // Affiche le pseudo du premier joueur.
                <div class="des">${diceImages1}</div>  // Affiche les images des dés du premier joueur.
                <p> - Challenge : ${joueur1Result.challenge}</p>  // Affiche le challenge du premier joueur.
                <p> - Points : ${joueur1Result.score}</p>  // Affiche les points du premier joueur.
            </div>
            <div class="player">  // Section pour le deuxième joueur.
                <h4>${gameData.players[1].pseudo} :</h4>  // Affiche le pseudo du deuxième joueur.
                <div class="des">${diceImages2}</div>  // Affiche les images des dés du deuxième joueur.
                <p> - Challenge : ${joueur2Result.challenge}</p>  // Affiche le challenge du deuxième joueur.
                <p> - Points : ${joueur2Result.score}</p>  // Affiche les points du deuxième joueur.
            </div>
        </div>
    `;
}

function AfficherTourPrecedent() {  // Fonction pour afficher le tour précédent.
    if (currentTurnIndex > 0) {  // Si le tour actuel n'est pas le premier.
        currentTurnIndex--;  // Diminue l'index du tour actuel pour revenir au tour précédent.
        AfficherTourActuel();  // Appelle la fonction pour afficher le tour actuel (maintenant le précédent).
    }
}

function AfficherTourActuel() {  // Fonction pour afficher les détails du tour actuel.
    const navigationButtons = document.querySelectorAll('.navigation button');  // Trouve tous les boutons de navigation (précédent et suivant).
    navigationButtons[0].classList.toggle('disabled', currentTurnIndex === 0);  // Désactive le bouton "précédent" si on est au premier tour.
    navigationButtons[1].classList.toggle('disabled', currentTurnIndex === gameData.rounds.length - 1);  // Désactive le bouton "suivant" si on est au dernier tour.

    const joueur1 = gameData.players[0];  // Récupère les informations du premier joueur.
    const joueur2 = gameData.players[1];  // Récupère les informations du deuxième joueur.
    scores = [0, 0];  // Réinitialise les scores des joueurs.

    // Calcule les scores cumulés des joueurs jusqu'au tour actuel.
    for (let i = 0; i <= currentTurnIndex; i++) {
        const turn = gameData.rounds[i];  // Récupère les informations de chaque tour.
        const joueur1Result = turn.results.find(result => result.id_player === joueur1.id);  // Trouve les résultats du premier joueur pour ce tour.
        const joueur2Result = turn.results.find(result => result.id_player === joueur2.id);  // Trouve les résultats du deuxième joueur pour ce tour.
        scores[0] += joueur1Result.score;  // Ajoute les points du premier joueur au score total.
        scores[1] += joueur2Result.score;  // Ajoute les points du deuxième joueur au score total.
    }

    const currentTurn = gameData.rounds[currentTurnIndex];  // Récupère les informations du tour actuel.
    const joueur1Result = currentTurn.results.find(result => result.id_player === joueur1.id);  // Trouve les résultats du premier joueur pour ce tour.
    const joueur2Result = currentTurn.results.find(result => result.id_player === joueur2.id);  // Trouve les résultats du deuxième joueur pour ce tour.
    updateDiceImages(joueur1Result, joueur2Result);  // Met à jour l'affichage des images des dés pour les deux joueurs.

    // Affiche les scores cumulés des joueurs.
    document.getElementById("scoreJoueur1").innerHTML = `${joueur1.pseudo} : ${scores[0]}`;  // Met à jour l'élément HTML avec l'ID "scoreJoueur1" pour afficher le nom du premier joueur et son score total jusqu'à maintenant.
    document.getElementById("scoreJoueur2").innerHTML = `${joueur2.pseudo} : ${scores[1]}`;  // Met à jour l'élément HTML avec l'ID "scoreJoueur2" pour afficher le nom du deuxième joueur et son score total jusqu'à maintenant.
    
    if (currentTurnIndex === gameData.rounds.length - 1) {  // Si on est au dernier tour.
        const finalScore1 = scores[0] + gameData.final_result.find(res => res.id_player === joueur1.id).bonus;  // Calcule le score final du premier joueur avec les bonus.
        const finalScore2 = scores[1] + gameData.final_result.find(res => res.id_player === joueur2.id).bonus;  // Calcule le score final du deuxième joueur avec les bonus.

        // Affiche les scores finaux des joueurs avec les bonus.
        document.getElementById("scoreJoueur1").innerHTML = `${joueur1.pseudo} : ${finalScore1} pts (dont ${gameData.final_result.find(res => res.id_player === joueur1.id).bonus} pts bonus)`;
        document.getElementById("scoreJoueur2").innerHTML = `${joueur2.pseudo} : ${finalScore2} pts (dont ${gameData.final_result.find(res => res.id_player === joueur2.id).bonus} pts bonus)`;
    }
}

function AfficherTourSuivant() {  // Fonction pour afficher le tour suivant.
    if (currentTurnIndex < gameData.rounds.length - 1) {  // Si on n'est pas déjà au dernier tour.
        currentTurnIndex++;  // Va au tour suivant.
        AfficherTourActuel();  // Affiche le tour actuel (maintenant le suivant).
    }
}

function ResetJeu() {  // Fonction pour réinitialiser le jeu.
    gameData = null;  // Efface les données du jeu.
    currentTurnIndex = 0;  // Remet l'index du tour à 0.
    scores = [0, 0];  // Remet les scores à 0.
    bonuses = [0, 0];  // Remet les bonus à 0.
    document.getElementById("resumeGlobal").innerHTML = "";  // Efface le résumé global du jeu.
    document.getElementById("tourActuel").innerHTML = "";  // Efface les détails du tour actuel.
    document.getElementById("scoreJoueur1").innerHTML = "";  // Efface le score du premier joueur.
    document.getElementById("scoreJoueur2").innerHTML = "";  // Efface le score du deuxième joueur.
    document.getElementById("vueGlobale").style.display = "none";  // Cache la vue globale.
    document.getElementById("vueTour").style.display = "none";  // Cache la vue du tour.
    document.getElementById('btnvueglobale').classList.add("invisible");  // Cache le bouton pour la vue globale.
    document.getElementById('btnvuetour').classList.add("invisible");  // Cache le bouton pour la vue du tour.
    document.getElementById("nomFichier").value = "";  // Efface le champ de saisie du nom de fichier.
}
