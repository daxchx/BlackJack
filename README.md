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



## ブラックジャックをプレイする

1. まず、[URL](#URL)にアクセスする
2. プレイするラウンド数を選択する
3. 「スタート」ボタンをクリックしてゲームを開始

## UIの説明

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

#### ゲーム終了

指定したラウンド数に達したら、最終的なチップの獲得状況をランキング形式で表示します。
また、各ラウンドにプレイヤーが行った動作の履歴（ベット額、アクション、獲得チップ額）も表示します。

## プレイヤーについて

プレイヤーはそれぞれ、以下の情報を保持してます。
- ベット額
- ステータス：ステータス一覧をご確認ください。
- スコア：手札の合計値
- チップ

### ステータス

<table>
<tr>
  <th colspan=2>プレイヤーのステータス一覧</th>
</tr>
<tr>
  <td>betting</td>
  <td>ベットが完了していない状態</td>
</tr>
<tr>
  <td>bet</td>
  <td>ベットが完了した状態</td>
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

### スコアについて

<table>
<tr>
  <td>2, 3, 4 ･･･ 10</td>
  <td>カードの数値をそのままカウントします。</td>
</tr>
<tr>
  <td>J, Q, K</td>
  <td>10としてカウントします。</td>
</tr>
<tr>
  <td>A</td>
  <td>「11」または「1」としてカウントします。</td>
</tr>
</table>

## ディーラーについて

### ステータス

<table>
<tr>
  <th colspan=2>ディーラーのステータス一覧</th>
</tr>
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

## ディーラーとの勝敗判定

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

#### dealer(bust) 22-

- player(stand) 1-21 → return bet*1
- player(stand)✨blackjack → return bet*1.5
- player(double) 1-21 → return bet*2

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

## こだわった点

#### スケーラビリティ

ブラックジャック以外のトランプゲームも容易に追加できるように共通クラスや抽象クラスを作成してします。
追加したいゲームモデルに共通クラスのTable, Player, Deck, Card を継承していきます。

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
