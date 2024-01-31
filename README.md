# ブラックジャック

![ブラックジャック](public/test.gif 'ブラックジャック')

## URL

https://blackjack-neon-nine.vercel.app/

## 概要

ブレックジャックで遊びたい...。
そんな時に、アプリのインストールなどは不要、webブラウザでURLにアクセスしてサクッとプレイ！

このゲームは１人で遊ぶゲームになっています。
ブラックジャックでは、ディーラーとあなた以外にも2名のCPUがゲームに参加します。

チップをベットし、ディーラーとの勝負に勝てば、別途したチップに応じた報酬を獲得。ゲームオーバーした時点で所持しているチップが一番多いプレイヤーの勝利となります。



## 始め方

1. まず、[URL](#URL)にアクセスする
2. プレイするラウンド数を選択する
3. 「スタート」ボタンをクリックしてゲームを開始

## シーン説明

#### ゲームスタート

このブラックジャックでは、ラウンド制を採用しています。
お好みのラウンド数を指定してゲームをはじめましょう！
指定したラウンド数に達するとゲームオーバーとなり、その時点でチップを一番持っているプレイヤーがゲームの勝者となります。

#### ベット

各プレイヤーはベット額を指定します。
コンピュータは「5, 20, 50, 100」の中からランダムでベット額を選択します。
あなたの順番が来ると、ベット額を選択するオーバーレイが表示されるので、そちらからベット額を確定させてください。

#### アクション

全プレイヤーは手札のカード状況に応じてアクションを選択します。
コンピュータは「stand, hit」のどちらかをカードの合計値に応じてアクションを選択します。
あなたは、カードの状況を確認して「surrender, stand, hit, double」の中から最適なアクションを選択してください。

#### ラウンド終了

指定したラウンド数に達したら、最終的なチップの獲得状況をランキング形式で表示します。
また、各ラウンドにプレイヤーが行った動作の履歴（ベット額、アクション、獲得チップ額）も表示します。

#### ゲーム終了

指定したラウンド数に達したら、最終的なチップの獲得状況をランキング形式で表示します。
また、各ラウンドにプレイヤーが行った動作の履歴（ベット額、アクション、獲得チップ額）も表示します。

## プレイヤー

#### ステータス

<table>
<tr>
  <td>betting</td>
  <td>ベットが完了していない状態</td>
</tr>
<tr>
  <td>bet</td>
  <td>ベットが完了した状態</td>
</tr>
<tr>
  <td>surrender</td>
  <td>降参する</td>
</tr>
<tr>
  <td>stand</td>
  <td>手札を確定させ、ディーラーに勝負を挑む状態</td>
</tr>
<tr>
  <td>double</td>
  <td>ベット額を2倍にしてカードを1枚引き、ディーラーに勝負を挑む状態</td>
</tr>
<tr>
  <td>bust</td>
  <td>手札の合計値が21を超えている状態</td>
</tr>
</table>

#### アクション

<table>
<tr>
  <td>surrender</td>
  <td>カードを一枚追加</td>
</tr>
<tr>
  <td>stand</td>
  <td>手札の合計値が17以上21以下で確定させる場合</td>
</tr>
<tr>
  <td>hit</td>
  <td>カードを一枚追加</td>
</tr>
<tr>
  <td>double</td>
  <td>カードを一枚追加</td>
</tr>
</table>

## ディーラー

#### ステータス

<table>
<tr>
  <td>waitingForBets</td>
  <td>全プレイヤーのベットが完了するまで待機している状態</td>
</tr>
<tr>
  <td>waitingForActions</td>
  <td>全プレイヤーのアクションが完了するまで待機している状態</td>
</tr>
<tr>
  <td>stand</td>
  <td>手札のスコアが17以上で21以下の状態</td>
</tr>
<tr>
  <td>bust</td>
  <td>手札の合計値が21を超えている状態</td>
</tr>
</table>

#### アクション

ディーラーは手札の合計が17以上になるまでカードを引き続けます。

<table>
<tr>
  <td>stand</td>
  <td>手札の合計値が17以上21以下で確定させる場合</td>
</tr>
<tr>
  <td>hit</td>
  <td>カードを1枚追加</td>
</tr>
</table>

## ラウンドの勝敗判定

※bustしている状態ではディーラーと勝負はできません。

#### dealer(stand) 1-21

- dealer < player(stand) 1-21 → return bet*1
- dealer >= player(stand) 1-21 → lost bet*1
- player(stand) ✨blackjack → return bet*1.5
- dealer < player(double) 1-21 → return bet*2
- dealer >= player(double) 1-21 → lost bet*2

#### dealer(stand) ✨blackjack

- player(stand) 1-21 → lost bet*1
- player(double) 1-21 → lost bet*1
- player(stand)✨blackjack → return bet*1

#### dealer(bust)

- player(stand) 1-21 → return bet*1
- player(stand)✨blackjack → return bet*1.5
- player(double) 1-21 → return bet*2

## スコアについて

<table>
<tr>
  <th>カードの数値</th>
  <th>ブラックジャックでのスコア</th>
</tr>
<tr>
  <td>2, 3, 4 ･･･ 10</td>
  <td>2, 3, 4 ･･･ 10</td>
</tr>
<tr>
  <td>J, Q, K</td>
  <td>10</td>
</tr>
<tr>
  <td>A</td>
  <td>11または1</td>
</tr>
</table>

## 使用技術

<table>
<tr>
  <td rowspan=2>フロントエンド</td>
  <td>TypeScript</td>
</tr>
<tr>
  <td>TailwindCSS</td>
</tr>
<tr>
    <td>ビルドツール</td>
    <td>Vite</td>
</tr>
<tr>
    <td>デプロイ</td>
    <td>Vercel</td>
</tr>
<tr>
  <td rowspan=5>その他</td>
  <td>Git</td>
</tr>
<tr>
  <td>Github</td>
</tr>
</table>

## クラス図

https://github.com/daxchx/blackjack/wiki/Class-Diagram

## アクティビティ図

https://github.com/daxchx/blackjack/wiki/Flowchart


## 作成の経緯

下記項目の理解を深めるために作成しました。

- オブジェクト指向プログラミング
- MVC アーキテクチャ
- TypeScript
- DOM 操作
- ライブプレイできるゲームの作成

## こだわった点

#### スケーラビリティ

ブラックジャック以外のトランプゲームも容易に追加できるように共通クラスや抽象クラスを作成してします。
追加したいゲームモデルに共通クラスのTable, Player, Deck, Card を継承していきます。

#### オブジェクト指向プログラミング

各オブジェクトが持つデータやメソッドが単一責任、疎結合、になるようにしました。

#### dom操作

画面全体を再レンダリングすると画像のちらつきや動作が遅くなることがあったため、必要な箇所だけ更新するようにしました。
具体的には、初期化時に必要なdomはすべて用意し、動的な更新が必要なdomにはidを割り振りました。
動的更新を行う際には、controllerからviewのmethodに値を渡し、該当するidの箇所を渡ってきた値を使用して再レンダリングしています。

#### TypeScriptによる型の指定

型の指定により、viewやmodelで扱うデータでバグを生むことがないようになっています。
インターフェースを用いて、汎用的な型の使い回しなども行っています。

#### MVCアーキテクチャ

modelはデータを管理、controllerはmodelとviewにアクセス、viewはcontrollerから受け取った情報を表示
modelとviewを疎結合にし、互いが干渉しないようにしています。
controllerはゲームの進行とmodelやviewの更新を担当しています。
疎結合の関係にすることでmodelやviewが互いのデータや振る舞いを操作できないようにしています。

#### コメントアウト

コメントアウトにはJSDocsのコメントアウトルールを採用しました。


#### UI

モダンでシンプルなデザインにして誰でも直感的にプレイできることを意識しました。
レスポンシブデザインにし、スマホでもプレイを楽しむことができるようにしています。

## 今後実装したいもの

- 賭け金の増減をわかりやすくする
