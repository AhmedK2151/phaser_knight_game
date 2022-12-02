import Phaser from "phaser";

export default class Swordsman extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame) 
        this.scene = scene
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.health = 100;
        this.attackDmg = 5
        this.speed = 140

        const anims = scene.anims

        anims.create({key: "e_knight_idle",
            frames: anims.generateFrameNumbers("e_knight_idle", {start: 8, end: 13}),
            frameRate: 10,
            repeat: 0
        })

    }

    update() {
            if(this.scene.enemy1.body.blocked.down) {
                console.log("touching ground")
                this.scene.enemy1.anims.play("e_knight_idle", true)
            }
    }
}