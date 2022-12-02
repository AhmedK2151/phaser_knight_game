import Phaser from "phaser"
import Player from "../sprites/player.js"
import Swordsman from "../sprites/enemy_swordsman.js"



export default class Test extends Phaser.Scene {
    constructor() {
        super ("Test")

    }

    preload() {
        this.load.image("forrest-tiles", "./assets/oak_woods_v1.0/oak_woods_tileset.png")
        this.load.tilemapTiledJSON("map", "./assets/oak_woods_v1.0/oak.json")

        this.load.image("bg_layer1", "assets/oak_woods_v1.0/background/background_layer_1.png")
        this.load.image("bg_layer2", "assets/oak_woods_v1.0/background/background_layer_2.png")
        this.load.image("bg_layer3", "assets/oak_woods_v1.0/background/background_layer_3.png")

        this.load.spritesheet("knight_run", "./assets/knight_spriteSheets/_Run.png", {
            frameWidth: 120,
            frameHeight: 80,
        })

        this.load.spritesheet("knight_idle", "./assets/knight_spriteSheets/_Idle.png", {
            frameWidth: 120,
            frameHeight: 80,
        })

        this.load.spritesheet("knight_crouch", "./assets/knight_spriteSheets/_Crouch.png", {
            frameWidth: 120,
            frameHeight: 80,
        })

        this.load.spritesheet("knight_crouch_walk", "./assets/knight_spriteSheets/_CrouchWalk.png", {
            frameWidth: 120,
            frameHeight: 80,
        })

        this.load.spritesheet("knight_jump_up", "./assets/knight_spriteSheets/_Jump.png", {
            frameWidth: 120,
            frameHeight: 80,
        })

        this.load.spritesheet("knight_jump_fall", "./assets/knight_spriteSheets/_JumpFallInbetween.png", {
            frameWidth: 120,
            frameHeight: 80,
        })

        this.load.spritesheet("knight_jump_fall", "./assets/knight_spriteSheets/_JumpFallInbetween.png", {
            frameWidth: 120,
            frameHeight: 80,
        })

        this.load.spritesheet("knight_attack_heavy", "./assets/knight_spriteSheets/_Attack.png", {
            frameWidth: 120,
            frameHeight: 80,
        })

        this.load.spritesheet("knight_crouch_attack", "./assets/knight_spriteSheets/_CrouchAttack.png", {
            frameWidth: 120,
            frameHeight: 80,
        })

        this.load.spritesheet("knight_attack_light", "./assets/knight_spriteSheets/_Attack2.png", {
            frameWidth: 120,
            frameHeight: 80,
        })

        this.load.spritesheet("e_knight_idle", "./assets/enemy_knight/noBKG_KnightIdle.png", {
            frameWidth: 64,
            frameHeight: 64,
        })

        
      
    }

    create() {

        this.player = new Player(this, 200, 300, "knight_idle")
        this.player
            .setSize(40, 80)
            .setScale(2)

        const width = this.scale.width
        const height = this.scale.height

        const map = this.make.tilemap({key: "map"})
        this.tiles = map.addTilesetImage("oak_woods_tileset","forrest-tiles")
        this.groundLayer = map.createLayer("Tile Layer 1", this.tiles, 0,-100)
        this.groundLayer.setCollisionByExclusion(-1, true)
        this.groundLayer.setScale(2)

        var bg_scale = 4

        for(let i = 0; i < 10; i++) {
            this.add.image(1280 * i, height * 0.5, "bg_layer1")
            .setDepth(-1)
            .setScale(bg_scale)
            .setScrollFactor(0.2)
            this.add.image(1280 * i ,height * 0.5, "bg_layer2")
            .setDepth(-1)
            .setScale(bg_scale)
            .setScrollFactor(0.5)
            this.add.image(1280 * i, height * 0.5, "bg_layer3")
            .setDepth(-1)
            .setScale(bg_scale)
            .setScrollFactor(0.8)
        }

        const spawnPoint = map.findObject(
            "spawn_points",
            obj => obj.name === "enemy_spawn"
        );

        this.enemy1 = new Swordsman(this, spawnPoint.x, spawnPoint.y - 100, "e_knight_idle", "0")
        this.enemy1
            .setScale(2)

        this.cameras.main
            .startFollow(this.player)
            .setBounds(0,0,(this.groundLayer.width * 2), height )

        
        
        //this.cameras.main.setZoom(0.2, 0.2)

        this.rectangle = this.add.rectangle(this.player.x + 25, this.player.y, 30, 30, 0xff0000)
        this.physics.add.existing(this.rectangle)
        this.rectangle.body.setDragX(400)

        this.physics.add.collider([this.player, this.rectangle, this.enemy1], [this.groundLayer])
        this.physics.add.collider(this.player, this.rectangle)

        this.isAttacking;
    }

    update() {
        console.log("width"+this.groundLayer.width)
        this.player.update()
        this.enemy1.update()
        if(this.physics.overlap(this.player, [this.rectangle, this.enemy1]) && this.isAttacking === true) {
            console.log(this.enemy1.health)
            console.log("Hit")
            this.enemy1.health -= this.player.pDmg
            console.log(this.enemy1.health)
        } 

        if(this.rectangle.y > 1300) {
            this.rectangle.setPosition(200,400)
            this.rectangle.setActive(false).setVisible(false)
        }

        
    }

}