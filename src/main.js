import Phaser from "phaser"
import Game from "./scenes/Game.js"
import Test from "./scenes/test.js"

export default new Phaser.Game({
  type: Phaser.WEBGL,
  width: 1280,
  height: 720,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 100 },
      debug: true
    }
  },
  roundPixels: true,
  pixelArt: true,
  fps:60,
  //scene: [Game],
  scene: [Test]

})
