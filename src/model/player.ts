import Card from './card'
import GameDecision from './gamedecision'

export default class Player {
  name: string
  type: string
  gameType: string
  hand: Card[]
  chips: number | null
  bet: number | null
  winAmount: number | null
  gameStatus: string

  constructor(name: string, type: string, gameType: string, chips: number = 400) {
    this.name = name
    this.type = type
    this.gameType = gameType
    this.hand = []
    this.chips = type != 'house' ? chips : null
    this.bet = type != 'house' ? 0 : null
    this.winAmount = type != 'house' ? 0 : null
    this.gameStatus = type != 'house' ? 'betting' : 'waitingForBets'
  }

  // プレイヤーがどのようなアクションを取るべきかを判断する
  promptPlayer(userData: number | string | null) {
    let action: GameDecision = new GameDecision(null, null)
    if (this.gameStatus == 'betting' && this.type != 'house') {
      action = new GameDecision('bet', userData as number)
    } else if (this.gameStatus == 'bet' || this.gameStatus == 'hit' || this.gameStatus == 'waitingForActions') {
      switch (this.type) {
        case 'ai':
          const cpuHandScore = userData as number
          if (cpuHandScore > 21) {
            action = new GameDecision('bust', null)
          } else if (cpuHandScore >= 15) {
            action = new GameDecision('stand', null)
          } else if (cpuHandScore <= 14) {
            action = new GameDecision('hit', null)
          }
          break
        case 'user':
          const userAction = userData as string
          action = new GameDecision(userAction, null)
          break
        case 'house':
          const dealerHandScore = userData as number
          if (dealerHandScore > 21) {
            action = new GameDecision('bust', null)
          } else if (dealerHandScore >= 18) {
            action = new GameDecision('stand', null)
          } else if (dealerHandScore <= 17) {
            action = new GameDecision('hit', null)
          }
          break
      }
    }
    return action
  }

  // プレイヤーの手札にあるすべてのカードの合計値を返す
  public getHandScore(): number {
    let score = 0
    for (let i = 0; i < this.hand.length; i++) {
      score += +this.hand[i].getRankNumber()
    }

    let newScore = 0
    if (score > 21) {
      for (let i = 0; i < this.hand.length; i++) {
        if (this.hand[i].getRankNumber() == 11) {
          newScore += 1
        } else {
          newScore += +this.hand[i].getRankNumber()
        }
      }

      return newScore
    }

    return score
  }
}
