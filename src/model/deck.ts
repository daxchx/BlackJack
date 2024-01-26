import Card from "./card";

export default class Deck {
  public gameType: string;
  public cards: Card[];

  constructor(gameType: string) {
    this.gameType = gameType;
    this.cards = [];

    if (this.gameType === "blackjack") {
      const suits = ["H", "D", "C", "S"];
      const values = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
      ];

      for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
          this.cards.push(new Card(suits[i], values[j]));
        }
      }
    }
  }

  public shuffle(): void {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }

  public resetDeck(): void {
    let newCards = new Deck(this.gameType);
    this.cards = newCards.cards;
  }

  public drawOne(): Card {
    return this.cards.pop() as Card;
  }
}
