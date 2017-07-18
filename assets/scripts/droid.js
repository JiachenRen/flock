/**
 * Created by Jiachen on 7/2/17.
 * Flock Simulation Droid class. All Rights Reserved.
 */

/**
 * The radius in which the droids can see each other.
 * @type {number}
 */
var scope = 1000;

/**
 * The coefficient that controls when the droids try to avoid crashing into each other's way.
 * @type {number}
 */
var avoidance = 1.1;

/**
 * This factor changes how much they repel each other.
 * @type {number}
 */
var repel = 2;

/**
 * This factor determines the max acceleration
 * @type {number}
 */
var maxAcc = 0.2;

/**
 * adjust this to change the resistance of the air.
 * @type {number}
 */
var resistance = 0.995;

/**
 * Controls the pulse of the droids. Set this to zero for a uniform pulse.
 * @type {number}
 */
var pulse = 0;

/**
 * Controls the radius of each individual droids.
 * @type {number}
 */
var radius = 7;

/**
 * Variation to the radius of each.
 * @type {number}
 */
var radiusVariance = 0;

/**
 * Controls how much the radius fluctuates
 * @type {number}
 */
var amp = 1;

/**
 * Controls the contour thickness of each droid.
 * @type {number}
 */
var strokeWeight = 6;

/**
 * Whether or not to fill the droids with a background.
 * @type {boolean}
 */
var background = true;

/**
 * This controls whether or not to have a random color.
 * @type {boolean}
 */
var randomColor = true;

/**
 * This determines whether gravity will wrap around the screen.
 * @type {boolean}
 */
var gravitationalWrap = true;

/**
 * Ha ha. No description. Just change it and see what you get.
 * @type {boolean}
 */
var reptile = true;

/**
 * This variable determines the tail length
 * @type {number}
 */
var tailLength = 10;

/**
 * Whether or not to draw a tail
 * @type {boolean}
 */
var tailVisible = true;

/**
 * Controls the transparency of the tail
 * @type {boolean}
 */
var tailTranslucent = true;

/**
 * Controls the maximum opacity of the tail.
 */
var maxTailOpacity = 0.5;

/**
 * Controls whether or not to draw the head.
 * @type {boolean}
 */
var headVisible = true;

/**
 * Controls the maximum width of the tail
 * @type {number}
 */
var maxTailWidth = strokeWeight;

/**
 * Controls the minimum width of the tail
 * @type {number}
 */
var minTailWidth = 0;

/**
 * Turn connection between droids on/off
 * @type {boolean}
 */
var connect = false;

/**
 * Max number of connections
 * @type {number}
 */
var maxNumConnect = 30;

/**
 * Maximum distance in which the two droids will connect.
 * @type {number}
 */
var maxConnectDist = 100;

/**
 * The line width of the connections
 * @type {number}
 */
var connectionLineWidth = 4;

/**
 * Opacity of the connecting lines.
 * @type {number}
 */
var connectionOpacity = 0.13;


var red = 200;
var green = 255;
var blue = 255;
var alpha = 0.5;
// var red = 0, green = 0; blue = 0; //alternatively

/**
 * This function computes the color of the droids.
 * @type {string}
 */
function droidColor() {
    "use strict";
    return "rgba(" + parseInt(red) + "," + parseInt(green) + "," + parseInt(blue) + "," + alpha + ")";
}

function Droid(x, y) {
    this.pos = new Vec2D(x, y);
    this.prevPos = [];
    this.connected = [];
    this.heading = Vec2D.random();
    this.noiseSeed = Math.random() * pulse;
    this.radius = function () {
        return radius + Math.random() * radiusVariance;
    }();
    this.color = droidColor();
}

Droid.prototype.computedRadius = function () {
    return this.radius + Math.cos(this.noiseSeed) * amp + (pixelDensity2 ? strokeWeight / 2 : strokeWeight);
};

Droid.prototype.display = function (ctx) {
    if (!typeof ctx === CanvasRenderingContext2D)
        return;
    var r = this.radius + Math.cos(this.noiseSeed) * amp;
    this.noiseSeed += 0.1;
    if (!reptile)
        ctx.ellipse(this.pos.x, this.pos.y, r, r);
    else {
        r *= 2;
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.heading.heading() + Math.PI / 2);
        ctx.moveTo(0, -r / 2);
        ctx.bezierCurveTo(-r / 4, -r / 6, -r / 2, r / 3, 0, r / 2);
        ctx.bezierCurveTo(r / 2, r / 3, r / 4, -r / 6, 0, -r / 2);
        ctx.closePath();
        ctx.restore();
    }
    if (background) {
        ctx.fillStyle = randomColor ? this.color : droidColor();
        ctx.fill();
    } else {
        ctx.strokeStyle = randomColor ? this.color : droidColor();
        ctx.lineWidth = strokeWeight;
        ctx.stroke();
    }
};

/**
 * Draws the tail
 */
Droid.prototype.displayTail = function (ctx) {
    if (!typeof ctx === CanvasRenderingContext2D)
        return;
    ctx.strokeStyle = randomColor ? this.color : droidColor();
    var curPos = this.prevPos[this.prevPos.length - 1];
    for (var i = this.prevPos.length - 1; i >= 0; i--) {
        var dist = this.prevPos[i].dist(curPos);
        if (dist < canvas.height / 2 && dist < canvas.width / 2) {
            ctx.beginPath();
            ctx.moveTo(curPos.x, curPos.y);
            ctx.lineWidth = Math.map(i, 0, tailLength, minTailWidth, maxTailWidth);
            if (tailTranslucent) ctx.globalAlpha = Math.map(i, 0, tailLength, 0, maxTailOpacity);
            ctx.lineTo(this.prevPos[i].x, this.prevPos[i].y);
            ctx.stroke();
        } else {
            ctx.moveTo(this.prevPos[i].x, this.prevPos[i].y);
        }
        curPos = this.prevPos[i];
    }
    ctx.globalAlpha = 1;
};

/**
 * Experimental Feature
 * Interconnection between the droids.
 */
Droid.prototype.connect = function () {
    for (var i = 0; i < droids.length; i++) {
        if (droids[i] === this) continue;
        if (droids[i].pos.dist(this.pos) < maxConnectDist) {
            if (this.connected.length < maxNumConnect && droids[i].connected.indexOf(this) === -1) {
                if (this.connected.indexOf(droids[i]) === -1)
                    this.connected.push(droids[i]);
            }
        } else {
            while (this.connected.length > maxNumConnect) {
                this.connected.pop();
            }
            const index = this.connected.indexOf(droids[i]);
            if (index > -1) {
                this.connected.splice(index, 1);
            }
        }
    }
    const self = this;
    ctx.strokeStyle = randomColor ? this.color : droidColor();
    ctx.globalAlpha = connectionOpacity;
    ctx.lineWidth = connectionLineWidth;
    this.connected.forEach(function (droid) {
        ctx.beginPath();
        ctx.moveTo(self.pos.x, self.pos.y);
        ctx.lineTo(droid.pos.x, droid.pos.y);
        ctx.stroke();
    });
    ctx.globalAlpha = 1;
};

Droid.prototype.update = function () {

    var acc = new Vec2D(0, 0);
    for (var i = 0; i < droids.length; i++) {
        if (droids[i] === this) continue;
        var dist;
        if (gravitationalWrap) { //TODO: debug
            var ver_a = Math.abs(this.pos.x - droids[i].pos.x);
            var ver_b = this.pos.x > droids[i].pos.x ?
                droids[i].pos.x + canvas.width - this.pos.x :
                this.pos.x + canvas.width - droids[i].pos.x;
            var ver = ver_a > ver_b ? ver_b : ver_a;

            var hor_a = Math.abs(this.pos.y - droids[i].pos.y);
            var hor_b = this.pos.y > droids[i].pos.y ?
                droids[i].pos.y + canvas.height - this.pos.y :
                this.pos.y + canvas.height - droids[i].pos.y;
            var hor = hor_a > hor_b ? hor_b : hor_a;

            dist = Math.sqrt(ver * ver + hor * hor);
        } else dist = this.pos.dist(droids[i].pos);

        if (dist > scope) continue;

        var threshold = (this.computedRadius() + droids[i].computedRadius()) * avoidance;
        var mag = 0;
        if (dist < threshold) {
            mag = -Math.map(dist, 0, threshold, maxAcc * repel, maxAcc);
            // this.heading.mult(-1);
        }
        else mag = Math.sq(Math.map(dist, threshold, scope, maxAcc, 0));

        var dir = this.pos.clone()
            .sub(droids[i].pos)
            .setMag(-mag);
        // console.log(dist);
        acc.add(dir);
    }


    this.wrap();
    this.heading.add(acc);
    this.heading.setMag(this.heading.mag() * resistance);
    this.pos.add(this.heading);

    if (tailVisible) this.updateTail();
};

/**
 * Updates the tail of the droid. Adds the current position to the array of prevPos and deletes
 * first element from the array.
 */
Droid.prototype.updateTail = function () {
    this.prevPos.push(new Vec2D(this.pos.x, this.pos.y));
    while (this.prevPos.length >= tailLength) {
        this.prevPos.shift();
    }
};


Droid.prototype.wrap = function () {
    this.pos.x = this.pos.x > canvas.width ? 0 : this.pos.x;
    this.pos.y = this.pos.y > canvas.height ? 0 : this.pos.y;
    this.pos.x = this.pos.x < 0 ? canvas.width : this.pos.x;
    this.pos.y = this.pos.y < 0 ? canvas.height : this.pos.y;
};

Droid.randomizeColor = function () {
    for (var i = 0; i < droids.length; i++) {
        droids[i].color = randomColor ? getRandomColor() : droidColor();
    }
};

/**
 * Generates a random color from the current setting.
 * @returns {string}
 */
function getRandomColor() {
    var r = Math.norm(parseInt(Math.random() * red), minBrightness, 255);
    var g = Math.norm(parseInt(Math.random() * green), minBrightness, 255);
    var b = Math.norm(parseInt(Math.random() * blue), minBrightness, 255);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}