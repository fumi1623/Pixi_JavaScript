let app = new PIXI.Application({
  width: 600,
  height: 600,
  backgroundColor: 0x1099bb,
});

let el = document.getElementById('app');
el.appendChild(app.view);

//bearを中央に配置
let dogTexture = new PIXI.Texture.from('./images/dog1.jpg')
let dogSprite = new PIXI.Sprite(dogTexture);
//↑2行は他では画像を使わない場合↓１行でもいい
// let dogSprite = new PIXI.Sprite.from('./img/dog.png');

dogSprite.anchor.x = 0.5;
dogSprite.anchor.y = 0.5;

dogSprite.x = app.screen.width / 2;
dogSprite.y = app.screen.height / 2;

app.stage.addChild(dogSprite);

//別のdogを作る
let dogSprite2 = new PIXI.Sprite(dogTexture);
//x,yが同じ値ならanchor.set()
dogSprite2.anchor.set(0.5);

dogSprite2.scale.x = 1.5;
dogSprite2.scale.y = 1.5;

dogSprite2.alpha = 0.9;
dogSprite2.rotation = Math.PI / 3;
// dogSprite2.angle = 60;
dogSprite2.tint = 0xffff00;

dogSprite2.x = app.screen.width / 2 + 150;
dogSprite2.y = app.screen.height / 2;
app.stage.addChild(dogSprite2);

//楕円を作る
let ellipse = new PIXI.Graphics()
.beginFill(0xff0000)
.drawEllipse(0,0,30,20)
.endFill();
//new PIXI.Graphics().塗りつぶしの指定().図形の描画1().図形の描画2.,...,.図形の描画n().塗りつぶしの終了()

ellipse.pivot.x = 15
ellipse.pivot.y = 10
ellipse.x = 100;
ellipse.y = 100;
ellipse.rotation = Math.PI / 6;
app.stage.addChild(ellipse);

// 多角形を作る
let polygon = new PIXI.Graphics()
.beginFill(0x00dd00, 0.8) //第二引数で透明度
.drawPolygon([
  0, 0,
  25, -20,
  50, 0,
  50, 20,
  25, 40,
  0, 20,
])
.endFill();
polygon.x = 100;
polygon.y = 100;
app.stage.addChild(polygon)

//図形に画像埋め込み
let circle = new PIXI.Graphics()
.beginTextureFill(dogTexture, 0x00ffff, 1, new PIXI.Matrix(1,0,0,1,-35,-35))
//塗りつぶしのかわりにテクスチャを貼る (テクスチャ,色,透明度,テクスチャのスケール・位置情報)
.lineStyle(2, 0x000000)
.drawCircle(0,0,30)
.endFill();
circle.x = 200;
circle.y = 100;
app.stage.addChild(circle);

//線を書く
let line = new PIXI.Graphics()
.lineStyle(1, 0x000000)
.moveTo(0,0)  // 開始点に移動
.lineTo(50,0)  // (x,y)に向かって直線を引く
.lineTo(25,-25)  //二本目
.moveTo(50,0)  // 開始点を移動
.lineTo(25,25);
line.x = 300;
line.y = 100;
app.stage.addChild(line)

//コンテナを生成する
let sampleContainer = new PIXI.Container();

sampleContainer.x = 100;
sampleContainer.y = app.screen.height - 200;
app.stage.addChild(sampleContainer);

//新しいコンテナにオブジェクトを入れる
let background = new PIXI.Graphics()
.beginFill(0xffff00)
.drawRect(0,0,400,200)
.endFill();

//コンテナに入れる
sampleContainer.addChild(background);

let dog2Texture = new PIXI.Texture.from('./images/dog2.jpg')
let dogs = new Array()
for (let i=0; i < 2; i++) {
  for (let j=0; j < 13; j++) {
    let dog2 = new PIXI.Sprite(dog2Texture);
    dog2.scale.x = dog2.scale.y = 0.25;
    dog2.x = j * 30 + 10;
    dog2.y = i * 100 + 20;
    sampleContainer.addChild(dog2);
    dogs.push(dog2)
  }
}

// 中央のdogのインタラクション(イベント)を有効化
dogSprite.interactive = true;
// dogにマウスが重なった時、表示をポインターにする
dogSprite.buttonMode = true;

// 中央のdogスプライトにクリックイベントのリスナーを設定
// オブジェクト.on('イベントの種類', イベントハンドラ) で設定
dogSprite.on('pointertap',showAlert);

function showAlert(e) {
  console.log(e);
  alert('dogがクリックされました');
}

//斜めのdogのインタラクション(イベント)を有効化
dogSprite2.interactive = true;
dogSprite2.buttonMode = true;

// 斜めのdogスプライトにイベントリスナーを設定する
// .on()をつなげて連続で設定することができる
dogSprite2.on('pointerdown', onDogPointerDown)
          .on('pointerup', onDogPointerUp);

// dogの上でマウスがクリック(orタップ)されたときの処理定義
function onDogPointerDown() {
  dogSprite2.on('pointermove', moveDog);
}

// dogをドラッグ中の処理定義
function moveDog(e) {
  let position = e.data.getLocalPosition(app.stage);

  //位置の変更
  dogSprite2.x = position.x
  dogSprite2.y = position.y
}

function onDogPointerUp() {
  dogSprite2.off('pointermove', moveDog);
}

// zIndexによる自動ソートを有効化(どんなコンテナでも設定可能)
app.stage.sortableChildren = true;

// 斜めのdogを最前面に描画(どのオブジェクトもzIndexの初期値は0)
dogSprite2.zIndex = 10;

//animation
// フレーム更新時の処理(≒ループ処理)を追加する
app.ticker.add(animate);
//app.tickerはフレーム更新時の処理を管理
let amountTime = 0;

function animate(delta) {

  //dogの円を回転
  circle.rotation += 0.2;
  //円を移動
  amountTime += delta;

  if (Math.cos(amountTime / 10) > 0) {
    circle.x += 2;
  } else {
    circle.x -= 2;
  }
}
// 毎フレーム処理を解除する
app.ticker.remove(animate);


//キーボードが押されたときにオブジェクトを動かす
//押したキーの情報を格納する配列
const LEFT = 0;
const UP = 1
const RIGHT = 2;
const SOWN = 3;

let pushed = [];
pushed[LEFT] = false;
pushed[UP] = false;
pushed[RIGHT] = false;
pushed[DOWN] = false;

//キーが押された時のイベントリスナー
window.addEventListener('keydown', function(e) {
  pushed[e] = true;
});

//キーが離されたときのイベントリスナー
window.addEventListener('keyup', function(e) {
  pushed[e] = false;
});

// let frameCount = 0;
let dog2 = dogs[0];

app.ticker.add((delta) => {
  if (pushed[LEFT]) {
    dog2.x -= 5;
  }
  if (pushed[UP]) {
    dog2.y -= 5;
  }
  if (pushed[RIGHT]) {
    dog2.x += 5;
  }
  if (pushed[DOWN]) {
    dog2.y += 5;
  }
})


//Tickerを使わずにアニメーション

// dog2を4つほど取り出す
let d1 = dogs[1];
let d2 = dogs[2];
let d3 = dogs[3];
let d4 = dogs[4];

TweenMax.to(d1, 0.5, {
  pixi: { y: d1.y - 200, },
  ease: Power0.easeNone,
  repeat: 1
});
// TweenMax.to( 対象オブジェクト, 完了までの時間(秒), {
//                  pixi: { 
//                       パラメータ名1: 目標値1, パラメータ名2: 目標値2, ... ,
//                  }
//                   ease: イージングの形式,
//                   repeat: 繰り返し回数 (デフォルトは0、 反復の場合は折り返しもカウントに含む), 
//                   yoyo: アニメーションを反復するか否か(true/false デフォルトはfalse),
//                   delay: アニメーション開始までの遅延時間(秒),
//                   onComplete: アニメーション完了時に実行するコールバック
//             });


