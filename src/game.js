'use strict';

var Bullet = require('./bullet.js');
var Glob = require('./glob.js');
var GreyGoo = require('./greygoo.js');
var Graphics = require('./graphics.js');
var Events = require('./events.js');
var Explosion = require('./explosion.js');
var Keyboard = require('./keyboard.js');
var Particle = require('./particle.js');
var Physics = require('./physics.js');
var Ship = require('./ship.js');
var Vector = require('./vector.js');

var random = require('./utilities').random;
var remove = require('./utilities').remove;

/*
 * Encapuslates game control
 */
function Game(canvas, settings) {
	this.canvas = canvas;
	this.settings = settings;
	
	this.dt = 1 / settings.fps;

	this.lives = settings.lives;	//number of lives remaining
	this.score = 0;					//total accumulated points
	this.stageOver = false;			//true if the stage is over false otherwise
	
	this.keyboard = new Keyboard();
	this.graphics = new Graphics(canvas);
	this.physics = new Physics(canvas.width, canvas.height, this.dt);	
	this.greyGoo = new GreyGoo(canvas.width, canvas.height, settings.greyGoo);
	
	this.reset();
	
	this.setupEvents();
}

Game.prototype.reset = function () {
	this.ship = new Ship(new Vector(this.canvas.width / 2, this.canvas.height / 2), this.settings.ship);
	this.globs = [];
	this.bullets = [];
	this.debris = [];
}

/*
 * Setup event handlers
 */
Game.prototype.setupEvents = function() {
	//accelerate
	this.keyboard.keyUp(Keyboard.keys.up, this, function() {
		if (this.ship)
			this.ship.accelerating = 0;
	});
	
	this.keyboard.keyDown(Keyboard.keys.up, this, function() {
		if (this.ship)
			this.ship.accelerating = 1;
	});
	
	//rotate left
	this.keyboard.keyUp(Keyboard.keys.left, this, function() {
		if (this.ship)
			this.ship.turning = 0;
	});
	
	this.keyboard.keyDown(Keyboard.keys.left, this, function() {
		if (this.ship)
			this.ship.turning = -1;
	});
	
	//rotate right
	this.keyboard.keyUp(Keyboard.keys.right, this, function() {
		if (this.ship)
			this.ship.turning = 0;
	});
	
	this.keyboard.keyDown(Keyboard.keys.right, this, function() {
		if (this.ship)
			this.ship.turning = 1;
	});
	
	//fire
	this.keyboard.keyDown(Keyboard.keys.spacebar, this, function() {
		if (this.ship)
			this.ship.fireGun = true;
	});
	
	this.keyboard.keyUp(Keyboard.keys.spacebar, this, function() {
		if (this.ship)
			this.ship.fireGun = false;
	});
	
	Events.on('gameOver', function () {
		alert('gameOver: ' + this.score);
	});
	
	Events.on('respawn', function () {
		this.ship = new Ship(new Vector(this.canvas.width / 2, this.canvas.height / 2), this.settings.ship);
	});
}

/*
 * Resizes game canvas. Can be called on the fly.
 */
Game.prototype.resizeCanvas = function (width, height) {
	this.graphics.resizeCanvas(width, height);
	this.greyGoo.resizeCanvas(width, height);
	this.physics.setBounds(width, height);
}

/*
 * Setup stage
 */
Game.prototype.setupStage = function (stage) {
	this.reset();

	for (var i = 0; i < stage * this.settings.globsPerStage; i++) {
		var x = random(0, this.canvas.width);
		var y = random(0, this.canvas.height);
		this.globs.push(new Glob(new Vector(x, y), new Vector(0, 0), this.settings.glob));
	}
	
	this.stageOver = false;
}

/*
 * Update game state
 */
Game.prototype.update = function () {
	//update globs
	for (var i = 0; i < this.globs.length; i++) {
		if (this.ship && this.ship.intersecting(this.globs[i])) {
			Explosion.debris(this.debris, this.ship.position, this.settings.explosion.ship);
			
			this.ship = null;
			
			if (this.lives == 0) {
				//delay, then trigger game over
				var that = this;
				
				setTimeout(function () {
					Events.trigger('gameOver', that);
				}, 1000);
			} else {
				this.lives--;
				
				//respawn after a time
				this.respawnTime = this.settings.respawnTime;
				
				var that = this;
				
				var interval = setInterval(function () {
					if (that.respawnTime == 0) {
						clearInterval(interval);
						Events.trigger('respawn', that);
					} else {
						that.respawnTime--;
					}
				}, 1000);
			}
			
			break;
		}
	
		this.globs[i].update(this.physics, this.globs);
	}
	
	//update debris from explosions
	for (var i = 0; i < this.debris.length; i++) {
		if (this.debris[i].lifetime == 0) {
			this.debris.remove(i);
		} else {
			this.debris[i].update(this.physics);
		}
	}
	
	//update ship
	if (this.ship) {
		this.ship.update(this.physics);
		
		if (this.ship.gunCooldown == 0) {
			if (this.ship.fireGun) {
				this.bullets.push(new Bullet(this.ship.getFront(), this.ship.orientation, this.settings.bullet));
				this.ship.gunCooldown = this.settings.gunCooldown;
			}
		} else {
			this.ship.gunCooldown--;
		}
	}
	
	//update bullets
	for (var i = 0; i < this.bullets.length; i++) {
		if (this.bullets[i].lifetime == 0) {
			this.bullets.remove(i);
		} else {
			this.bullets[i].update(this.physics);
			
			//detect and handle hit
			var hit = false;
			
			for (var j = 0; !hit && j < this.globs.length; j++) {
				if (this.bullets[i].intersecting(this.globs[j])) {
					hit = true;
					Explosion.debris(this.debris, this.globs[j].position, this.settings.explosion.glob);
					Explosion.blast(this.globs, this.globs[j].position, this.settings.explosion.glob);
					this.bullets.remove(i);
					this.globs.remove(j);
					this.score += this.settings.pointsPerGlob;
				}
			}
			
			//update state if bullet didn't hit
			if (!hit) {
				this.bullets[i].update(this.physics);
			}
		}
	}
	
	if (!this.stageOver && this.globs.length == 0) {
		this.stageOver = true;
		
		var that = this;
		
		setTimeout (function () {
			Events.trigger('stageOver', that);
		}, 1000);
	}
}

/*
 * Render game entities
 */
Game.prototype.render = function () {
	this.graphics.clear();
	
	this.greyGoo.render(this.canvas, this.globs);
	
	for (var i = 0; i < this.debris.length; i++) {
		this.debris[i].render(this.graphics);
	}
	
	for (var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].render(this.graphics);
	}
	
	if (this.ship) {
		this.ship.render(this.graphics);
	}
}

/*
 * Render heads up display (health, score, lives remaining etc...)
 */
Game.prototype.renderHUD = function () {
	
}

/*
 * Main game loop
 */
Game.prototype.loop = function () {
	this.update();
	this.render();
	this.renderHUD();
}

/*
 * Starts game loop
 */
Game.prototype.startLoop = function () {
	this.keyboard.enableEvents();
	this.loopId = setInterval((function(self) { return function() { self.loop(); }})(this), this.dt * 1000);
}

/*
 * Stops game loop
 */
Game.prototype.stopLoop = function () {
	clearInterval(this.loopId);
	this.keyboard.enableEvents();
}

module.exports = Game;
