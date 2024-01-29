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
   * ゲームの初期化
   * @returns {void}
   */
  public init(): void {
    this.table.players.push(new Player('cpu1', 'ai', 'blackjack'))
    this.table.players.push(new Player('cpu2', 'ai', 'blackjack'))
    this.table.players.push(new Player('you', 'user', 'blackjack'))
    this.table.players.push(this.table.house)
    this.view.renderStartScene()

    document.querySelector<HTMLButtonElement>('#create')?.addEventListener('click', () => {
      let players: string[] = []
      for (let player of this.table.players) {
        if (player.type != 'house') players.push(player.name)
      }
      this.table.roundCounter = +document.querySelector<HTMLInputElement>('#round')!.value
      this.view.renderBlackjackScene(players)
      this.startOfTheRound()
    })
  }

  /**
   * ラウンドの開始
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
      this.view.updatePlayerScore(player.name, player.getHandScore())
      if (player.type != 'house') {
        this.view.updatePlayerBet(player.name, player.bet!)
        this.view.updatePlayerChips(player.name, player.chips!)
      }
    }
    this.betScene()
  }

  /**
   * ベットシーン
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
      setTimeout(() => {
        this.table.blackjackAssignPlayerHands()
        for (let player of this.table.players) {
          this.view.updatePlayerCards(player.name, player.hand)
          if (player.type != 'house') this.view.updatePlayerScore(player.name, player.getHandScore())
        }
        this.actionScene()
      }, 1000)
    }
  }

  /**
   * CPUベット
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
   * ユーザーベット
   *
   * @param {Player} user - userのプレイヤー情報
   * @returns {void}
   */
  private userBetScene(user: Player): void {
    this.view.renderBetOverlay(this.table.betDenominations)
    let sum = 0
    const betButtons = document.querySelectorAll<HTMLButtonElement>('.bet-amount')
    for (let button of betButtons) {
      button.addEventListener('click', () => {
        sum += +button.innerHTML
        this.view.updatePlayerBet(user.name, sum)
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
   * ディーラーベット
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
   * アクションシーン
   *
   * @returns {void}
   */
  private actionScene(): void {
    if (this.table.gamePhase === 'acting') {
      let tp = this.table.getTurnPlayer()
      if (tp.type == 'ai') setTimeout(() => this.cpuActionScene(tp), 1000)
      else if (tp.type == 'user') setTimeout(() => this.userActionScene(tp), 1000)
      else {
        if (tp.gameStatus == 'waitingForActions') {
          tp.hand[1].isFace = true
          this.view.updatePlayerScore(tp.name, tp.getHandScore())
          this.view.updatePlayerCards(tp.name, tp.hand)
        }
        setTimeout(() => this.dealerActionScene(tp), 1000)
      }
    } else {
      this.endOfRound()
    }
  }

  /**
   * CPUアクション
   *
   * @param {Player} cpu - cpu情報
   * @returns {void}
   */
  private cpuActionScene(cpu: Player): void {
    this.table.haveTurn(cpu.getHandScore())
    this.view.updatePlayerStatus(cpu.name, cpu.gameStatus)
    setTimeout(() => {
      this.view.updatePlayerBet(cpu.name, cpu.bet!)
      this.view.updatePlayerCards(cpu.name, cpu.hand)
      this.view.updatePlayerScore(cpu.name, cpu.getHandScore())
      this.actionScene()
    }, 1000)
  }

  /**
   * ユーザーアクション
   *
   * @param {Player} user - ユーザー情報
   * @returns {void}
   */
  private userActionScene(user: Player): void {
    if (user.getHandScore() > 21) {
      this.table.haveTurn('bust')
      this.view.updatePlayerChips(user.name, user.chips!)
      this.view.updatePlayerBet(user.name, user.bet!)
      this.view.updatePlayerStatus(user.name, user.gameStatus)
      this.actionScene()
    } else {
      this.view.rednerActionOverlay(this.table.actionDenominations)
      const actionButtons = document.querySelectorAll<HTMLButtonElement>('.user-action')
      for (let button of actionButtons) {
        button.addEventListener('click', () => {
          let target = document.querySelector<HTMLDivElement>('#action-overlay')
          document.querySelector('#app')!.removeChild(target!)
          this.table.haveTurn(button.innerText)
          this.view.updatePlayerStatus(user.name, user.gameStatus)
          this.view.updatePlayerChips(user.name, user.chips!)
          this.view.updatePlayerBet(user.name, user.bet!)
          setTimeout(() => {
            this.view.updatePlayerCards(user.name, user.hand)
            this.view.updatePlayerScore(user.name, user.getHandScore())
            this.actionScene()
          }, 1000)
        })
      }
    }
  }

  /**
   * ディーラーアクション
   *
   * @param {Player} dealer - ディーラー情報
   * @returns {void}
   */
  private dealerActionScene(dealer: Player): void {
    this.table.haveTurn(dealer.getHandScore())
    this.view.updatePlayerStatus(dealer.name, dealer.gameStatus)
    setTimeout(() => {
      this.view.updatePlayerCards(dealer.name, dealer.hand)
      this.view.updatePlayerScore(dealer.name, dealer.getHandScore())
      this.actionScene()
    }, 1000)
  }

  /**
   * ラウンド終了シーン
   *
   * @returns {void}
   */
  private endOfRound(): void {
    this.view.renderRoundResultOverlay(this.table.resultsLog)
    for (let player of this.table.players) {
      if (player.type != 'house') {
        this.view.updatePlayerBet(player.name, player.bet!)
      }
    }
    if (this.table.roundCounter == 0) setTimeout(() => this.endGame(), 1000)
    else {
      document.querySelector<HTMLButtonElement>('#next-round')?.addEventListener('click', () => {
        let target = document.querySelector<HTMLDivElement>('#round-result')
        document.querySelector('#app')!.removeChild(target!)
        this.startOfTheRound()
      })
    }
  }

  /**
   * ゲーム終了シーン
   *
   * @returns {void}
   */
  private endGame(): void {
    let playersChips = []
    for (let player of this.table.players) {
      playersChips.push(player.name + player.chips)
    }
    console.log(this.table.getPlayerWithTheMostChips())
    this.view.renderGameOverScene(this.table.getPlayerWithTheMostChips())

    document.querySelector<HTMLButtonElement>('#back')?.addEventListener('click', () => {
      let controller = new Controller()
      controller.init()
    })
  }
}
