import Card from './model/card'
import Player from './model/player'

const config = {
  root: document.querySelector<HTMLDivElement>('#app'),
}

export default class View {
  private displayNone(): void {
    config.root!.innerHTML = ''
  }

  public init(): void {
    this.displayNone()
    config.root!.innerHTML = `
    <input type="number" min="0" max="100" placeholder="how many round do you play?" />
    <button id="create">create game</button>
    `
  }

  public generateTableScene(players: string[]): void {
    this.displayNone()
    let container = document.createElement('div')
    for (let player of players) {
      let element = document.createElement('div')
      element.innerHTML = `
        <div id="${player}" class="flex">
            <div id="${player}">${player}</div>
            <div id="${player}-bet"></div>
            <div id="${player}-status"></div>
            <div id="${player}-cards" class="flex"></div>
        </div>

        `
      container.append(element)
    }
    config.root?.append(container)
  }

  public updatePlayerCards(name: string, cards: Card[]): void {
    document.querySelector<HTMLDivElement>(`#${name}-cards`)!.innerHTML = ''
    for (let card of cards) {
      let element = document.createElement('div')
      element.innerHTML = `${card.suit}${card.rank}`
      document.querySelector<HTMLDivElement>(`#${name}-cards`)?.append(element)
    }
  }

  public updatabetScene(name: string, bet: number): void {
    document.querySelector(`#${name}-bet`)!.innerHTML = `
    <div>bet: ${bet}</div>
    `
  }

  public generateUserBetScene(betDenominations: number[]): void {
    let container = document.createElement('div')
    container.id = 'bet-overlay'
    for (let betAmount of betDenominations) {
      let element = document.createElement('button')
      element.classList.add('bet-amount')
      element.innerHTML = betAmount.toString()
      container.append(element)
    }

    let confirmButton = document.createElement('button')
    confirmButton.id = 'confirm-bet'
    confirmButton.innerText = 'confirm'
    container.append(confirmButton)
    config.root?.append(container)
  }

  public generateActionOverlay(actionDenominations: string[]): void {
    let container = document.createElement('div')
    container.id = 'action-overlay'
    for (let action of actionDenominations) {
      let element = document.createElement('button')
      element.classList.add('user-action')
      element.innerHTML = action
      container.append(element)
    }

    config.root?.append(container)
  }

  public updateActionScene(name: string, status: string): void {
    document.querySelector(`#${name}-status`)!.innerHTML = `
    <div>${status}</div>
    `
  }

  public generateRoundResultOverlay(resultsLog: string[][]): void {
    let container = document.createElement('div')
    container.id = 'round-result'
    for (let results of resultsLog) {
      for (let result of results) {
        let element = document.createElement('div')
        element.innerHTML = `
        <div>${result}</div>
        `
        container.append(element)
      }
    }

    container.innerHTML += `<button id="next-round">next</button>`

    config.root?.append(container)
  }
}
