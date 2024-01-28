import Card from './model/card'

const config = {
  root: document.querySelector<HTMLDivElement>('#app'),
}

export default class View {
  /**
   * ルートを空にする
   *
   * @returns {void}
   */
  private displayNone(): void {
    config.root!.innerHTML = ''
  }

  /**
   * ゲーム開始画面の描画
   *
   * @returns {void}
   */
  public init(): void {
    this.displayNone()
    config.root!.innerHTML = `
    <input type="number" min="0" max="100" placeholder="how many round do you play?" />
    <button id="create">create game</button>
    `
  }

  /**
   * テーブルの描画
   *
   * @param {string[]} players - 全プレイヤー
   * @returns {void}
   */
  public generateTableScene(players: string[]): void {
    config.root!.innerHTML = `
    <div id="house" class="mb-10 px-4">
      <div>dealer</div>
      <div class="flex gap-x-4 mb-2">
        <div class="flex">
          <span class="text-gray-500">status:</span>
          <div id="house-status"></div>
        </div>
        <div class="flex">
          <span class="text-gray-500">score:</span>
          <div id="house-score"></div>
        </div>
      </div>
      <div id="house-cards" class="flex gap-x-1 h-[65px]"></div>
    </div>
    <div id="players" class="flex flex-col gap-y-10">
      ${players
        .map((player: string) => {
          return `
          <div id="player" class="px-4">
            <div>${player}</div>
            <div class="flex gap-x-4 mb-2">
              <div class="flex">
                <span class="text-gray-500">bet:</span>
                <div id="${player}-bet"></div>
              </div>
              <div class="flex">
                <span class="text-gray-500">status:</span>
                <div id="${player}-status"></div>
              </div>
              <div class="flex">
                <span class="text-gray-500">chips:</span>
                <div id="${player}-chips"></div>
              </div>
              <div class="flex">
                <span class="text-gray-500">score:</span>
                <div id="${player}-score"></div>
              </div>
            </div>
            <div id="${player}-cards" class="flex gap-x-1 h-[65px]"></div>
          </div>
          `
        })
        .join('')}
    </div>
    `
  }

  /**
   * プレイヤーのステータスを更新
   *
   * @param {string} name - プレイヤー名
   * @param {string} status - プレイヤーのステータス
   * @returns {void}
   */
  public updatePlayerStatus(name: string, status: string): void {
    document.querySelector(`#${name}-status`)!.innerHTML = status
  }

  /**
   * プレイヤーのベット額を更新
   *
   * @param {string} name - プレイヤー名
   * @param {number} bet - プレイヤーのベット額
   * @returns {void}
   */
  public updatePlayerBet(name: string, bet: number): void {
    document.querySelector<HTMLDivElement>(`#${name}-bet`)!.innerHTML = bet.toString()
  }

  /**
   * プレイヤーのチップ総額を更新
   *
   * @param {string} name - プレイヤー名
   * @param {number} chips - プレイヤーのチップ総額
   * @returns {void}
   */
  public updatePlayerChips(name: string, chips: number): void {
    document.querySelector<HTMLDivElement>(`#${name}-chips`)!.innerHTML = chips.toString()
  }

  /**
   * プレイヤーの手札の合計値を更新
   *
   * @param {string} name - プレイヤー名
   * @param {number} score - プレイヤーの手札の合計値
   * @returns {void}
   */
  public updatePlayerScore(name: string, score: number): void {
    document.querySelector<HTMLDivElement>(`#${name}-score`)!.innerHTML = score.toString()
  }

  /**
   * プレイヤーの手札を更新
   *
   * @param {string} name - プレイヤー名
   * @param {Card[] | null} cards - プレイヤーの手札
   * @returns {void}
   */
  public updatePlayerCards(name: string, cards: Card[] | null): void {
    if (cards) {
      document.querySelector<HTMLDivElement>(`#${name}-cards`)!.innerHTML = `
        ${cards
          .map((card: Card) => {
            return `
            <div class="relative flex justify-center items-center w-[46px] h-[65px] border border-gray-200 rounded shadow-sm">
              <div class="absolute top-1 left-1 leading-none text-sm">${card.isFace ? card.rank : ''}</div>
              <div class="text-center text-xl">${card.isFace ? (card.suit == 'H' ? '♥' : card.suit == 'D' ? '♦' : card.suit == 'C' ? '♣' : card.suit == 'S' ? '♠' : '') : '?'}</div>
            </div>
          `
          })
          .join('')}
      `
    } else document.querySelector<HTMLDivElement>(`#${name}-cards`)!.innerHTML = ''
  }

  /**
   * ユーザーのベット時のオーバーレイを生成
   *
   * @param {number[]} betDenominations - ベット額面
   * @returns {void}
   */
  public generateBetOverlay(betDenominations: number[]): void {
    let container = document.createElement('div')
    container.classList.add('flex', 'gap-x-4')
    container.id = 'bet-overlay'
    for (let betAmount of betDenominations) {
      let element = document.createElement('button')
      element.classList.add('bet-amount', 'px-1', 'border', 'border-gray-400', 'rounded', 'bg-gray-100')
      element.innerHTML = betAmount.toString()
      container.append(element)
    }

    let confirmButton = document.createElement('button')
    confirmButton.id = 'confirm-bet'
    confirmButton.innerText = 'confirm'
    container.append(confirmButton)
    config.root?.append(container)
  }

  /**
   * プレイヤーのベット額を更新
   *
   * @param {string[]} actionDenominations - 全アクション
   * @returns {void}
   */
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

  /**
   * ゲームの結果を更新
   *
   * @param {string[][]} resultsLog - 全ラウンドのリザルト情報
   * @returns {void}
   */
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
