import Player from './model/player'
import Table from './model/table'
import View from './view'

export default class Controller {
  private table: Table
  private view: View

  constructor() {
    this.table = new Table('blackjack')
    this.view = new View()
  }

  /**
   * 関数の説明
   *
   * @returns {void}
   */
  public init(): void {
    this.table.players.push(new Player('CPU1', 'ai', 'blackjack'))
    this.table.players.push(new Player('You', 'user', 'blackjack'))
    this.table.players.push(new Player('CPU2', 'ai', 'blackjack'))
    this.table.players.push(this.table.house)
    this.view.init()

    document.querySelector<HTMLButtonElement>('#create')?.addEventListener('click', () => {
      let players: string[] = []
      for (let player of this.table.players) {
        players.push(player.name)
      }
      this.view.generateTableScene(players)
      this.startOfTheRound()
    })
  }

  /**
   * 関数の説明
   *
   * @returns {void}
   */
  private startOfTheRound(): void {
    this.table.deck.resetDeck()
    this.table.deck.shuffle()
    this.table.blackjackClearPlayerHandsAndBets()
    this.table.gamePhase = 'betting'
    for (let player of this.table.players) {
      this.view.updatePlayerStatus(player.name, player.gameStatus)
      this.view.updatePlayerCards(player.name, null)
      if (player.type != 'house') {
        this.view.updatePlayerBet(player.name, player.bet!)
        this.view.updatePlayerChips(player.name, player.chips!)
      }
    }
    this.betScene()
  }

  /**
   * 関数の説明
   *
   * @returns {void}
   */
  private betScene(): void {
    if (this.table.gamePhase === 'betting') {
      let tp = this.table.getTurnPlayer()
      if (tp.type == 'ai') setTimeout(() => this.cpuBetScene(tp), 1000)
      else if (tp.type == 'user') setTimeout(() => this.userBetScene(tp), 1000)
      else setTimeout(() => this.dealerBetScene(tp), 1000)
    } else {
      this.table.blackjackAssignPlayerHands()
      setTimeout(() => this.actionScene(), 1000)
    }
  }

  /**
   * 関数の説明
   *
   * @param {Player} cpu - cpuのプレイヤー情報
   * @returns {void}
   */
  private cpuBetScene(cpu: Player): void {
    let i = Math.floor(Math.random() * 4)
    this.table.haveTurn(this.table.betDenominations[i])
    this.view.updatePlayerBet(cpu.name, cpu.bet!)
    this.view.updatePlayerStatus(cpu.name, cpu.gameStatus)
    this.view.updatePlayerChips(cpu.name, cpu.chips!)
    this.betScene()
  }

  /**
   * 関数の説明
   *
   * @param {Player} user - userのプレイヤー情報
   * @returns {void}
   */
  private userBetScene(user: Player): void {
    this.view.generateUserBetScene(this.table.betDenominations)
    let sum = 0
    const betButtons = document.querySelectorAll<HTMLButtonElement>('.bet-amount')
    for (let button of betButtons) {
      button.addEventListener('click', () => {
        sum += +button.innerHTML
      })
    }

    document.querySelector<HTMLButtonElement>('#confirm-bet')?.addEventListener('click', () => {
      if (sum != 0) {
        this.table.haveTurn(sum)
        this.view.updatePlayerBet(user.name, user.bet!)
        this.view.updatePlayerStatus(user.name, user.gameStatus)
        this.view.updatePlayerChips(user.name, user.chips!)

        let target = document.querySelector<HTMLDivElement>('#bet-overlay')
        document.querySelector<HTMLDivElement>('#app')?.removeChild(target!)
        this.betScene()
      } else alert('ベットをしてください')
    })
  }

  /**
   * 関数の説明
   *
   * @param {Player} dealer - ディーラーの情報
   * @returns {void}
   */
  private dealerBetScene(dealer: Player): void {
    this.table.haveTurn(null)
    this.view.updatePlayerStatus(dealer.name, dealer.gameStatus)
    this.betScene()
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  private actionScene(): void {
    for (let player of this.table.players) {
      this.view.updatePlayerCards(player.name, player.hand)
    }
    if (this.table.gamePhase === 'acting') {
      let tp = this.table.getTurnPlayer()
      if (tp.type == 'ai') setTimeout(() => this.cpuActionScene(tp), 1000)
      else if (tp.type == 'user') setTimeout(() => this.userActionScene(tp), 1000)
      else {
        if (tp.gameStatus == 'waitingForActions') tp.hand[1].isFace = true
        this.view.updatePlayerCards(tp.name, tp.hand)

        setTimeout(() => this.dealerActionScene(tp), 1000)
      }
    } else {
      this.endOfRound()
    }
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  private cpuActionScene(cpu: Player): void {
    this.table.haveTurn(cpu.getHandScore())
    this.view.updateActionScene(cpu.name, cpu.gameStatus)
    setTimeout(() => {
      this.view.updatePlayerCards(cpu.name, cpu.hand)
      this.actionScene()
    }, 1000)
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  private userActionScene(user: Player): void {
    if (user.getHandScore() > 21) {
      this.table.haveTurn('bust')
      this.view.updateActionScene(user.name, user.gameStatus)
      this.actionScene()
    } else {
      this.view.generateActionOverlay(this.table.actionDenominations)
      const actionButtons = document.querySelectorAll<HTMLButtonElement>('.user-action')
      for (let button of actionButtons) {
        button.addEventListener('click', () => {
          let target = document.querySelector<HTMLDivElement>('#action-overlay')
          document.querySelector('#app')!.removeChild(target!)
          this.table.haveTurn(button.innerText)
          this.view.updateActionScene(user.name, user.gameStatus)
          this.actionScene()
        })
      }
    }
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  private dealerActionScene(dealer: Player): void {
    this.table.haveTurn(dealer.getHandScore())
    this.view.updateActionScene(dealer.name, dealer.gameStatus)
    setTimeout(() => {
      this.view.updatePlayerCards(dealer.name, dealer.hand)
      this.actionScene()
    }, 1000)
  }

  /**
   * 関数の説明
   *
   * @param {引数の型} 引数名 - 引数の説明
   * @returns {返り値の型}
   */
  private endOfRound(): void {
    this.view.generateRoundResultOverlay(this.table.resultsLog)
    document.querySelector<HTMLButtonElement>('#next-round')?.addEventListener('click', () => {
      let target = document.querySelector<HTMLDivElement>('#round-result')
      document.querySelector('#app')!.removeChild(target!)
      this.startOfTheRound()
    })
  }
}
