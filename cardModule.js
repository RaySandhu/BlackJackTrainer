let createDeck = () => {
	let suits = ['Spades', 'Clubs', 'Hearts', 'Diamonds'];
	let deck = [];
	for (let i = 0; i <= 13; i++) {
		suits.forEach((suit) => {
			deck.push(i, suit);
		});
	}
	return deck;
};

export default createDeck;
