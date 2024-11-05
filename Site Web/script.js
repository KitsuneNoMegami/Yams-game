let gameData; // Variable pour stocker les données du jeu
let currentTurnIndex = 0; // Index du tour actuel, commence à 0
let scores = [0, 0]; // Initialisation des scores cumulés pour chaque joueur
let bonuses = [0, 0]; // Initialisation des bonus pour chaque joueur

function afficherGif() {
    // Crée le conteneur pour le GIF
    const gifContainer = document.createElement("div");
    gifContainer.id = "gifContainer";

    // Crée l'élément image
    const gifImage = document.createElement("img");
    gifImage.src = "Images/lanceDes.gif"; // Utilise le chemin du GIF passé en argument
    gifImage.alt = "GIF au Centre";

    // Ajoute l'image au conteneur
    gifContainer.appendChild(gifImage);

    // Crée un overlay pour assombrir le reste de la page
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Fond semi-transparent
    overlay.style.zIndex = "999"; // Assure que l'overlay soit en dessous du GIF
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    // Ajoute le conteneur du GIF à l'overlay
    overlay.appendChild(gifContainer);

    // Ajoute l'overlay au body
    document.body.appendChild(overlay);

    // Ajoute des styles pour le conteneur du GIF
    gifContainer.style.zIndex = "1000"; // Assure que le GIF soit au-dessus de l'overlay
    gifContainer.style.display = "flex";
    gifContainer.style.justifyContent = "center";
    gifContainer.style.alignItems = "center";
    gifContainer.style.position = "absolute"; // Change position en absolu pour centrer dans l'overlay
    gifContainer.style.top = "50%";
    gifContainer.style.left = "50%";
    gifContainer.style.transform = "translate(-50%, -50%)";

    // Suppression de l'overlay après un certain temps (par exemple 3 secondes)
    setTimeout(() => {
        document.body.removeChild(overlay); // Supprime l'overlay du body
    }, 2500); // Durée d'affichage en millisecondes (3 secondes ici)
    ChargerDonneeJeu()
}

// Fonction pour vérifier si la touche "Entrée" est pressée
function VerifEntrer(event) {
    if (event.key === "Enter") { // Vérifie si la touche appuyée est "Entrée"
        event.preventDefault(); // Empêche le comportement par défaut du formulaire (soumission)
        afficherGif(); // Appelle la fonction pour charger les données du jeu
    }
}
function ResetJeu() {
    // Réinitialiser les variables globales
    gameData = null; // Réinitialiser les données du jeu
    currentTurnIndex = 0; // Réinitialiser l'index du tour
    scores = [0, 0]; // Réinitialiser les scores
    bonuses = [0, 0]; // Réinitialiser les bonus

    // Réinitialiser l'affichage
    document.getElementById("resumeGlobal").innerHTML = ""; // Vider le résumé global
    document.getElementById("tourActuel").innerHTML = ""; // Vider les détails du tour actuel
    document.getElementById("scoreJoueur1").innerHTML = ""; // Vider les scores du joueur 1
    document.getElementById("scoreJoueur2").innerHTML = ""; // Vider les scores du joueur 2

    // Réinitialiser la vue
    document.getElementById("vueGlobale").style.display = "none"; // Masquer la vue globale
    document.getElementById("vueTour").style.display = "none"; // Masquer la vue des tours
    document.querySelectorAll('#boutonsVue button')[0].style.display = "none"; // Désactiver le bouton de vue globale
    document.querySelectorAll('#boutonsVue button')[2].style.display = "none"; // Désactiver le bouton de vue par tour

    // Si vous avez un champ pour le nom du fichier, réinitialiser également
    document.getElementById("nomFichier").value = ""; // Vider le champ de saisie du nom du fichier
}
// Fonction asynchrone pour charger les données du jeu à partir d'un fichier JSON
async function ChargerDonneeJeu() {
    const fileName = document.getElementById("nomFichier").value || "exemple.json"; // Obtient le nom du fichier ou utilise "exemple.json" par défaut
    currentTurnIndex = 0; // Réinitialise l'index du tour actuel
    try {
        const response = await fetch(fileName); // Charge le fichier JSON
        gameData = await response.json(); // Convertit la réponse en objet JSON
        const boutonvue = document.querySelectorAll('#boutonsVue button'); // Sélectionne tous les éléments bouton dans l'élément avec l'ID 'boutonsVue'
        boutonvue[0].style.display = "flex"; // Retire la classe 'disabled' du premier bouton
        boutonvue[2].style.display = "flex"; // Retire la classe 'disabled' du troisième bouton

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

// Fonction pour changer le thème et le sauvegarder dans le localStorage
function ChangerTheme() {
    const body = document.body; // Récupère l'élément body du document
    const themeToggleButton = document.getElementById("toggleTheme"); // Récupère le bouton de changement de thème

    // Alterne la classe theme-sombre pour changer le thème
    body.classList.toggle("theme-sombre");

    // Sauvegarde le thème choisi dans le localStorage
    if (body.classList.contains("theme-sombre")) {
        localStorage.setItem("theme", "sombre"); // Sauvegarde le thème sombre
        themeToggleButton.innerText = "☀️"; // Change le texte du bouton
    } else {
        localStorage.setItem("theme", "clair"); // Sauvegarde le thème clair
        themeToggleButton.innerText = "🌙"; // Change le texte du bouton
    }
}

// Fonction pour vérifier et appliquer le thème sauvegardé ou celui de l'appareil
function VerifVarPersist() {
    const savedTheme = localStorage.getItem("theme"); // Récupère le thème sauvegardé

    // Vérifie si un thème a été sauvegardé dans le localStorage
    if (savedTheme) {
        if (savedTheme === "sombre") {
            document.body.classList.add("theme-sombre"); // Applique le thème sombre
            document.getElementById("toggleTheme").innerText = "☀️"; // Change le texte du bouton
        } else {
            document.body.classList.remove("theme-sombre"); // Applique le thème clair
            document.getElementById("toggleTheme").innerText = "🌙"; // Change le texte du bouton
        }
    } else {
        // Si aucun thème n'est sauvegardé, on vérifie les préférences du système
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (prefersDarkScheme) {
            document.body.classList.add("theme-sombre"); // Applique le thème sombre par défaut
            document.getElementById("toggleTheme").innerText = "☀️"; // Change le texte du bouton
            localStorage.setItem("theme", "sombre"); // Sauvegarde le thème sombre
        } else {
            document.body.classList.remove("theme-sombre"); // Applique le thème clair par défaut
            document.getElementById("toggleTheme").innerText = "🌙"; // Change le texte du bouton
            localStorage.setItem("theme", "clair"); // Sauvegarde le thème clair
        }
    }
}

// Écouteur d'événement pour s'assurer que le DOM est chargé avant d'appeler la fonction
document.addEventListener("DOMContentLoaded", () => {
    VerifVarPersist(); // Appelle la fonction pour vérifier la variable persistante
});


