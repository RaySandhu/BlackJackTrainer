let createDeck = () => {
	//base creation of a deck of cards
	let suits = ['Spades', 'Clubs', 'Hearts', 'Diamonds'];
	let deck = [];
	let id = 0;
	let faces = ['Jack', 'Queen', 'King'];
	for (var i = 1; i <= 13; i++) {
		let cardVal; //accounts for face cards and aces
		if (i == 1) {
			cardVal = 'A';
		} else if (i > 10) {
			cardVal = faces[i - 11];
		} else cardVal = i;
		suits.forEach((suit) => {
			card = {
				//composition of each card in deck
				id: id,
				value: cardVal,
				suit: suit,
			};
			id++;
			deck.push(card);
		});
	}
	return deck;
};
let newDeck = createDeck();

let randomCard = () => {
	//draws a random card and removes that card from existing deck.
	let i = Math.ceil(Math.random() * (newDeck.length - 1));
	let randomCard = newDeck[i];
	// newDeck = newDeck.filter((card) => {
	// 	card.id != randomCard.id;
	// });

	for (let i = 0; i <= newDeck.length - 1; i++) {
		if (newDeck[i].id == randomCard.id) {
			newDeck.splice(i, 1);
		}
	}
	return randomCard;
};

let cardRender = (card) => {
	//draws in the art for cards being dealt
	let CARD_WIDTH = 24;

	let suit = card.suit;
	let value = card.value;
	let infoLine = '';
	for (let i = 0; i <= CARD_WIDTH - suit.length; i++) {
		if (i == 3) {
			typeof value == 'number' && value == 10
				? (i += 1)
				: typeof value == 'string'
				? (i += value.length - 1)
				: i;
			infoLine += value;
		} else if (i == 12) {
			infoLine += suit;
		} else {
			infoLine += ' ';
		}
	}
	let cardColor = 'black';
	if (card.suit == 'Hearts' || card.suit == 'Diamonds') {
		cardColor = 'red';
	}

	return `<pre> <h2 style="background-color: #FAF9F6;
	color: ${cardColor};
	border-radius: 10%; 
	margin-right: 5%; 
	margin-left: -2%";
	margin-top: -2%> 			
                        
${infoLine}
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
			</h2></pre>`;
};

function handValue(hand) {
	let handValue = 0;
	let hasAce = false;
	hand.forEach((card) => {
		if (card.value == 'A' && handValue + 11 <= 21) {
			handValue += 11;
			hasAce = true;
		} else if (card.value == 'A' && handValue + 11 > 21) {
			handValue += 1;
		} else if (typeof card.value == 'string') {
			handValue += 10;
		} else handValue += card.value;

		if (handValue > 21 && hasAce) {
			//handles player busting but with a reducable ace !!! DEALER DOES NOT PLAY SOFTS (fix with multiplayer?)
			handValue -= 10;
			hasAce = false;
		}
	});
	return handValue;
}

let gameStatus = false;
let dealerHand = [];
let playerHand = [];
let stackSize = 100;
let betSize = 0;
let dealerHandValue = handValue(dealerHand);
let playerHandValue = handValue(playerHand);

//html id tags
let playerHandHtml = document.getElementById('playerHand');
let dealerHandHtml = document.getElementById('dealerHand');
let playerScoreHtml = document.getElementById('playerScore');
let dealerScoreHtml = document.getElementById('dealerScore');
let gameResultHtml = document.getElementById('gameResult');
let betSizeHtml = document.getElementById('betSize');
let stackSizeHtml = document.getElementById('stackSize');
let betDisplayHtml = document.getElementById('betDisplay');
let submitBet = document.getElementById('submitBet');
betSizeHtml.setAttribute('max', stackSize);

function initBet() {
	// betting initialize -- only runs when player has submitted bet.
	// also deals new hands, this gives player control of when to start next round.
	if (betSize == 0) {
		betSize = betSizeHtml.value;
		stackSize -= betSize;
		stackSizeHtml.innerHTML = stackSize;
		betDisplayHtml.innerHTML = `<h2>Current bet is: </h2><h3>${betSize}</h3>`;
		submitBet.disabled = true;
	}
	dealerHand = [randomCard()];
	playerHand = [randomCard(), randomCard()];
	dealerHandValue = handValue(dealerHand);
	playerHandValue = handValue(playerHand);

	document.getElementById('hit').disabled = false;
	document.getElementById('pass').disabled = false;

	updatePlayer();
	updateDealer();
}

function updatePlayer() {
	// simply renders the hand from a hit or new deal and updates display for handvalue and stack size.
	playerHandHtml.innerHTML = playerHand
		.map((card) => cardRender(card))
		.join('');
	if (playerHandValue > 21) {
		playerScoreHtml.innerHTML = 'You busted with a ' + playerHandValue;
	} else playerScoreHtml.innerHTML = playerHandValue;

	//betting info
	stackSizeHtml.innerHTML = stackSize;
}

function updateDealer() {
	// simply renders the hand from a pass or new deal and updates display for hand value.
	dealerHandHtml.innerHTML = dealerHand
		.map((card) => {
			return cardRender(card);
		})
		.join('');
	if (dealerHandValue > 21) {
		dealerScoreHtml.innerHTML = 'Dealer busts! You win!';
	} else dealerScoreHtml.innerHTML = dealerHandValue;
}

function updateGameResult() {
	//ends the hand and evaluates win/lose/split situations
	document.getElementById('hit').disabled = true;
	document.getElementById('pass').disabled = true;
	if (
		(dealerHandValue > playerHandValue && dealerHandValue <= 21) ||
		playerHandValue > 21
	) {
		gameResultHtml.innerHTML = 'You Lose!';
	} else if (dealerHandValue == playerHandValue) {
		gameResultHtml.innerHTML = 'Split.';
		stackSize += parseInt(betSize);
		stackSizeHtml.innerHTML = stackSize;
	} else {
		gameResultHtml.innerHTML = 'You Win!';
		stackSize += parseInt(betSize);
		stackSize += parseInt(betSize);
		stackSizeHtml.innerHTML = stackSize;
	}
}

function hit() {
	let newCard = randomCard();
	playerHand.push(newCard);
	playerHandValue = handValue(playerHand);
	if (playerHandValue > 21) {
		updateGameResult();
	}
	updatePlayer();
}

function pass() {
	while (dealerHandValue < 17) {
		let newCard = randomCard();
		dealerHand.push(newCard);
		dealerHandValue = handValue(dealerHand);
		updateDealer();
	}
	updateGameResult();
}

function newDeal() {
	//this is no longer the new deal, it is just a reset of hands and values to betting stage and settling betting from current round

	//only called by player to reset hands and bet size
	newDeck = createDeck();
	dealerHand = [];
	playerHand = [];
	dealerHandValue = handValue(dealerHand);
	playerHandValue = handValue(playerHand);

	gameResultHtml.innerHTML = '';

	//betting info updated for next round
	//updateBet function to replace based on gamestatus?
	betDisplayHtml.innerHTML = '';
	betSize = 0;
	submitBet.disabled = false;
	stackSizeHtml.innerHTML = stackSize;
	betSizeHtml.setAttribute('max', stackSize);
	updatePlayer();
	updateDealer();
}

//initial rendering of hands and scores
playerHandHtml.innerHTML = playerHand.map((card) => cardRender(card)).join('');
dealerHandHtml.innerHTML = dealerHand.map((card) => cardRender(card)).join('');
playerScoreHtml.innerHTML = playerHandValue;
dealerScoreHtml.innerHTML = dealerHandValue;
stackSizeHtml.innerHTML = stackSize;
//initial rendering of hands and scores once a bet has been placed
if (betSize != 0) {
	playerHandHtml.innerHTML = playerHand
		.map((card) => cardRender(card))
		.join('');
	dealerHandHtml.innerHTML = dealerHand
		.map((card) => cardRender(card))
		.join('');
	playerScoreHtml.innerHTML = playerHandValue;
	dealerScoreHtml.innerHTML = dealerHandValue;
	stackSizeHtml.innerHTML = stackSize;
}

window.onload = () => {
	alert(
		`Hello! 

		This is a simple Blackjack game which shuffles the hand on each new deal and Dealer does not hit soft 17.
		Place your bets anytime before your first move. You cannot sit out any hands, split hands, or double down currently.
		
		Enjoy!`
	);
};
