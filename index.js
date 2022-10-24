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

let dealtHand = () => {
	//draws in the art for cards being dealt
	let CARD_WIDTH = 28;
	let randomDrawnCard = randomCard();
	let suit = randomDrawnCard.suit;
	let value = randomDrawnCard.value;
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

function deal() {
	location.reload();
}

document.getElementById('playerHand').innerHTML =
	dealtHand() + '<pre>       </pre>' + dealtHand();
document.getElementById('dealerHand').innerHTML = dealtHand();
