import Phaser, { Physics, Scene } from 'phaser';
import './style.css';

const sizes = {
    width: 700,
    height: 700,
};

const speed = 150;

class GameScene extends Phaser.Scene {
    constructor() {
        super('scene-game')
        this.player 
        this.cursor
        this.playerSpeed = speed; 
        this.enemy
    }

    preload() {
        // Load background image
        this.load.image('bg', '/assets/JOPK_Level_1_1.png')
        this.load.image('player-down', '/assets/Cowboy-down.png')
        this.load.image('enemy','/assets/Enemy.png')
        this.load.image('player-up', '/assets/Cowboy-up.png')
        this.load.image('player-left', '/assets/Cowboy-left.png')
        this.load.image('player-right', '/assets/Cowboy-right.png')
    }

    create() {
        // Add background image
        this.add.image(0, 0, 'bg').setOrigin(0,0).setScale(2.75)
        
        // This is loading the player and their controls 
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
        this.enemy.setMaxVelocity
    }

    update() {
        // Update logic goes here
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
        } else {
            this.player.setVelocity(0)
        }
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
