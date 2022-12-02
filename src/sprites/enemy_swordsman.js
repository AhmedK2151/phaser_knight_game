import Phaser from "phaser";

export default class Swordsman extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, nameNumber) {
        super(scene, x, y, texture, frame, nameNumber) 
        this.scene = scene
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.health = 100;
        this.attackDmg = 5
        this.speed = 140
        this.isHit = false

        const anims = scene.anims

        anims.create({key: "e_idle",
            frames: anims.generateFrameNumbers("e_knight_idle", {start: 8, end: 13}),
            frameRate: 10,
            repeat: 0,
        })

        anims.create({key: "e_run",
            frames: anims.generateFrameNumbers("e_knight_run", {start: 0, end: 7}),
            frameRate: 16,
            repeat: 0
        })

        anims.create({key: "e_attack_jab",
            frames: anims.generateFrameNumbers("e_knight_attack", {start: 0, end: 8}),
            frameRate: 9,
            repeat: 0
        })

        anims.create({key: "e_shield",
            frames: anims.generateFrameNumbers("e_knight_shield", {start: 8, end: 13}),
            frameRate: 10,
            repeat: 0
        })

        anims.create({key: "e_jump",
            frames: anims.generateFrameNumbers("e_knight_jump", {start: 8, end: 13}),
            frameRate: 10,
            repeat: 0
        })

        anims.create({key: "e_death",
            frames: anims.generateFrameNumbers("e_knight_death", {start: 8, end: 13}),
            frameRate: 10,
            repeat: 0
        })

    }

    update() {
        let isPlayerRight = false;
        let isPlayerLeft = false;
        let playerVisible = false;


        //Informs the enemy which side the player is relative to itself

        if((this.x - this.scene.player.x > -450 && this.x - this.scene.player.x < -100)) {
            isPlayerRight = true
            playerVisible = true
        } else if ((this.x - this.scene.player.x > 100 && this.x - this.scene.player.x < 400)) {
            isPlayerLeft = true
            playerVisible = true
        } else {
            playerVisible = false
        }

        if(isPlayerRight) {
            this.setVelocityX(0)
            this.resetFlip()
            this.setVelocityX(this.speed)
            this.anims.play("e_run", true)
            if(this.body.blocked.right) {
                this.setVelocity(this.body.velocity.x, -(this.speed * 1.5))
                this.setAcceleration(this.body.acceleration.x, (this.speed * 3))
            }

        } else if(isPlayerLeft) {
            this.setVelocityX(0)
            this.setFlipX(true)
            this.setVelocityX(-this.speed)
            this.anims.play("e_run", true)
            if(this.body.blocked.left) {
                this.setVelocity(this.body.velocity.x, -(this.speed * 1.5))
                this.setAcceleration(this.body.acceleration.x, (this.speed * 3))
            }
        } else {
            if(this.body.blocked.down && !playerVisible) {
                this.setVelocityX(0)
                this.anims.play("e_idle", true)
            }
        }

        console.log(isPlayerLeft, isPlayerRight, "Player visible:" + playerVisible)

    }
}