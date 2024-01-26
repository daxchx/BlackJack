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

  public init(): void {
    this.table.players.push(new Player('CPU1', 'ai', 'blackjack'))
    this.table.players.push(new Player('You', 'user', 'blackjack'))
    this.table.players.push(new Player('CPU2', 'ai', 'blackjack'))
    this.table.players.push(this.table.house)
    this.view.init()

    document.querySelector<HTMLButtonElement>('#create')?.addEventListener('click', () => {
      this.startOfTheRound()
    })
  }

  private startOfTheRound(): void {
    let players: string[] = []
    for (let player of this.table.players) {
      players.push(player.name)
    }
    this.table.blackjackClearPlayerHandsAndBets()
    this.view.generateTableScene(players)
    this.table.deck.resetDeck()
    this.table.deck.shuffle()
    this.table.gamePhase = 'betting'
    for (let player of this.table.players) {
      player.gameStatus = 'betting'
    }
    console.log(this.table.getTurnPlayer())
    this.betScene()
  }

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

  private cpuBetScene(cpu: Player): void {
    let i = Math.floor(Math.random() * 4)
    this.table.haveTurn(this.table.betDenominations[i])
    this.view.updatabetScene(cpu.name, cpu.bet!)
    this.betScene()
  }

  private userBetScene(user: Player): void {
    this.view.generateUserBetScene(this.table.betDenominations)
    let sum = 0
    const betButtons = document.querySelectorAll<HTMLButtonElement>('.bet-amount')
    for (let button of betButtons) {
      button.addEventListener('click', () => {
        sum += +button.innerHTML
        console.log(sum)
      })
    }

    document.querySelector<HTMLButtonElement>('#confirm-bet')?.addEventListener('click', () => {
      if (sum != 0) {
        this.table.haveTurn(sum)
        this.view.updatabetScene(user.name, user.bet!)
        document.querySelector('#bet-overlay')?.classList.add('hidden')
        this.betScene()
      } else alert('ベットをしてください')
    })
  }

  private dealerBetScene(dealer: Player): void {
    this.table.haveTurn(null)
    this.view.updatabetScene(dealer.name, dealer.bet!)
    this.betScene()
  }

  private actionScene(): void {
    for (let player of this.table.players) {
      this.view.updatePlayerCards(player.name, player.hand)
    }
    if (this.table.gamePhase === 'acting') {
      let tp = this.table.getTurnPlayer()
      if (tp.type == 'ai') setTimeout(() => this.cpuActionScene(tp), 1000)
      else if (tp.type == 'user') setTimeout(() => this.userActionScene(tp), 1000)
      else setTimeout(() => this.dealerActionScene(tp), 1000)
    } else {
      setTimeout(() => this.endOfRound(), 1000)
    }
  }

  private cpuActionScene(cpu: Player): void {
    this.view.updatePlayerCards(cpu.name, cpu.hand)
    this.table.haveTurn(cpu.getHandScore())
    this.view.updateActionScene(cpu.name, cpu.gameStatus)
    this.actionScene()
  }

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

  private dealerActionScene(dealer: Player): void {
    this.view.updatePlayerCards(dealer.name, dealer.hand)
    this.table.haveTurn(dealer.getHandScore())
    this.view.updateActionScene(dealer.name, dealer.gameStatus)
    this.actionScene()
  }

  private endOfRound(): void {
    this.view.generateRoundResultOverlay(this.table.resultsLog)
    document.querySelector<HTMLButtonElement>('#next-round')?.addEventListener('click', () => {
      let target = document.querySelector<HTMLDivElement>('#round-result')
      document.querySelector('#app')!.removeChild(target!)
      this.startOfTheRound()
    })
  }
}
