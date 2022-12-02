import Phaser from "phaser" 


export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super (scene, x, y, texture)
 
        this.scene = scene
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.playerHealth = 100;
        this.pDmg = 10

  
        this.cursors = scene.input.keyboard.addKeys(
          {up:Phaser.Input.Keyboard.KeyCodes.W,
          down:Phaser.Input.Keyboard.KeyCodes.S,
          left:Phaser.Input.Keyboard.KeyCodes.A,
          right:Phaser.Input.Keyboard.KeyCodes.D,
          spaceBar:Phaser.Input.Keyboard.KeyCodes.SPACE,
          q:Phaser.Input.Keyboard.KeyCodes.Q,
          shift:Phaser.Input.Keyboard.KeyCodes.SHIFT
          });

        const anims = scene.anims

        anims.create({key: "run",
            frames: anims.generateFrameNumbers("knight_run", {start: 0, end: 9}) ,
            frameRate: 10,
            repeat: 0
        })

        anims.create({key: "idle",
            frames: anims.generateFrameNumbers("knight_idle", {start: 0, end: 9}),
            frameRate: 10,
            repeat: 0
        })

        anims.create({key: "crouch",
            frames: anims.generateFrameNumbers("knight_crouch", {start: 0, end: 0}),
            frameRate: 1,
            repeat: -1
        })

        anims.create({ key: "crouchWalk",
            frames: anims.generateFrameNumbers("knight_crouch_walk", {start: 0, end: 7}),
            frameRate: 8,
            repeat: -1
        })

        anims.create({key: "jumpUp",
            frames: anims.generateFrameNumbers("knight_jump_up", {start: 0, end: 2}),
            frameRate: 3,
            repeat: 0
        })

        anims.create({ key: "jump_fall",
            frames: anims.generateFrameNumbers("knight_jump_fall", {start: 0, end: 1}),
            frameRate: 2,
            repeat: 0
        })

        anims.create({ key: "attack_heavy",
            frames: anims.generateFrameNumbers("knight_attack_heavy", {start: 0, end: 3}),
            duration: 1200,
            repeat: 0
        })

        anims.create({key: "crouch_attack",
            frames: anims.generateFrameNumbers("knight_crouch_attack", {start: 0, end: 3}),
            frameRate: 4,
            repeat: 0
        })

        anims.create({key: "attack_light",
            frames: anims.generateFrameNumbers("knight_attack_light", {start: 0, end: 5}),
            frameRate: 6,
            repeat: 0
        })

    }


    update() {
        const cursors = this.cursors
        const playerSpeed = 400

        const touchingGround = this.scene.player.body.blocked.down

        //this.scene enables that everything is executed within the appropriate scope
        var isAttacking = this.scene.isAttacking
        var isJumping;
        var animName = this.scene.player.anims.getName()

        if(animName.includes("attack")) {
            this.scene.isAttacking = true
            console.log("is attacking")
            this.scene.player.setSize(90, 80)
        
        } else {
            this.scene.isAttacking = false
            this.scene.player.setSize(40, 80)
        }

        if(this.scene.player.anims.getName() == "jumpUp") {
            isJumping = true
        } else {
            isJumping = false
        }

        if(this.scene.player.body.velocity.y > 3 && !isAttacking) {
            this.scene.player.anims.play("jump_fall", true)
        }

        if(cursors.right.isDown && cursors.right.getDuration() < 300 && !touchingGround) {
            this.scene.player.setVelocityX(playerSpeed / 2)

        } else if(cursors.left.isDown && cursors.left.getDuration() < 300 && !touchingGround) {
            this.scene.player.setVelocityX(-playerSpeed / 2)

        }

        if(cursors.shift._justDown && !isAttacking && touchingGround) {
            if (cursors.down.isDown) {
                this.scene.player.anims.play("crouch_attack", true)
                this.scene.player.chain(["idle"])
            } else {
                this.scene.player.anims.play("attack_light", true)
                this.scene.player.chain(["idle"])
            }
        } else
        
        if(cursors.spaceBar._justDown && !isAttacking) {
            if (cursors.down.isDown) {
                this.scene.player.anims.play("crouch_attack", true)
                this.scene.player.chain(["idle"])
            } else {
                this.scene.player.anims.play("attack_heavy", true)
                this.scene.player.chain(["idle"])
            }
            
                                        //At least 100ms since last W button keypress
        } else if(cursors.up.isDown && cursors.up.getDuration() < 100 && touchingGround) {
            this.scene.player.setVelocity(this.scene.player.body.velocity.x, -(playerSpeed * 1.5))
            this.scene.player.setAcceleration(this.scene.player.body.acceleration.x, (playerSpeed * 3))

            this.scene.player.anims.play("jumpUp", true)

        } else if (cursors.down.isDown && !isAttacking && !isJumping) {
            if(cursors.right.isDown) {
                this.scene.player.setVelocityX(0)
                this.scene.player.resetFlip()
                if(cursors.right.getDuration() > 200) {
                        this.scene.player.setVelocityX(playerSpeed - 100)
                        if(touchingGround == false) {
                            this.scene.player.anims.play(`crouchWalk`, false)
                        } else {
                            this.scene.player.anims.play("crouchWalk", true)
                        }
                }
            } else if(cursors.left.isDown && !isJumping) {
                this.scene.player.setVelocityX(0)
                this.scene.player.setFlipX(true)
                if(cursors.left.getDuration() > 200) {
                    this.scene.player.setVelocityX(-playerSpeed + 100)
                    if(touchingGround == false) {
                        this.scene.player.anims.play(`crouchWalk`, false)
                    } else {
                        this.scene.player.anims.play("crouchWalk", true)
                    }
                }
            } else {
                this.scene.player.setVelocityX(0)
                this.scene.player.anims.play("crouch", true)
            }
        

        } else if (cursors.right.isDown && touchingGround && !isAttacking && !isJumping) {
            this.scene.player.setVelocityX(0);
            this.scene.player.resetFlip()
            if(cursors.right.getDuration() > 160) {
                this.scene.player.setVelocityX(playerSpeed)
                if(touchingGround == false) {
                    this.scene.player.anims.play(`run`, false)
                    this.scene.player.anims.play("jumpUp", true)
                } else {
                    this.scene.player.anims.play("run", true)
                }
            }

        } else if (cursors.left.isDown && touchingGround && !isAttacking && !isJumping) {
            this.scene.player.setVelocityX(0);
            this.scene.player.setFlipX(true)
            if(cursors.left.getDuration() > 160) {
                this.scene.player.setVelocityX(-(playerSpeed))
                if( touchingGround === false) {
                    this.scene.player.anims.play(`run`, false)
                    this.scene.player.anims.play("jumpUp", true)
                } else {
                    this.scene.player.anims.play(`run`, true)
                }
            }

        } else if (touchingGround){
            this.scene.player.setVelocityX(0)
            if(!isAttacking) {
                this.scene.player.anims.play("idle", true)
            } else {
                this.scene.player.anims.chain("idle")
            }
            
        }


        

    }

}


