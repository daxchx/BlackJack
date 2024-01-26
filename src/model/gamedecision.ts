export default class GameDecision {
  public action: string | null
  public amount: number | null

  constructor(action: string | null, amount: number | null) {
    this.action = action
    this.amount = amount
  }
}
