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
        this.enemies
        this.projectile 
        this.bullets = null
        this.bgMusic
        this.timedEvent 
        this.remainingTime 
        this.playerHit = 0
    }

    preload() {
        // Load background image
        this.load.image('bg', '/assets/JOPK_Level_1_1.png')
        this.load.audio('bgMusic', '/assets/Stage 1[Music].mp3')
        // Load the player sprites 
        this.load.image('player-down', '/assets/Cowboy-down.png')
        this.load.image('player-up', '/assets/Cowboy-up.png')
        this.load.image('player-left', '/assets/Cowboy-left.png')
        this.load.image('player-right', '/assets/Cowboy-right.png')
        // Load enemy sprites 
        this.load.image('enemy','/assets/Enemy.png')
        // Load the sprite of the bullet
        this.load.image('bullet', '/assets/Bullet-1.png.png')
    }

    create() {
        // Add background image
        this.add.image(0, 0, 'bg').setOrigin(0,0).setScale(2.75)

        const worldWidth = 600;
        const worldHeight = 600; 
        const CenterX = (sizes.width-worldWidth)/2;
        const CenterY = (sizes.height-worldHeight)/2;

        this.physics.world.setBounds(CenterX, CenterY,worldHeight,worldWidth)
         
        this.bgMusic = this.sound.add("bgMusic", {
            volume: 0.2
        })
        this.bgMusic.play()
        // Load player into scene 
        this.player = this.physics.add
        .image(370,370,'player-down')
        .setOrigin(0.5,0.5).setScale(3)
        this.player.setImmovable(true)
        this.player.body.allowGravity = false
        this.cursor = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.player.setCollideWorldBounds(true)

        // Adds bullets to the game 
        this.bullets = this.physics.add.group()

        // This is to load the enemy/enemies 
        this.enemies = this.physics.add.group()

        //Controls the rate of spawning enemies 
        // the ends of which are the spawn locations 
        this.time.addEvent({
            delay: 2000,
            callback:() => this.spawnEnemy(700,330),
            callbackScope: this, 
            loop:true 
        });
        this.time.addEvent({
            delay: 3000,
            callback:() => this.spawnEnemy(10,330),
            callbackScope: this, 
            loop:true 
        });
        this.time.addEvent({
            delay: 4000,
            callback:() => this.spawnEnemy(350,10),
            callbackScope: this, 
            loop:true 
        });
        this.time.addEvent({
            delay: 1500,
            callback:() => this.spawnEnemy(370,700),
            callbackScope: this, 
            loop:true 
        });

        // Method to detect if enemies are hit by the bullet and what action to take 
        this.physics.add.collider(this.enemies, this.bullets, this.hitEnemy, null, this)

        this.physics.add.collider(this.player, this.enemies, this.hitPlayer, null, this)
    }

    update() {
        // Player controls and sprite changes when needed 
        const { left, right, up, down, space} = this.cursor;
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.setTexture('player-left');
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.setTexture('player-right');
        } else if (up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
            this.player.setTexture('player-up');
        } else if (down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
            this.player.setTexture('player-down');
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }
        // Shooting bullets
        if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shootBullet()
        }
        // Enemy behavior 
        this.enemies.getChildren().forEach((enemy) => {
            this.physics.moveToObject(enemy, this.player, this.playerSpeed);
        });
    }

    shootBullet() {
        // Load in the bullet at the players location
        const bullet = this.bullets.get(this.player.x, this.player.y, 'bullet');
        if (bullet) {
            bullet.setActive(true).setVisible(true);
            bullet.setScale(1);
            bullet.body.setVelocity(0);
    
            if (this.player.texture.key === 'player-left') {
                bullet.setVelocityX(-300);
            } else if (this.player.texture.key === 'player-right') {
                bullet.setVelocityX(300);
            } else if (this.player.texture.key === 'player-up') {
                bullet.setVelocityY(-300);
            } else if (this.player.texture.key === 'player-down') {
                bullet.setVelocityY(300);
            }
        }
    }
    
    

    hitEnemy(bullet, enemy) {
        if (bullet) bullet.destroy();
        if (enemy) enemy.destroy();
    }
    spawnEnemy(x, y) {
        const enemy = this.enemies.create(x, y, 'enemy')
            .setOrigin(0.5, 0.5)
            .setScale(3);
        enemy.setCollideWorldBounds(false);
    }
    hitPlayer(player, enemy){ 
            this.playerHit ++
            enemy.destroy()
            if(this.playerHit >= 3){
                this.gameOver()
            }
    }

    gameOver() {
        // Pause the game to stop physics, movement, and other activities
        this.physics.world.isPaused = true;
        this.bgMusic.stop()
    
        // Add a background dark overlay to indicate game over
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7); // Dark transparent background
        overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    
        // Display the "Game Over" text
        const gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Game Over', {
            font: '48px Arial',
            fill: '#fff',
            align: 'center',
        }).setOrigin(0.5, 0.5);
    
        // Display restart instructions
        const restartText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 60, 'Press R to Restart', {
            font: '24px Arial',
            fill: '#fff',
            align: 'center',
        }).setOrigin(0.5, 0.5);
    

        this.playerHit = 0
        // Listen for the player to press 'R' to restart the game
        this.input.keyboard.once('keydown-R', () => {
            // Restart the scene by calling the same scene again
            this.scene.restart();
        });
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
