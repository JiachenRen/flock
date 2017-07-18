/**
 * Created by Jiachen on 7/4/17.
 * Various commonly utilities implemented by Jiachen Ren.
 */

/**
 * Detects whether or not the device supports retina
 * @returns {boolean}
 */
Window.prototype.isRetina = function (){
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
            (min--moz-device-pixel-ratio: 1.5),\
            (-o-min-device-pixel-ratio: 3/2),\
            (min-resolution: 1.5dppx)";
    if (window.devicePixelRatio > 1)
        return true;
    return !!(window.matchMedia && window.matchMedia(mediaQuery).matches);
};

/**
 * Prepares the context for drawing an ellipse
 * @param cx coordinate x
 * @param cy coordinate y
 * @param rx radius x
 * @param ry radius y
 * @returns {CanvasRenderingContext2D}
 */
CanvasRenderingContext2D.prototype.ellipse = function (cx, cy, rx, ry) {
    this.save(); // save state
    this.beginPath();

    this.translate(cx - rx, cy - ry);
    this.scale(rx, ry);
    this.arc(1, 1, 1, 0, 2 * Math.PI, false);

    this.restore(); // restore to original state
    return this;
};

/**
 * Square
 * @param n the number to be squared
 * @returns {number}
 */
Math.sq = function (n) {
    return n * n;
};

/**
 * Maps the input within a certain range to a designated new range
 * @param value the value to be mapped
 * @param start1 initial range start
 * @param stop1 initial range stop
 * @param start2 destination range start
 * @param stop2 destination range stop
 * @returns {*} mapped
 */
Math.map = function (value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
};

/**
 * Rounds the input to number of places after decimal point
 * @param n the number to be rounded
 * @param i digits after decimal point
 * @returns {number}
 */
Math.round = function (n, i) {
    var p = Math.pow(10, i);
    return parseInt(n * p) / p;
};