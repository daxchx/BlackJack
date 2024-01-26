import Deck from './deck'
import GameDecision from './gamedecision'
import Player from './player'

export default class Table {
  gameType: string
  betDenominations: number[]
  actionDenominations: string[]
  deck: Deck
  players: Player[]
  house: Player
  gamePhase: string
  resultsLog: string[][]
  turnCounter: number
  roundCounter: number

  constructor(gameType: string, betDenominations: number[] = [5, 20, 50, 100], actionDenominations: string[] = ['surrender', 'stand', 'hit', 'double']) {
    this.gameType = gameType
    this.betDenominations = betDenominations
    this.actionDenominations = actionDenominations
    this.deck = new Deck(this.gameType)
    this.players = []
    this.house = new Player('house', 'house', this.gameType)
    this.gamePhase = 'betting'
    this.resultsLog = []
    this.turnCounter = 0
    this.roundCounter = 0
  }

  private evaluateMove(decision: GameDecision): void {
    let tp = this.getTurnPlayer() as Player
    switch (decision.action) {
      case 'bet':
        tp.gameStatus = 'bet'
        tp.bet = decision.amount
        tp.chips! -= decision.amount!
        break
      case 'surrender':
        tp.gameStatus = 'surrender'
        tp.winAmount = Math.floor(tp.bet! / 2)
        tp.chips! += tp.winAmount
        break
      case 'stand':
        tp.gameStatus = 'stand'
        tp.winAmount = tp.bet
        break
      case 'hit':
        tp.gameStatus = 'hit'
        tp.winAmount = tp.bet
        tp.hand.push(this.deck.drawOne())
        break
      case 'double':
        tp.gameStatus = 'double'
        tp.winAmount = Math.floor(tp.bet! * 2)
        tp.hand.push(this.deck.drawOne())
        if (tp.getHandScore() > 21) {
          tp.gameStatus = 'bust'
        }
        break
      case 'bust':
        tp.gameStatus = 'bust'
    }

    if (this.gamePhase == 'betting' && this.onLastPlayer()) {
      this.gamePhase = 'acting'
      this.house.gameStatus = 'waitingForActions'
    } else if (this.gamePhase == 'acting' && this.onLastPlayer()) {
      if (this.allPlayerActionsResolved()) {
        this.gamePhase = 'roundOver'
        this.blackjackEvaluateAndGetRoundResults()
        this.roundCounter++
      }
    }
  }

  public haveTurn(userData: number | string | null): void {
    let tp = this.getTurnPlayer()

    if (this.gamePhase == 'betting') {
      if (tp.type != 'house') {
        this.evaluateMove(tp.promptPlayer(userData))
      } else {
        this.evaluateMove(tp.promptPlayer(null))
      }
    } else if (this.gamePhase == 'acting') {
      console.log(tp.name)
      this.evaluateMove(tp.promptPlayer(userData))
    } else {
      // round over
      console.log('roundOver')
      this.blackjackEvaluateAndGetRoundResults()
    }

    if (tp.gameStatus != 'hit') {
      this.turnCounter++
    }
  }

  blackjackEvaluateAndGetRoundResults() {
    let house = this.players[3]
    let result = []
    for (let i = 0; i < this.players.length - 1; i++) {
      let player = this.players[i]

      if (player.gameStatus == 'surrender') {
        player.winAmount = -player.winAmount!
        player.chips! += player.bet! + player.winAmount
      } else if (player.gameStatus == 'bust') {
        player.winAmount = -player.winAmount!
        player.chips! += player.winAmount + player.bet!
      } else if (player.gameStatus == 'stand' || player.gameStatus == 'double') {
        if (this.playerHandOfBlackjack(house)) {
          if (this.playerHandOfBlackjack(player)) {
            player.winAmount = player.bet
            player.chips! += player.winAmount!
          } else {
            player.winAmount = -player.winAmount!
          }
        } else if (this.playerHandOfBlackjack(player)) {
          player.winAmount = Math.floor(player.winAmount! * 1.5)
          player.chips! += player.winAmount
        } else {
          if (house.getHandScore() > 21) {
            player.chips! += player.winAmount!
          } else if (player.getHandScore() > house.getHandScore()) {
            player.chips! += player.winAmount!
          } else {
            player.winAmount = -player.winAmount!
            player.chips! += player.bet! + player.winAmount
          }
        }
      }

      result.push(`name: ${player.name}, action: ${player.gameStatus}, bet: ${player.bet}, won: ${player.winAmount}`)
    }
    this.resultsLog.push(result)

    return this.resultsLog
  }

  playerHandOfBlackjack(player: Player) {
    if (player.hand.length == 2) {
      if (player.getHandScore() == 21) {
        if ((player.hand[0].rank == 'A' && player.hand[1].rank == 'J') || player.hand[1].rank == 'Q' || player.hand[1].rank == 'K') {
          return true
        } else if ((player.hand[1].rank == 'A' && player.hand[0].rank == 'J') || player.hand[0].rank == 'Q' || player.hand[0].rank == 'K') {
          return true
        } else return false
      } else return false
    }
  }

  // プレイヤーにカードを配る
  blackjackAssignPlayerHands() {
    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < 2; j++) {
        this.players[i].hand.push(this.deck.drawOne())
      }
    }
  }

  blackjackClearPlayerHandsAndBets() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].hand = []
      this.players[i].bet = 0
    }
  }

  public getTurnPlayer(): Player {
    let roundIndex = this.turnCounter % this.players.length
    let turnPlayer = {}
    if (roundIndex == 4) turnPlayer = this.house
    else turnPlayer = this.players[roundIndex]
    return turnPlayer as Player
  }

  onFirstPlayer() {
    let tp = this.getTurnPlayer()
    return this.players.indexOf(tp as Player) == 0
  }

  onLastPlayer() {
    let tp = this.getTurnPlayer()
    return this.players.indexOf(tp as Player) == this.players.length - 1
  }

  allPlayerActionsResolved() {
    let array = []
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].gameStatus == 'double' || this.players[i].gameStatus == 'bust' || this.players[i].gameStatus == 'stand' || this.players[i].gameStatus == 'surrender') {
        array.push(1)
      } else array.push(0)
    }

    return array.indexOf(0) == -1
  }
}
