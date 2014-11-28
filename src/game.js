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
	this.fireGun = false;
	this.gunCooldown = 0;
	
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
	this.ship.position = new Vector(this.canvas.width / 2, this.canvas.height / 2);

	for (var i = 0; i < 15; i++) {
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
		if (this.ship.collidingWith(this.globs[i])) {
			console.log('ship dead');
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
	this.ship.update(this.physics);
	
	//fire gun
	if (this.gunCooldown == 0) {
		if (this.fireGun) {
			this.bullets.push(new Bullet(this.ship.getFront(), this.ship.orientation, this.settings.bullet));
			this.gunCooldown = this.settings.gunCooldown;
		}
	} else {
		this.gunCooldown--;
	}
	
	//update bullets
	for (var i = 0; i < this.bullets.length; i++) {
		if (this.bullets[i].lifetime == 0) {
			remove(this.bullets, i);
		} else {
			this.bullets[i].update(this.physics);
			
			var hit = false;
			
			for (var j = 0; !hit && j < this.globs.length; j++) {
				//detect and handle hit
				if (this.bullets[i].collidingWith(this.globs[j])) {
					hit = true;
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
	
	this.ship.render(this.graphics);
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
