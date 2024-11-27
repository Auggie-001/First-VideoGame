/*






*/
import Phaser, { Physics, Scene } from 'phaser';
import './style.css';

// This determins the size of the screen it's at 
const sizes = {
    width: 700,
    height: 700,
};

// Everything will have a base speed of this 
const speed = 155;

// Create the scene, with backgrond and actors 
class GameScene extends Phaser.Scene {
    constructor() {
        super('scene-game')
        this.player 
        this.cursor
        this.playerSpeed = speed; 
        this.enemy
        this.projectile 
        this.points = 0
    }

    preload() {
        // Load background image
        this.load.image('bg', '/assets/JOPK_Level_1_1.png')
        // Load the player sprites 
        this.load.image('player-down', '/assets/Cowboy-down.png')
        this.load.image('player-up', '/assets/Cowboy-up.png')
        this.load.image('player-left', '/assets/Cowboy-left.png')
        this.load.image('player-right', '/assets/Cowboy-right.png')
        // Load enemy sprites 
        this.load.image('enemy','/assets/Enemy.png')
    }

    create() {
        // Add background image
        this.add.image(0, 0, 'bg').setOrigin(0,0).setScale(2.75)

        const worldWidth = 550;
        const worldHeight = 550; 
        const CenterX = (sizes.width-worldWidth)/2;
        const CenterY = (sizes.height-worldHeight)/2;

        this.physics.world.setBounds(CenterX, CenterY,worldHeight,worldWidth)
        
        // Load player into scene 
        this.player = this.physics.add
        .image(350,350,'player-down')
        .setOrigin(0.5,0.5).setScale(3)
        this.player.setImmovable(true)
        this.player.body.allowGravity = false
        this.cursor=this.input.keyboard.createCursorKeys()
        this.player.setCollideWorldBounds(true)

        // This is to load the enemy/enemies 
        this.enemy = this.physics.add
        .image(20,335,'enemy')
        .setOrigin(0.5,0.5).setScale(3)
        this.enemy.setCollideWorldBounds(false) 

        this.physics.add.overlap(this.enemy,this.player,this.enemyHit, null, this)
    }

    update() {
        
        // Player controls and any other updates it needs to have 
        const {left,right,up,down} = this.cursor
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.setTexture('player-left')
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.setTexture('player-right')
        } else if (up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
            this.player.setTexture('player-up')
        } else if (down.isDown) {
            this.player.setVelocityY(this.playerSpeed); 
            this.player.setTexture('player-down')
        } 
        /* Eventually we'll have the shooting loigc here
        since it'll be a part of the same control logic
        */
        else {
            this.player.setVelocity(0)
        }
        this.physics.moveToObject(this.enemy,this.player,this.playerSpeed);
    }
}


// Phaser game configuration
const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    canvas: gameCanvas,
    physics:{
        default: 'arcade',
        arcade:{
            debug: true,
        }
    }, scene:[GameScene]
};

// Initialize the game
const game = new Phaser.Game(config);
