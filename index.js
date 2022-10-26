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
	let CARD_WIDTH = 28;

	let suit = card.suit;
	let value = card.value;
	let infoLine = '';
	for (let i = 0; i <= CARD_WIDTH - suit.length; i++) {
		if (i == 5) {
			typeof value == 'number' && value == 10
				? (i += 1)
				: typeof value == 'string'
				? (i += value.length - 1)
				: i;
			infoLine += value;
		} else if (i == 17) {
			infoLine += suit;
		} else {
			infoLine += ' ';
		}
	}

	return `<pre> <h2 style="background-color: #FAF9F6; border-radius: 10%"> ----------------------------
|                            |
|${infoLine}|
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
|                            |
 ----------------------------</h2></pre>`;
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
			//handles player busting but with a reducable ace
			handValue -= 10;
			hasAce = false;
		}
	});
	return handValue;
}
let dealerHand = [randomCard()];
let playerHand = [randomCard(), randomCard()];

let dealerHandValue = handValue(dealerHand);
let playerHandValue = handValue(playerHand);

//html id tags
let playerHandHtml = document.getElementById('playerHand');
let dealerHandHtml = document.getElementById('dealerHand');
let playerScoreHtml = document.getElementById('playerScore');
let dealerScoreHtml = document.getElementById('dealerScore');
let gameResultHtml = document.getElementById('gameResult');

function updatePlayer() {
	playerHandHtml.innerHTML = playerHand
		.map((card) => cardRender(card))
		.join('');
	if (playerHandValue > 21) {
		playerScoreHtml.innerHTML = 'You busted with a ' + playerHandValue;
	} else playerScoreHtml.innerHTML = playerHandValue;
}
function updateDealer() {
	dealerHandHtml.innerHTML = dealerHand
		.map((card) => {
			// setInterval(null, 2000); how to stagger dealer show?
			return cardRender(card);
		})
		.join('');
	if (dealerHandValue > 21) {
		dealerScoreHtml.innerHTML = 'Dealer busts! You win!';
	} else dealerScoreHtml.innerHTML = dealerHandValue;
}

function updateGameResult() {
	document.getElementById('hit').disabled = true;
	document.getElementById('pass').disabled = true;
	if (
		(dealerHandValue > playerHandValue && dealerHandValue <= 21) ||
		playerHandValue > 21
	) {
		gameResultHtml.innerHTML = 'You Lose!';
	} else if (dealerHandValue == playerHandValue) {
		gameResultHtml.innerHTML = 'Split.';
	} else gameResultHtml.innerHTML = 'You Win!';
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
	newDeck = createDeck();
	dealerHand = [randomCard()];
	playerHand = [randomCard(), randomCard()];
	dealerHandValue = handValue(dealerHand);
	playerHandValue = handValue(playerHand);
	updatePlayer();
	updateDealer();
	document.getElementById('hit').disabled = false;
	document.getElementById('pass').disabled = false;
	gameResultHtml.innerHTML = '';
}

//initial rendering of hands and scores
playerHandHtml.innerHTML = playerHand.map((card) => cardRender(card)).join('');
dealerHandHtml.innerHTML = dealerHand.map((card) => cardRender(card)).join('');
playerScoreHtml.innerHTML = playerHandValue;
dealerScoreHtml.innerHTML = dealerHandValue;
