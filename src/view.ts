import Card from './model/card'

const config = {
  root: document.querySelector<HTMLDivElement>('#app'),
}

export default class View {
  /**
   * ゲーム開始画面のレンダリング
   * @returns {void}
   */
  public renderStartScene(): void {
    config.root!.innerHTML = `
    <div class="flex flex-col items-center">
      <div class="flex items-center mt-20">
        <div class="relative flex justify-center items-center w-[40px] h-[54px] border border-gray-300 rounded bg-white shadow-sm shrink-0 translate-x-[4px] rotate-[-15deg]">
          <div class="absolute top-1 left-1 leading-none text-xs">K</div>
          <div class="text-center text-md">♣</div>
        </div>
        <div class="relative flex justify-center items-center w-[40px] h-[54px] border border-gray-300 rounded bg-white shadow-sm shrink-0 translate-x-[-4px] rotate-[15deg]">
          <div class="absolute top-1 left-1 leading-none text-xs">A</div>
          <div class="text-center text-md">♠</div>
        </div>
      </div>
      <h1 class="mt-8 text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">ブラックジャック</h1>
      <div class="flex justify-between items-center mt-40 px-4 py-2">
        <span class="text-sm ">ラウンド数</span>
        <select id="round" class="relative block disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input bg-transparent rounded-md text-sm pe-8">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      <button id="create" class="text-sm bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">はじめる</button>
    </div>
    `
  }

  /**
   * プレイシーンのレンダリング
   * @param {string[]} players - ディーラー以外のプレイヤー
   * @returns {void}
   */
  public renderBlackjackScene(players: string[]): void {
    config.root!.innerHTML = `
    <div id="house" class="mt-8 px-6">
      <div class="flex items-top">
        <div class="w-8 mr-2 shrink-0"><img src="dealer-icon.svg" width="32" height="32" /></div>
        <div class="w-[calc(100%-2.5rem)]">
          <div class="mt-1.5 text-sm font-bold">ディーラー</div>
          <div class="mt-1">
            <div class="flex items-center gap-x-2 overflow-x-scroll">
              <div class="flex">
                <span class="text-sm">status:</span>
                <div id="house-status" class="text-sm"></div>
              </div>
              <div class="flex">
                <span class="text-sm">score:</span>
                <div id="house-score" class="text-sm"></div>
              </div>
            </div>
            <div id="house-cards" class="flex gap-x-1 mt-1 h-[54px] overflow-x-scroll"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="players" class="flex flex-col gap-y-6 mt-8">
      ${players
        .map((player: string) => {
          return `
          <div id="player" class="px-6">
            <div class="flex items-top">
              <div class="w-8 mr-2 shrink-0"><img src="player-icon.svg" width="32" height="32" /></div>
              <div class="w-[calc(100%-2.5rem)]">
                <div class="mt-1.5 text-sm font-bold">${player == 'cpu1' ? 'コンピュータ1' : player == 'cpu2' ? 'コンピュータ2' : player == 'you' ? 'あなた' : ''}</div>
                <div class="mt-1">
                  <div class="flex items-center gap-x-2 overflow-x-scroll">
                    <div class="flex">
                      <span class="text-sm">bet:</span>
                      <div id="${player}-bet" class="text-sm"></div>
                    </div>
                    <div class="flex items-center">
                      <div class="text-sm">chips:</div>
                      <div id="${player}-chips" class="text-sm"></div>
                    </div>
                    <div class="flex">
                      <span class="text-sm">status:</span>
                      <div id="${player}-status" class="text-sm"></div>
                    </div>
                    <div class="flex">
                      <span class="text-sm">score:</span>
                      <div id="${player}-score" class="text-sm"></div>
                    </div>
                  </div>
                  <div id="${player}-cards" class="flex gap-x-1 mt-1 h-[54px] overflow-x-scroll"></div>
                </div>
              </div>
            </div>
          </div>
          `
        })
        .join('')}
    </div>
    `
  }

  /**
   * プレイヤーのステータスを更新
   * @param {string} name - プレイヤー名
   * @param {string} status - プレイヤーのステータス
   * @returns {void}
   */
  public updatePlayerStatus(name: string, status: string): void {
    document.querySelector(`#${name}-status`)!.innerHTML = status
  }

  /**
   * プレイヤーのベット額を更新
   * @param {string} name - プレイヤー名
   * @param {number} bet - プレイヤーのベット額
   * @returns {void}
   */
  public updatePlayerBet(name: string, bet: number): void {
    document.querySelector<HTMLDivElement>(`#${name}-bet`)!.innerHTML = bet.toString()
  }

  /**
   * プレイヤーのチップ総額を更新
   * @param {string} name - プレイヤー名
   * @param {number} chips - プレイヤーのチップ総額
   * @returns {void}
   */
  public updatePlayerChips(name: string, chips: number): void {
    document.querySelector<HTMLDivElement>(`#${name}-chips`)!.innerHTML = chips.toString()
  }

  /**
   * プレイヤーの手札の合計値を更新
   * @param {string} name - プレイヤー名
   * @param {number} score - プレイヤーの手札の合計値
   * @returns {void}
   */
  public updatePlayerScore(name: string, score: number): void {
    document.querySelector<HTMLDivElement>(`#${name}-score`)!.innerHTML = score.toString()
  }

  /**
   * プレイヤーの手札を更新
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
            <div class="relative flex justify-center items-center w-[40px] h-[54px] border border-gray-300 rounded shadow-sm shrink-0">
              <div class="absolute top-1 left-1 leading-none text-xs">${card.isFace ? card.rank : ''}</div>
              <div class="text-center text-md">${card.isFace ? (card.suit == 'H' ? '♥' : card.suit == 'D' ? '♦' : card.suit == 'C' ? '♣' : card.suit == 'S' ? '♠' : '') : '?'}</div>
            </div>
          `
          })
          .join('')}
      `
    } else document.querySelector<HTMLDivElement>(`#${name}-cards`)!.innerHTML = ''
  }

  /**
   * ユーザーのベット時のオーバーレイを生成
   * @param {number[]} betDenominations - ベット額面
   * @returns {void}
   */
  public renderBetOverlay(betDenominations: number[]): void {
    config.root!.innerHTML += `
    <div id="bet-overlay" class="">
      <div class="flex gap-x-2">
        ${betDenominations
          .map((bet) => {
            return `
              <button class="bet-amount focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary-500 inline-flex items-center">${bet}</button>
            `
          })
          .join('')}
      </div>
      <div>
        <button id="confirm-bet" class="w-full focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary-500 inline-flex items-center">confirm</button>
      </div>
    </div>
    `
  }

  /**
   * プレイヤーのベット額を更新
   * @param {string[]} actionDenominations - 全アクション
   * @returns {void}
   */
  public rednerActionOverlay(actionDenominations: string[]): void {
    config.root!.innerHTML += `
    <div id="action-overlay" class="fixed bottom-0 left-1/2 bg-white bg-opacity-30 translate-x-[-50%] translate-y-[-50%] flex gap-x-2 px-4">
    ${actionDenominations
      .map((action) => {
        return `
      <button class="user-action focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary-500 inline-flex items-center">${action}</button>
      `
      })
      .join('')}
    </div>
    `
  }

  /**
   * ラウンドの結果をレンダリング
   * @param {string[][]} resultsLog - 全ラウンドのリザルト情報
   * @returns {void}
   */
  public renderRoundResultOverlay(resultsLog: string[][]): void {
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

  /**
   * ゲームの結果をレンダリング
   * @param {string[][]} resultsLog - 全ラウンドのリザルト情報
   * @returns {void}
   */
  public renderGameOverScene(a: string[][]): void {
    config.root!.innerHTML = `
    <div>Game Over</div>
    <div id="ranking" class="flex flex-col gap-y-2"></div>
    <button id="back">back to top</button>
    `

    for (let i = 0; i < a.length; i++) {
      if (a[i].length != 0) {
        for (let j = 0; j < a[i].length; j++) {
          let p = document.createElement('div')
          p.innerHTML = `${i + 1}位 ${a[i][j]}`
          document.querySelector<HTMLDivElement>('#ranking')?.append(p)
        }
      }
    }
  }
}
