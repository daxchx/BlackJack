export default class Card {
  public suit: string
  public rank: string
  public isFace: boolean

  constructor(suit: string, rank: string) {
    this.suit = suit
    this.rank = rank
    this.isFace = true
  }

  public getRankNumber(): any {
    if (this.rank === 'A') return 11
    else if (this.rank === 'J' || this.rank === 'Q' || this.rank === 'K') return 10
    else return this.rank
  }
}
