import Phaser from "phaser"
import Player from "../sprites/player.js"
import Swordsman from "../sprites/enemy_swordsman.js"



export default class Test extends Phaser.Scene {
    constructor() {
        super ("Test")

    }

    preload() {
        //Terrain
        this.load.image("forrest-tiles", "./assets/oak_woods_v1.0/oak_woods_tileset.png")
        this.load.tilemapTiledJSON("map", "./assets/oak_woods_v1.0/oak.json")

        //Paralax Background

        this.load.image("bg_layer1", "assets/oak_woods_v1.0/background/background_layer_1.png")
        this.load.image("bg_layer2", "assets/oak_woods_v1.0/background/background_layer_2.png")
        this.load.image("bg_layer3", "assets/oak_woods_v1.0/background/background_layer_3.png")

        //Player

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

        //Swordsman

        this.load.spritesheet("e_knight_idle", "./assets/enemy_knight/KnightIdle.png", {
            frameWidth: 64,
            frameHeight: 64,
        })

        this.load.spritesheet("e_knight_run", "./assets/enemy_knight/KnightRun.png", {
            frameWidth: 96,
            frameHeight: 64,
        })

        this.load.spritesheet("e_knight_attack", "./assets/enemy_knight/KnightAttack.png", {
            frameWidth: 64,
            frameHeight: 64,
        })

        this.load.spritesheet("e_knight_death", "./assets/enemy_knight/KnightDeath.png", {
            frameWidth: 64,
            frameHeight: 64,
        })

        this.load.spritesheet("e_knight_jump", "./assets/enemy_knight/KnightJumpAndFall.png", {
            frameWidth: 64,
            frameHeight: 64,
        })

        this.load.spritesheet("e_knight_shield", "./assets/enemy_knight/KnightShield.png", {
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

        const map1 = this.make.tilemap({key: "map"})
        this.tiles = map1.addTilesetImage("oak_woods_tileset","forrest-tiles")
        this.groundLayer = map1.createLayer("Tile Layer 1", this.tiles, 0,-100)
        this.groundLayer.setCollisionByProperty({collides: true})
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

        //gets enemy spawn locations

        this.enemySpawns = []
        this.spawnPoint = map1.findObject("spawn_points", (obj) => {
            if(obj.name === "enemy_spawn") {
                this.enemySpawns.push(obj)
            }
        } )

        //creates new Swordsmen based on how many spawn locations are available
        //adds them to a physics group in this scene

        this.enemyGroup = this.add.group()
        for(let i = 0; i < this.enemySpawns.length; i ++) {
            let swordsman = new Swordsman(this, (this.enemySpawns[i].x * 2), this.enemySpawns[i].y -400, "e_knight_idle", "0", `swordsman_${i}`).setScale(2)
            swordsman.name = "swordsman_" + i
            this.enemyGroup.add(swordsman)
        }


        this.cameras.main
            .startFollow(this.player)
            .setBounds(0,0,(this.groundLayer.width * 2), height )

        
        
        //this.cameras.main.setZoom(0.2, 0.2)

        this.rectangle = this.add.rectangle(this.player.x + 25, this.player.y, 30, 30, 0xff0000)
        this.physics.add.existing(this.rectangle)
        this.rectangle.body.setDragX(400)

        this.physics.add.collider([this.player, this.rectangle, this.enemyGroup], [this.groundLayer])
        this.physics.add.collider(this.player, [this.rectangle, this.enemyGroup])
        this.physics.add.collider(this.enemyGroup)

        this.isAttacking;
        console.log("enemygroup"+ this.enemyGroup)
    }

    update() {
        this.player.update()

        //Iterates over each Swordsman in the group, starting their update functions
        this.enemyGroup.children.entries.forEach(
            (sprite) => {
                sprite.update();
                //console.log(sprite)
            }
        );

        if(this.physics.collide(this.enemyGroup), (enemyObj) => {
            enemyObj.body.x += Math.floor(Math.random() * 30)
        }) {
            
        }

        if(this.physics.overlap(this.enemyGroup, this.player) && this.isAttacking) {
            console.log("hit")
        }


        if(this.rectangle.y > 1300) {
            this.rectangle.setPosition(200,400)
            this.rectangle.setActive(false).setVisible(false)
        }

        
    }

}