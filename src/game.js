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
	this.fireGun = false;			//true if user is attempting to fire the ship's laser cannon
	this.gunCooldown = 0;			//ticks remaining until gun can fire again
	this.lives = settings.lives;	//number of lives remaining
	this.score = 0;					//total accumulated points
	
	this.keyboard = new Keyboard();
	this.graphics = new Graphics(canvas);
	this.physics = new Physics(canvas.width, canvas.height, this.dt);	
	this.greyGoo = new GreyGoo(canvas.width, canvas.height, settings.greyGoo);
	this.ship = new Ship(new Vector(canvas.width / 2, canvas.height / 2), settings.ship);
	
	this.globs = [];
	this.bullets = [];
	this.debris = [];
	
	this.setupEvents();
}

/*
 * Setup event handlers
 */
Game.prototype.setupEvents = function() {
	//accelerate
	this.keyboard.keyUp(Keyboard.keys.up, this, function() {
		this.ship.accelerating = 0;
	});
	
	this.keyboard.keyDown(Keyboard.keys.up, this, function() {
		this.ship.accelerating = 1;
	});
	
	//rotate left
	this.keyboard.keyUp(Keyboard.keys.left, this, function() {
		this.ship.turning = 0;
	});
	
	this.keyboard.keyDown(Keyboard.keys.left, this, function() {
		this.ship.turning = -1;
	});
	
	//rotate right
	this.keyboard.keyUp(Keyboard.keys.right, this, function() {
		this.ship.turning = 0;
	});
	
	this.keyboard.keyDown(Keyboard.keys.right, this, function() {
		this.ship.turning = 1;
	});
	
	//fire
	this.keyboard.keyDown(Keyboard.keys.spacebar, this, function() {
		this.fireGun = true;
	});
	
	this.keyboard.keyUp(Keyboard.keys.spacebar, this, function() {
		this.fireGun = false;
	});
	
	Events.on('gameOver', function () {
		alert('gameOver: ' + this.score);
	});
	
	Events.on('respawn', function () {
		this.respawn();
	});
}

Game.prototype.respawn = function () {
	if (this.secondsUntilRespawn == 0) {
		this.ship = new Ship(new Vector(this.canvas.width / 2, this.canvas.height / 2), this.settings.ship);
	} else {
		this.secondsUntilRespawn--;
		
		var that = this;
		
		setTimeout(function () {
			that.respawn();
		}, 1000);
	}
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
	this.ship = new Ship(new Vector(this.canvas.width / 2, this.canvas.height / 2), this.settings.ship);

	for (var i = 0; i < stage * this.settings.globsPerStage; i++) {
		var x = random(0, this.canvas.width);
		var y = random(0, this.canvas.height);
		this.globs.push(new Glob(new Vector(x, y), new Vector(0, 0), this.settings.glob));
	}
	
	this.keyboard.enableEvents();
}

/*
 * Update game state
 */
Game.prototype.update = function () {
	//update globs
	for (var i = 0; i < this.globs.length; i++) {
		if (this.ship.alive && this.ship.intersecting(this.globs[i])) {
			this.ship.alive = false;
			
			Explosion.debris(this.debris, this.ship.position, this.settings.explosion.ship);
			
			if (this.lives == 0) {
				Events.trigger('gameOver', this);
			} else {
				this.lives--;
				this.secondsUntilRespawn = this.settings.secondsUntilRespawn;
				Events.trigger('respawn', this);
			}
			
			break;
		}
	
		this.globs[i].update(this.physics, this.globs);
	}
	
	//update debris from explosions
	for (var i = 0; i < this.debris.length; i++) {
		if (this.debris[i].lifetime == 0) {
			remove(this.debris, i);
		} else {
			this.debris[i].update(this.physics);
		}
	}
	
	//update ship
	if (this.ship.alive) {
		this.ship.update(this.physics);
		
		if (this.gunCooldown == 0) {
			if (this.fireGun) {
				this.bullets.push(new Bullet(this.ship.getFront(), this.ship.orientation, this.settings.bullet));
				this.gunCooldown = this.settings.gunCooldown;
			}
		} else {
			this.gunCooldown--;
		}
	} else {
		this.gunCooldown = 0;
	}
	
	//update bullets
	for (var i = 0; i < this.bullets.length; i++) {
		if (this.bullets[i].lifetime == 0) {
			remove(this.bullets, i);
		} else {
			this.bullets[i].update(this.physics);
			
			var hit = false;
			
			//detect and handle hit
			for (var j = 0; !hit && j < this.globs.length; j++) {
				if (this.bullets[i].intersecting(this.globs[j])) {
					hit = true;
					this.score += this.settings.pointsPerGlob;
					Explosion.debris(this.debris, this.globs[j].position, this.settings.explosion.glob);
					Explosion.blast(this.globs, this.globs[j].position, this.settings.explosion.glob);
					remove(this.bullets, i);
					remove(this.globs, j);
				}
			}
			
			//update state if bullet didn't hit
			if (!hit) {
				this.bullets[i].update(this.physics);
			}
		}
	}
	
	if (this.globs.length == 0) {
		Events.trigger('stageOver', this);
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
	
	if (this.ship.alive) {
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
	this.loopId = setInterval((function(self) { return function() { self.loop(); }})(this), this.dt * 1000);
}

/*
 * Stops game loop
 */
Game.prototype.stopLoop = function () {
	clearInterval(this.loopId);
}

module.exports = Game;
