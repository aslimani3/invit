/* ============================================================
   CONFIGURATION
   ------------------------------------------------------------
   Change juste la date ci-dessous (mois, jour) pour qu'elle
   corresponde au véritable anniversaire de la personne.
   Le mois est indexé à partir de 0 (0 = janvier, 11 = décembre).
   ============================================================ */
const BIRTHDAY_MONTH = 7;  // 8 = septembre
const BIRTHDAY_DAY   = 28; // exemple : 14 septembre — à adapter

/* ============================================================
   RÉFÉRENCES AUX ÉLÉMENTS DU DOM
   ============================================================ */
const envelope       = document.getElementById('envelope');
const heartBtn        = document.getElementById('heartBtn');
const envelopeStage    = document.getElementById('envelope-stage');
const cardStage        = document.getElementById('card-stage');
const cardActions      = document.getElementById('cardActions');
const noBtn            = document.getElementById('noBtn');
const yesBtn           = document.getElementById('yesBtn');
const confettiLayer    = document.getElementById('confettiLayer');
const successMessage   = document.getElementById('successMessage');
const counterNumber    = document.getElementById('counterNumber');

/* ============================================================
   ÉTAPE 1 -> ÉTAPE 2 : ouverture de l'enveloppe
   ============================================================ */
heartBtn.addEventListener('click', openEnvelope);

function openEnvelope() {
  // Empêche un double-clic de relancer l'animation
  heartBtn.disabled = true;

  // Ajoute la classe qui déclenche le rabat (rotateX) en CSS
  envelope.classList.add('envelope--open');

  // On attend la fin de l'animation d'ouverture avant de révéler la carte
  setTimeout(() => {
    envelopeStage.classList.remove('stage--visible');
    envelopeStage.classList.add('stage--hidden');

    cardStage.classList.remove('stage--hidden');
    cardStage.classList.add('stage--visible');

    startCountdown(); // calcule le nombre de jours dès que la carte apparaît
  }, 750);
}

// Rend la scène 1 visible dès le chargement (transition douce gérée en CSS)
window.addEventListener('load', () => {
  envelopeStage.classList.add('stage--visible');
});

/* ============================================================
   BOUTON "NON" — il fuit le curseur/le doigt
   ============================================================ */
noBtn.addEventListener('mouseenter', dodgeNoButton);
noBtn.addEventListener('click', (event) => {
  // Sécurité : si jamais le clic aboutit (ex. clavier), on esquive quand même
  event.preventDefault();
  dodgeNoButton();
});

function dodgeNoButton() {
  const zone = cardActions.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  // Marge de sécurité pour ne pas sortir de la carte
  const maxX = Math.max(zone.width - btn.width, 0);
  const maxY = Math.max(zone.height - btn.height, 0);

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  // Passe en position absolue pour pouvoir se déplacer librement dans la zone
  noBtn.classList.add('is-dodging');
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
}

/* ============================================================
   BOUTON "OUI" — confettis + redirection vers prep.html
   ============================================================ */
yesBtn.addEventListener('click', () => {
  launchConfetti();
  yesBtn.disabled = true;
  noBtn.style.visibility = 'hidden';
  if (successMessage) {
    successMessage.hidden = false;
  }

  // Redirection vers la page de préparation après 1.5 seconde
  setTimeout(() => {
    window.location.href = 'prep.html';
  }, 1500);
});

function launchConfetti() {
  const colors = ['#C9A24B', '#D9A88F', '#7A2C3E', '#C48A94'];
  const pieceCount = 40;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';

    // Position de départ aléatoire en haut de la carte
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Chaque confetti tombe à une vitesse et avec un délai légèrement différents
    const duration = 1.4 + Math.random() * 1.2;
    const delay = Math.random() * 0.3;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;

    // Certains confettis sont ronds plutôt que carrés, pour varier
    if (Math.random() > 0.5) {
      piece.style.borderRadius = '50%';
    }

    confettiLayer.appendChild(piece);

    // Nettoyage : on retire l'élément du DOM une fois l'animation terminée
    piece.addEventListener('animationend', () => piece.remove());
  }
}

/* ============================================================
   COMPTEUR DE JOURS AVANT L'ANNIVERSAIRE
   ============================================================ */
function startCountdown() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let nextBirthday = new Date(today.getFullYear(), BIRTHDAY_MONTH, BIRTHDAY_DAY);

  // Si la date est déjà passée cette année, on vise l'année suivante
  if (nextBirthday < today) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.round((nextBirthday - today) / msPerDay);

  counterNumber.textContent = daysLeft;
}