import Phaser, {Tweens} from 'phaser'

let platforms;
let cursors;
let player;
let playerCam;
let playerSpeed;
let playerHealth;


export default class Game extends Phaser.Scene {
    constructor() {
        super('game')
    }

    preload() {
        this.load.image("background", "./assets/Background.png")
        this.load.image("floor", "./assets/floor.png")
        this.load.image("forrest-tiles", "../../assets/oak_woods_v1.0/oak_woods_tileset.png")

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

        
        playerSpeed = 200
        playerHealth = 100;
        //cursors = this.input.keyboard.createCursorKeys();
        cursors = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D,
            spaceBar:Phaser.Input.Keyboard.KeyCodes.SPACE,
            q:Phaser.Input.Keyboard.KeyCodes.Q,
            shift:Phaser.Input.Keyboard.KeyCodes.SHIFT
            });
    }

    create() {
        let bg = this.physics.add.staticGroup()

        const level = [
            [  0,   1,   2,   1,   2,   1,   2,   1,   2,   1,   3 ],
        ]
        const map = this.make.tilemap({data: level, tileWidth: 24, tileHeight: 24})
        const tiles = map.addTilesetImage("forrest-tiles")
        const groundLayer = map.createLayer(0, tiles, 0, 980)
        groundLayer.setCollisionByProperty({collides: true})
        

        platforms = this.physics.add.staticGroup();
        
        player = this.physics.add.sprite(400, 700, "knight_idle").setScale(2)
        playerCam = this.cameras.main
        playerCam.startFollow(player)
        playerCam.setDeadzone(400, 600)
        playerCam.setBounds(0,0)

        this.physics.add.collider(player, platforms)
        this.physics.add.collider(player, groundLayer)

        for (let i = 0; i < 4; i++) {
            platforms.create(900 * i, 1400, "floor")
        }

        for (let j = 0; j < 5; j++) {
            bg.create(925 * j, 272, "background").setOrigin(0, 0)
            bg.setDepth(-1)
            
        }
        

        
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("knight_run", {start: 0, end: 9}) ,
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("knight_idle", {start: 0, end: 9}),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({key: "crouch",
            frames: this.anims.generateFrameNumbers("knight_crouch", {start: 0, end: 0}),
            frameRate: 1,
            repeat: -1
        })

        this.anims.create({ key: "crouchWalk",
            frames: this.anims.generateFrameNumbers("knight_crouch_walk", {start: 0, end: 7}),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: "jumpUp",
            frames: this.anims.generateFrameNumbers("knight_jump_up", {start: 0, end: 2}),
            frameRate: 3,
            repeat: 0
        })

        this.anims.create({
            key: "jump_fall",
            frames: this.anims.generateFrameNumbers("knight_jump_fall", {start: 0, end: 1}),
            frameRate: 2,
            repeat: 0
        })

        this.anims.create({
            key: "attack_heavy",
            frames: this.anims.generateFrameNumbers("knight_attack_heavy", {start: 0, end: 3}),
            duration: 1200,
            repeat: 0
        })

        this.anims.create({
            key: "crouch_attack",
            frames: this.anims.generateFrameNumbers("knight_crouch_attack", {start: 0, end: 3}),
            frameRate: 4,
            repeat: 0
        })

        this.anims.create({
            key: "attack_light",
            frames: this.anims.generateFrameNumbers("knight_attack_light", {start: 0, end: 5}),
            frameRate: 6,
            repeat: 0
        })


    }

    update() {

        const touchingGround = player.body.touching.down
        console.log(touchingGround)

        var isAttacking;
        var isJumping;
        var animName = player.anims.getName()

        if(animName.includes("attack")) {
            isAttacking = true
      
        } else {
            isAttacking = false
        }

        if(player.anims.getName() == "jumpUp") {
            isJumping = true
        } else {
            isJumping = false
        }

        if(player.body.velocity.y > 3 && isJumping) {
            player.anims.play("jump_fall", true)
        }

        if(cursors.shift._justDown && !isAttacking && touchingGround) {
            if (cursors.down.isDown) {
                player.anims.play("crouch_attack", true)
                player.chain(["idle"])
            } else {
                player.anims.play("attack_light", true)
                player.chain(["idle"])
            }
        } else
       
        if(cursors.spaceBar._justDown && !isAttacking) {
            if (cursors.down.isDown) {
                player.anims.play("crouch_attack", true)
                player.chain(["idle"])
            } else {
                player.anims.play("attack_heavy", true)
                player.chain(["idle"])
            }
            

        } else if(cursors.up.isDown && cursors.up.getDuration() < 100 && touchingGround) {
            player.setVelocity(player.body.velocity.x, -(playerSpeed * 1.5))
            player.setAcceleration(player.body.acceleration.x, (playerSpeed * 3))

            player.anims.play("jumpUp", true)


            
        } else if (cursors.down.isDown && !isAttacking) {
            if(cursors.right.isDown) {
                player.setVelocityX(0)
                player.resetFlip()
                if(cursors.right.getDuration() > 200) {
                        player.setVelocityX(playerSpeed - 100)
                        if(touchingGround == false) {
                            player.anims.play(`crouchWalk`, false)
                        } else {
                            player.anims.play("crouchWalk", true)
                        }
                }
            } else if(cursors.left.isDown ) {
                player.setVelocityX(0)
                player.setFlipX(true)
                if(cursors.left.getDuration() > 200) {
                    player.setVelocityX(-playerSpeed + 100)
                    if(touchingGround == false) {
                        player.anims.play(`crouchWalk`, false)
                    } else {
                        player.anims.play("crouchWalk", true)
                    }
                }
            } else {
                player.setVelocityX(0)
                player.anims.play("crouch", true)
            }
        

        } else if (cursors.right.isDown && touchingGround && !isAttacking) {
            player.setVelocityX(0);
            player.resetFlip()
            if(cursors.right.getDuration() > 200) {
                player.setVelocityX(playerSpeed)
                if(touchingGround == false) {
                    player.anims.play(`run`, false)
                    player.anims.play("jumpUp", true)
                } else {
                    player.anims.play("run", true)
                }
            }

        } else if (cursors.left.isDown && touchingGround && !isAttacking) {
            player.setVelocityX(0);
            player.setFlipX(true)
            if(cursors.left.getDuration() > 200) {
                player.setVelocityX(-(playerSpeed))
                if( touchingGround === false) {
                    player.anims.play(`run`, false)
                    player.anims.play("jumpUp", true)
                } else {
                    player.anims.play(`run`, true)
                }
            }

        } else if (touchingGround){
            player.setVelocityX(0)
            if(!isAttacking) {
                player.anims.play("idle", true)
            } else {
                player.anims.chain("idle")
            }
            
        }


        

    }
  
}