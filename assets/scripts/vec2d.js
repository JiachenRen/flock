/**
 * Created by Jiachen on 7/2/17.
 * An implementation of PVector using javascript by Jiachen Ren
 */

function Vec2D(x, y) {
    this.x = x;
    this.y = y;
}

Vec2D.prototype.add = function (v1) {
    this.x += v1.x;
    this.y += v1.y;
    return this;
};

Vec2D.prototype.sub = function (v1) {
    this.x -= v1.x;
    this.y -= v1.y;
    return this;
};

Vec2D.prototype.mult = function (n) {
    this.x *= n;
    this.y *= n;
    return this;
};

Vec2D.prototype.div = function (n) {
    this.x /= n;
    this.y /= n;
    return this;
};

Vec2D.prototype.norm = function () {
    var mag = this.mag();
    if (mag !== 0 && mag !== 1.0)
        this.div(mag);
    return this;
};

Vec2D.prototype.mag = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vec2D.prototype.limit = function (n) {
    if (this.mag() * this.mag() > n * n)
        this.norm().mult(n);
    return this;
};

Vec2D.prototype.setMag = function (n) {
    this.norm().mult(n);
    return this;
};

Vec2D.prototype.rotate = function (theta) {
    var temp = this.x;
    this.x = this.x * Math.cos(theta) - this.y * Math.sin(theta);
    this.y = temp * Math.sin(theta) + this.y * Math.cos(theta);
    return this;
};

Vec2D.prototype.heading = function () {
    return Math.atan2(this.y, this.x);
};

Vec2D.prototype.dist = function (v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
};

Vec2D.prototype.clone = function () {
    return new Vec2D(this.x, this.y);
};

Vec2D.angleBetween = function (v1, v2) {
    if (v1.x === 0.0 && v1.y === 0.0) {
        return 0.0;
    } else if (v2.x === 0.0 && v2.y === 0.0) {
        return 0.0;
    } else {
        var dot = v1.x * v2.x + v1.y * v2.y;
        var v1mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        var v2mag = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        var amt = dot / (v1mag * v2mag);
        return amt <= -1.0 ? Math.PI : (amt >= 1.0 ? 0.0 : Math.acos(amt));
    }
};

Vec2D.random = function () {
    return new Vec2D(Math.random() * 2 - 1, Math.random() * 2 - 1).norm();
};
