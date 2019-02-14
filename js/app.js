
//// Initialize variables to hold game play
const deck = document.querySelector('.deck');
let numMoves = 0;
let startTime = undefined;
let timeElapsed = undefined;
let gameCompleted = false;
let numTiles = 16;
let openList = [];
const symbols = ['fa-diamond', 'fa-bomb', 'fa-star', 'fa-leaf', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane', 'fa-cube'];

//// Checks on initilization

// Require number of tiles to be even so that every tile has a match
if (numTiles % 2 !== 0) {
  numTiles = numTiles - 1;
}

// Create list of symbols in gameplay
const symbolsInGame = symbols.slice(0,numTiles/2);




// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Initialize Game and/or reset

function deleteAllCards() {
  while (deck.children.length > 0) {
    deck.firstElementChild.remove();
  }
}

// Create HTML Element and associated detail for cards
function createCardElement(symbol) {
  card = document.createElement('li');
  card.className = "card";
  card.innerHTML = `<i class="fa ${symbol}"></i>`;
  return card;
}

// Create HTMLElements associated with symbols and add them to document
function createCards(randomizedSymbolList) {
  const fragment = document.createDocumentFragment();
  for (symbol of randomizedSymbolList) {
      const newCard = createCardElement(symbol);
      fragment.appendChild(newCard);
  }
  deck.appendChild(fragment);
}

function resetStats() {
  document.querySelector('.timer').innerText = 0.0;
  document.querySelector('.moves').innerText = 0;
  numMoves = 0;
  startTime = undefined;
  timeElapsed = undefined;
  gameCompleted = false;
}

function reset(symbolsInGame) {
  // Reset Game Details including time elapsed and number of moves
  resetStats();
  // If cards exists, delete existing tiles
  if (deck.children.length > 0) {
    deleteAllCards();
  }
  // Randomize symbols and add back in cards;
  randomizedSymbolList = shuffle(symbolsInGame);
  createCards(randomizedSymbolList);
}

// Initialize Game
reset([...symbolsInGame, ...symbolsInGame]);





/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


//// Functions to faciliate gameplay including clicking on cards and matching criteria
function displaySymbol(card) {
  card.className = "card show";
};


function addToOpenList(card) {
  openList.push(card);
  card.className = "card show open"
};

function onMatch() {
  for (card of openList) {
    card.className = "card show match"
  };
};

function onMismatch() {
  for (card of openList) {
    card.className = "card";
  }
};

function cardMatchCheck() {
  incrementMoveCounter();
  if (openList[0].firstElementChild.className === openList[1].firstElementChild.className) {
    onMatch();
    openList = []
  }
  else {
    setTimeout (function() {
      onMismatch();
      openList = [];
    }, 500);
  };
}

function incrementMoveCounter() {
  moves = document.querySelector('.moves');
  numMoves = numMoves + 1;
  moves.innerText = numMoves;
}

function updateTimer() {
  if (startTime && !gameCompleted) {
    timeElapsed = parseFloat((performance.now() - startTime)/1000).toFixed(1);
    document.querySelector('.timer').innerText = timeElapsed;
    setTimeout(updateTimer,50);
  }
}


//TODO add in modal box with game info and buttons to start new game;
//TODO add in scoring for stars based on number of moves/time elapsed;  
function gameCompleteCheck() {
  let cardList = document.querySelectorAll('.card');
  let gameCompleted = true;
  for (card of cardList) {
    gameCompleted = gameCompleted && card.classList.contains('match');
  }
  return gameCompleted;
}


// Add event listener to react to click on card
deck.addEventListener('click', function(event) {
  if (event.target.className === "card") {
    // Start Timer On First Tile Click
    if (!startTime) {
      startTime = performance.now();
      updateTimer()
    }

    //Display tile after it's clicked and add it to list of currently opened cards
    displaySymbol(event.target);
    addToOpenList(event.target);
    // If there is another open card, check if new card matches
    if (openList.length == 2) {
     cardMatchCheck();
    };
    // Update check to see whether game is done;
    gameCompleted = gameCompleteCheck()
    if (gameCompleted) {
      console.log(`Woo! Game completed in ${timeElapsed} seconds`)// TODO Make gamecomplete hovering modal appear with details
    }
  }
});

// Add event listener to reset game
restart = document.querySelector('.restart')
restart.addEventListener('click', function() {
    reset([...symbolsInGame, ...symbolsInGame]);
  }
);
//// Debugging Functions
// Function to automatically win the game
function winGame() {
  for (card of deck.children) {
    card.className = "card show match";
  }
  gameCompleted = true;
}
