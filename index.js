let createDeck = () => {
	//base creation of a deck of cards
	let suits = ['Spades', 'Clubs', 'Hearts', 'Diamonds'];
	let deck = [];
	let id = 0;
	let faces = ['Jack', 'Queen', 'King'];
	for (var i = 1; i <= 13; i++) {
		suits.forEach((suit) => {
			card = {
				//composition of each card in deck
				id: id,
				value: i <= 10 ? i : faces[i - 11], //accounts for face cards
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

	return `<pre>
 ---------------------------
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
 ---------------------------
</pre>`;
};

let dealerHand = [randomCard()];
let playerHand = [randomCard(), randomCard()];

let dealerHandValue = cardValue(dealerHand[0]);
let playerHandValue = cardValue(playerHand[0]) + cardValue(playerHand[1]);

function newDeal() {
	newDeck = createDeck();
	dealerHand = dealerHand.push(randomCard());
	playerHand = playerHand.push(randomCard(), randomCard());
}

function cardValue(card) {
	if (typeof card.value == 'string') {
		return 10;
	} else return card.value;
}

//initial renders of hands
let playerHandHtml = document.getElementById('playerHand');
playerHandHtml.innerHTML = playerHand.map((card) => cardRender(card));
let dealerHandHtml = document.getElementById('dealerHand');
dealerHandHtml.innerHTML = dealerHand.map((card) => cardRender(card));

function hit() {
	playerHand.push(randomCard());
	playerHandHtml.innerHTML = playerHand.map((card) => cardRender(card));
}

function pass() {
	while (dealerHandValue < 17) {
		dealerHand.push(randomCard());
		dealerHandValue += cardValue(dealerHand[dealerHand.length - 1]);
		// console.log(dealerHand, dealerHandValue);
		dealerHandHtml.innerHTML = dealerHand.map((card) => cardRender(card));
	}
}
