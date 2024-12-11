let gameData; // Cette variable va contenir toutes les données du jeu, telles que les paramètres, les joueurs, les résultats des tours, et les résultats finaux.
let currentTurnIndex = 0; // Cette variable garde la trace du tour actuel en cours, commence à 0 pour le premier tour.
let scores = [0, 0]; // Les scores des deux joueurs, initialement à zéro.
let bonuses = [0, 0]; // Les bonus des joueurs, initialement à zéro.
const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter']; // Une séquence de touches définie (comme un code secret ou cheat code).
let currentInput = []; // Une liste qui conserve les touches que le joueur a appuyées pour vérifier la séquence entrée.

document.addEventListener('wheel', Scroll, { passive: false }); // Écoute l'événement de défilement de la page, pour appeler la fonction Scroll.
document.addEventListener("keydown", VerifEntrer); // Écoute l'événement de pression d'une touche, pour appeler la fonction VerifEntrer.

function Scroll(event) {
    // Si l'utilisateur essaie de faire défiler la page tout en haut ou en bas, on empêche le comportement par défaut.
    if ((window.scrollY === 0 && event.deltaY < 0) || 
        (window.innerHeight + window.scrollY >= document.body.offsetHeight && event.deltaY > 0)) {
        event.preventDefault(); // Empêche le défilement de la page dans les conditions spécifiées.
    }
}

function VerifEntrer(event) {
    console.debug(event.key); // Affiche dans la console la touche appuyée par l'utilisateur pour le débogage.
    
    // Si la touche appuyée est "Enter", on appelle la fonction ChargerDonneeJeu pour charger les données du jeu.
    if (event.key === "Enter") {
        event.preventDefault(); // Empêche le comportement par défaut de la touche "Enter".
        ChargerDonneeJeu(); // Charge les données du jeu.
    } 
    // Si la touche appuyée est "ArrowRight", on passe au tour suivant.
    else if (event.key === "ArrowRight") {
        event.preventDefault(); // Empêche le comportement par défaut de la touche "ArrowRight".
        AfficherTourSuivant(); // Affiche le tour suivant.
    } 
    // Si la touche appuyée est "ArrowLeft", on revient au tour précédent.
    else if (event.key === "ArrowLeft") {
        event.preventDefault(); // Empêche le comportement par défaut de la touche "ArrowLeft".
        AfficherTourPrecedent(); // Affiche le tour précédent.
    }
}

async function ChargerDonneeJeu() {
    // Ajoute une classe 'loading' à tous les éléments de la page pour indiquer que le jeu est en cours de chargement.
    document.body.querySelectorAll('*').forEach(element => element.classList.add('loading'));
    
    const fileName = document.getElementById("nomFichier").value || "tx68ar7tor"; // Récupère le nom du fichier à charger, sinon utilise un nom par défaut.
    ResetJeu(); // Réinitialise les données du jeu avant de les recharger.
    
    try {
        // Crée un objet vide pour stocker les données du jeu, telles que les paramètres, les joueurs, les tours et les résultats finaux.
        gameData = {
            parameters: {},
            players: [],
            rounds: [],
            final_result: []
        };

        // Récupère les paramètres du jeu depuis le serveur en faisant une requête fetch.
        const reponse1 = await fetch(`http://yams.iutrs.unistra.fr:3000/api/games/${fileName}/parameters`);
        gameData.parameters = await reponse1.json(); // Parse les paramètres JSON reçus et les stocke dans gameData.

        // Récupère les informations sur les joueurs depuis le serveur.
        const reponse2 = await fetch(`http://yams.iutrs.unistra.fr:3000/api/games/${fileName}/players`);
        gameData.players = await reponse2.json(); // Parse les informations des joueurs et les stocke dans gameData.

        // Récupère les résultats de chaque tour du jeu depuis le serveur.
        for (let i = 1; i < 14; i++) {
            const reponse3 = await fetch(`http://yams.iutrs.unistra.fr:3000/api/games/${fileName}/rounds/${i}`);
            gameData.rounds.push(await reponse3.json()); // Ajoute chaque tour à l'objet gameData.
        }

        // Récupère les résultats finaux du jeu depuis le serveur.
        const response4 = await fetch(`http://yams.iutrs.unistra.fr:3000/api/games/${fileName}/final-result`);
        gameData.final_result = await response4.json(); // Ajoute les résultats finaux dans gameData.

        // Affiche les boutons de vue globale et de vue par tour une fois les données chargées.
        document.getElementById('btnvueglobale').classList.remove("invisible");
        document.getElementById('btnvuetour').classList.remove("invisible");
        
        // Retire la classe 'loading' de tous les éléments de la page, signifiant que le jeu est maintenant prêt à être joué.
        document.body.querySelectorAll('*').forEach(element => element.classList.remove('loading'));
    } catch (error) {
        // Si une erreur se produit lors du chargement des données, affiche l'erreur dans la console et un message d'alerte pour l'utilisateur.
        console.error("Erreur de chargement des données JSON :", error);
        alert("Erreur de chargement des données JSON. Vérifiez le nom du fichier et réessayez.");
    }
}

function AfficherVueGlobale() {
    // Affiche la vue globale et cache la vue par tour.
    document.getElementById("vueGlobale").style.display = "flex";
    document.getElementById("vueTour").style.display = "none";

    const globalSummary = document.getElementById("resumeGlobal");
    const gameParameters = gameData.parameters;

    // Crée un tableau HTML pour afficher le résumé du jeu.
    let tableauHTML = `
        <h3>Résumé de la partie</h3>
        <p><strong>Code de Jeu:</strong> ${gameParameters.code}</p>
        <p><strong>Date:</strong> ${gameParameters.date}</p>
        <table>
            <thead>
                <tr>
                    <th>Tour</th>
                    <th>Joueur 1 (${gameData.players[0].pseudo})</th>
                    <th>Score</th>
                    <th>Joueur 2 (${gameData.players[1].pseudo})</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Pour chaque tour du jeu, ajoute une ligne au tableau avec les résultats des joueurs.
    gameData.rounds.forEach((round, index) => {
        const joueur1Result = round.results.find(result => result.id_player === gameData.players[0].id);
        const joueur2Result = round.results.find(result => result.id_player === gameData.players[1].id);

        tableauHTML += `
            <tr>
                <td>Tour ${index + 1}</td>
                <td>${joueur1Result.challenge} (${joueur1Result.dice.join(", ")})</td>
                <td>${joueur1Result.score}</td>
                <td>${joueur2Result.challenge} (${joueur2Result.dice.join(", ")})</td>
                <td>${joueur2Result.score}</td>
            </tr>
        `;
    });

    // Ajoute les résultats finaux des joueurs à la fin du tableau.
    const joueur1Final = gameData.final_result.find(res => res.id_player === gameData.players[0].id);
    const joueur2Final = gameData.final_result.find(res => res.id_player === gameData.players[1].id);

    tableauHTML += `
            </tbody>
            <tfoot>
                <tr>
                    <td>Résultats finaux</td>
                    <td>Bonus : ${joueur1Final.bonus}</td>
                    <td>Score total : ${joueur1Final.score}</td>
                    <td>Bonus : ${joueur2Final.bonus}</td>
                    <td>Score total : ${joueur2Final.score}</td>
                </tr>
            </tfoot>
        </table>
    `;

    // Met à jour l'affichage du résumé global avec le tableau créé.
    globalSummary.innerHTML = tableauHTML;
}

function AfficherVueParTour() {
    currentTurnIndex = 0; // Réinitialise l'index du tour à 0 pour commencer au premier tour.
    document.getElementById("vueGlobale").style.display = "none"; // Cache la vue globale.
    document.getElementById("vueTour").style.display = "flex"; // Affiche la vue par tour.
    AfficherTourActuel(); // Affiche le tour actuel.
}

function MAJ_Des_Image(joueur1Result, joueur2Result) {
    const turnDisplay = document.getElementById("tourActuel");

    // Affiche les images des dés pour chaque joueur, chaque dé est représenté par une image.
    const diceImages1 = joueur1Result.dice.map(dice => `<img src="./Images/Dés_clair/${dice}.png" height="30rem" width="30rem" alt="${dice}">`).join('');
    const diceImages2 = joueur2Result.dice.map(dice => `<img src="./Images/Dés_clair/${dice}.png" height="30rem" width="30rem" alt="${dice}">`).join('');

    // Met à jour l'affichage du tour actuel avec les dés et les scores.
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
    // Si on n'est pas déjà au premier tour, on revient au tour précédent.
    if (currentTurnIndex > 0) {
        currentTurnIndex--; // Diminue l'index du tour pour afficher le tour précédent.
        AfficherTourActuel(); // Affiche le tour précédent.
    }
}

function AfficherTourActuel() {
    const navigationButtons = document.querySelectorAll('.navigation button');
    // Désactive le bouton pour revenir en arrière si on est déjà au premier tour.
    navigationButtons[0].classList.toggle('disabled', currentTurnIndex === 0);
    // Désactive le bouton pour aller au tour suivant si on est déjà au dernier tour.
    navigationButtons[1].classList.toggle('disabled', currentTurnIndex === 13);

    // Récupère les résultats des joueurs pour le tour actuel.
    const currentRound = gameData.rounds[currentTurnIndex];
    const joueur1Result = currentRound.results.find(result => result.id_player === gameData.players[0].id);
    const joueur2Result = currentRound.results.find(result => result.id_player === gameData.players[1].id);

    MAJ_Des_Image(joueur1Result, joueur2Result); // Met à jour l'affichage des dés et des scores pour le tour actuel.
}

function AfficherTourSuivant() {
    // Si on n'est pas déjà au dernier tour, on passe au tour suivant.
    if (currentTurnIndex < 13) {
        currentTurnIndex++; // Augmente l'index du tour pour afficher le tour suivant.
        AfficherTourActuel(); // Affiche le tour suivant.
    }
}


function ResetJeu() {
    // Réinitialise toutes les données du jeu.
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
    document.getElementById("nomFichier").value = ""; // Vide le champ du nom du fichier.
}
