import Deck from './deck'
import GameDecision from './gamedecision'
import Player from './player'

export default class Table {
  public gameType: string
  public gamePhase: string
  public turnCounter: number
  public roundCounter: number
  public deck: Deck
  public house: Player
  public players: Player[]
  public actionDenominations: string[]
  public betDenominations: number[]
  public resultsLog: string[][]

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

  /**
   * プレイヤーが取った行動を評価し、それに応じてゲームの状態を更新
   *
   * @param {GameDecision} decision - プレイヤーの決断
   * @returns {void}
   */
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
        tp.chips! = tp.chips! - tp.bet!
        tp.bet! = tp.bet! * 2
        tp.winAmount = Math.floor(tp.bet! * 2)
        tp.hand.push(this.deck.drawOne())
        if (tp.getHandScore() > 21) {
          tp.gameStatus = 'bust'
        }
        break
      case 'bust':
        tp.gameStatus = 'bust'
        tp.bet = 0
    }

    if (this.gamePhase == 'betting' && this.onLastPlayer()) {
      this.gamePhase = 'acting'
      this.house.gameStatus = 'waitingForActions'
    } else if (this.gamePhase == 'acting' && this.onLastPlayer()) {
      if (this.allPlayerActionsResolved()) {
        this.gamePhase = 'roundOver'
        this.blackjackEvaluateAndGetRoundResults()
        this.roundCounter--
        console.log(this.roundCounter)
      }
    }
  }

  /**
   * 所持チップが最も多い順にソートしたプレイヤー配列を取得
   * @returns {Player}
   */
  public getPlayerWithTheMostChips(): string[][] {
    let chipsArr: number[] = [] // 20 100
    let ranking: string[][] = [] // [[], [], []]
    let players: Player[] = [] // 20 20 100
    this.players.map((player) => {
      if (player.type != 'house') players.push(player)
    })
    players.map((player) => {
      ranking.push([])
      if (chipsArr.indexOf(player.chips!) == -1) chipsArr.push(player.chips!)
    })
    chipsArr.sort((a, b) => (a > b ? -1 : 1))
    console.log(chipsArr)
    for (let i = 0; i < players.length; i++) {
      let index = chipsArr.indexOf(players[i].chips!)
      ranking[index].push(`${players[i].name} chips:${players[i].chips}`)
    }

    return ranking
  }

  /**
   * 関数の説明
   *
   * @param {number | string | null} userData - 引数の説明
   * @returns {void}
   */
  public haveTurn(userData: number | string | null): void {
    let tp = this.getTurnPlayer()

    if (this.gamePhase == 'betting') {
      if (tp.type != 'house') this.evaluateMove(tp.promptPlayer(userData))
      else this.evaluateMove(tp.promptPlayer(null))
    } else if (this.gamePhase == 'acting') this.evaluateMove(tp.promptPlayer(userData))

    if (tp.gameStatus != 'hit') this.turnCounter++
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  public blackjackEvaluateAndGetRoundResults(): string[][] {
    let house = this.house
    let result = []
    for (let i = 0; i < this.players.length - 1; i++) {
      let player = this.players[i]

      if (player.gameStatus == 'surrender') {
        player.winAmount = -player.winAmount!
        player.chips! += player.bet! + player.winAmount
      } else if (player.gameStatus == 'bust') {
        player.winAmount = -player.winAmount!
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

      result.push(`${player.name.toUpperCase()}: ${player.gameStatus}, bet:${player.bet}, won:${player.winAmount}`)
      if (player.type != 'house') player.bet! = 0
    }
    this.resultsLog.push(result)

    return this.resultsLog
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  public playerHandOfBlackjack(player: Player): boolean {
    if (player.hand.length == 2) {
      if (player.getHandScore() == 21) {
        if ((player.hand[0].rank == 'A' && player.hand[1].rank == 'J') || player.hand[1].rank == 'Q' || player.hand[1].rank == 'K') {
          return true
        } else if ((player.hand[1].rank == 'A' && player.hand[0].rank == 'J') || player.hand[0].rank == 'Q' || player.hand[0].rank == 'K') {
          return true
        } else return false
      } else return false
    } else return false
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  public blackjackAssignPlayerHands(): void {
    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < 2; j++) {
        if (this.players[i].type == 'house' && j == 1) {
          let card = this.deck.drawOne()
          card.isFace = false
          this.players[i].hand.push(card)
        } else this.players[i].hand.push(this.deck.drawOne())
      }
    }
  }

  /**
   * プレイヤーの手札とステータスと賭け金の初期化
   *
   * @returns {void}
   */
  public blackjackClearPlayerHandsAndBets(): void {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].type != 'house') {
        this.players[i].gameStatus = 'betting'
        this.players[i].bet = 0
        this.players[i].winAmount = 0
      } else {
        this.players[i].gameStatus = 'waitingForBets'
      }
      this.players[i].hand = []
    }
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  public getTurnPlayer(): Player {
    let roundIndex = this.turnCounter % this.players.length
    let turnPlayer = {}
    if (roundIndex == 4) turnPlayer = this.house
    else turnPlayer = this.players[roundIndex]
    return turnPlayer as Player
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  public onFirstPlayer(): boolean {
    let tp = this.getTurnPlayer()
    return this.players.indexOf(tp as Player) == 0
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  public onLastPlayer(): boolean {
    let tp = this.getTurnPlayer()
    return this.players.indexOf(tp as Player) == this.players.length - 1
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  public allPlayerActionsResolved(): boolean {
    let array = []
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].gameStatus == 'double' || this.players[i].gameStatus == 'bust' || this.players[i].gameStatus == 'stand' || this.players[i].gameStatus == 'surrender') {
        array.push(1)
      } else array.push(0)
    }

    return array.indexOf(0) == -1
  }
}
