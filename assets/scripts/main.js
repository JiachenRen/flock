/**
 * Created by Jiachen on 7/2/17.
 */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var pixelDensity2 = window.isRetina();
var droids = [];
var isSpawningDroids = false;

/**
 * Graphics variable.
 * @type {boolean}
 */
var roundedLineCap = false;

/**
 * The number of droids to be spawned.
 * @type {number}
 */
var numDroids = 100;

/**
 * This var is for random color. Controls the minimum brightness.
 * @type {number}
 */
var minBrightness = 100;

const numericUIs = [["avoidance", 1], ["scope", 0], ["maxAcc", 2], ["repel", 1], ["radius", 0], ["radiusVariance", 0],
    ["amp", 0], ["strokeWeight", 1], ["red", 0], ["green", 0], ["blue", 0], ["alpha", 2], ["resistance", 3], ["tailLength", 0],
    ["maxTailWidth", 1], ["minTailWidth", 1], ["maxNumConnect", 0], ["maxConnectDist", 0], ["connectionLineWidth", 0],
    ["maxTailOpacity", 1], ["connectionOpacity", 1], ["numDroids", 0], ["minBrightness", 0]];
const boolUIs = ["background", "randomColor", "gravitationalWrap", "reptile", "pixelDensity2", "tailVisible", "headVisible",
    "connect", "roundedLineCap", "tailTranslucent"];

//Init action controls
$("#clear").on('click', function () {
    droids = [];
});
$("#re_spawn").on('click', function () {
    droids = [];
    spawn(numDroids);
});
//End init action controls


//Init nav bars --> show/hide
var shows = $(".show");
shows.each(function () {
    $(this).on("click", function () {
        const name = this.id.substring(5);
        $("#hide_" + name).show(0);
        $("#" + name).show(500);
        shows.each(function () {
            $(this).hide();
        });
    });
});
$(".hide").each(function () {
    $(this).hide();
    $(this).on("click", function () {
        const name = this.id.substring(5);
        $(".show").each(function () {
            var $this = $(this);
            $this.css("animation-name", "none");
            $this.show(0);
        });
        $("#" + name).hide(500);
        $(this).hide();
    });
});
//End init nav bars

(function init() {
    resizeCanvas(); //resize the canvas according to the size of the browser's window.
    initEventListeners(); //initialize various event listeners.
    initBlockControls(["force", "size", "style", "tail", "graphics", "connection", "simulation", "presets"]); //initialize the blocks of controls
    initControls(numericUIs); //initialize controls
    initToggles(boolUIs); //initialize the toggle buttons
    spawn(numDroids); //spawn droids
    setInterval('requestAnimationFrame(draw)', 1000 / 60); //setup canvas drawing interval
})();

/**
 * Initialize the toggle buttons
 */
function initToggles(args) {
    for (var i = 0; i < args.length; i++) {
        const name = args[i];
        var $this = $("#" + name);

        function color() {
            return window[name] ? "rgba(52, 217, 176, 0.66)" : "rgba(52, 217, 176, 0.33)";
        }

        $this.css("background-color", color());
        $this.on('click', function () {
            window[name] = !window[name];
            $(this).css("background-color", color());
        });

    }
    $("#randomColor").on('click', Droid.randomizeColor);
    $("#pixelDensity2").on('click', resizeCanvas);
}

/**
 * Initialize various event listeners
 */
function initEventListeners() {
    function spawnAtPos(evt) {
        var pos = getMousePos(evt);
        var droid = new Droid(pos.x, pos.y);
        droid.color = getRandomColor();
        droids.unshift(droid);
    }

    window.addEventListener("resize", resizeCanvas, false);
    canvas.addEventListener("mousedown", function (evt) {
        spawnAtPos(evt);
        isSpawningDroids = true;
    }, false);
    canvas.addEventListener("mousemove", function (evt) {
        if (isSpawningDroids) spawnAtPos(evt);
    }, false);
    window.addEventListener("mouseup", function () {
        isSpawningDroids = false;
    }, false);
}

/**
 * Initialize groups of controls & animation, namely force, size, and style.
 * Original animation by Jiachen Ren using JQuery.
 */
function initBlockControls(args) {
    for (var i = 0; i < args.length; i++) {
        const control = args[i];
        var $c = $("#" + control);
        const $bc = $("#" + control + "-controls");
        var abortTimeout = function () {
            clearTimeout(window[control + "_id"]);
        };
        $bc.mouseenter(abortTimeout);
        $bc.mouseleave(function () {
            animatedHide(control, $(this), 500, 500);
        });
        $c.mouseover(function () {
            $bc.css("position", "absolute");
            $bc.css("width", $(this).outerWidth());
            $bc.css("left", $(this).offset().left);
            animatedShow(control, $bc, $(this).outerHeight() + $(this).offset().top + 10, 500);
        });
        $c.mouseleave(function () {
            function hide() {
                animatedHide(control, $("#" + control + "-controls"), 500, 500);
            }

            window[control + "_id"] = setTimeout(hide, 500);
        });
        $c.mouseenter(abortTimeout);
    }
}

/**
 * Animates an element vertically to the designated position.
 * @param id the id of the element
 * @param element the element to be animated
 * @param dy absolute destination y
 * @param s seconds until timeout
 */
function animatedShow(id, element, dy, s) {
    if (window[id + "_identifier"]) return;
    element.css("position", "absolute");
    element.css("top", "50%");
    element.css("opacity", "0");
    element.show();
    window[id + "_identifier"] = true;
    var opacity = 0;
    const trd = setInterval(function () {
        element.css('top', element.offset().top + (dy - element.offset().top) * 0.2);
        element.css('opacity', opacity);
        opacity += 0.1;
    }, 25);
    setTimeout(function () {
        clearInterval(trd);
        element.css('top', dy);
        element.css("opacity", "1");
    }, s);
}

/**
 * Animates an element vertically to the designated position.
 * @param id the id of the element
 * @param element the element to be animated
 * @param dy absolute destination y
 * @param s seconds until timeout
 */
function animatedHide(id, element, dy, s) {
    element.css("position", "absolute");
    const trd = setInterval(function () {
        element.css('top', element.offset().top + (dy - element.offset().top) * 0.2);
        element.css('opacity', element.css('opacity') - 0.1);
    }, 25);
    setTimeout(function () {
        clearInterval(trd);
        element.css('top', dy);
        element.css("opacity", "0");
        element.hide();
        window[id + "_identifier"] = false;
    }, s);
}

/**
 * Initialize the sliders and labels for controlling the size, style, and forces of the droids.
 */
function initControls(args) {
    for (var i = 0; i < args.length; i++) {
        const name = args[i][0];
        const index = args[i][1];
        $("#" + name).on('input', function () {
            window[name] = parseFloat($(this).val());
            console.log(name + ": " + window[name]);
            $("#" + name + "_fb").html(Math.round(window[name], index));
        });
        syncUI(name);
    }

    //additional setups for special attributes
    $("#radius").on('input', function () {
        for (var i = 0; i < droids.length; i++) {
            droids[i].radius = radius;
        }
    });
    $("#radiusVariance").on('input', function () {
        for (var i = 0; i < droids.length; i++) {
            droids[i].radius = radius + Math.random() * radiusVariance;
        }
    });
}

/**
 * Syncs the value of the slider in UI with the variables
 */
function syncUI(name) {
    $("#" + name).val(window[name]);
    $("#" + name + "_fb").html(window[name]);
}

/**
 * Clears the existing droids and pawn random droids on screen.
 * @param n the number of droids
 */
function spawn(n) {
    droids = [];
    for (var i = 0; i < n; i++) {
        var pos = randomPos(0, canvas.width, 0, canvas.height);
        var droid = new Droid(pos.x, pos.y);
        droids.push(droid);
    }
    if (randomColor) Droid.randomizeColor();
}

/**
 * Returns a randomized position within the given bounds.
 * @param a x lower bound
 * @param b x upper bound
 * @param c y lower bound
 * @param d y upper bound
 */
function randomPos(a, b, c, d) {
    var x = a + Math.random() * (b - a);
    var y = c + Math.random() * (d - c);
    return new Vec2D(x, y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = roundedLineCap ? "round" : "butt";
    droids.forEach(function (droid) {
        droid.update();
    });
    if (connect) {
        droids.forEach(function (droid) {
            droid.connect();
        })
    }
    if (tailVisible) {
        droids.forEach(function (droid) {
            droid.displayTail(ctx);
        })
    }
    if (headVisible) {
        for (var i = 0; i < droids.length; i++) {
            droids[i].display(ctx);
        }
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //updates the pixel density
    if (pixelDensity2) {
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
        canvas.width = canvas.width * 2;
        canvas.height = canvas.height * 2;
    }
    requestAnimationFrame(draw);
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) * (pixelDensity2 ? 2 : 1),
        y: (evt.clientY - rect.top) * (pixelDensity2 ? 2 : 1)
    };
}

/**
 * Syncs all booleans and numeric values with the ui.
 * This function is called when configuration is loaded from the server.
 */
function syncAll() {
    for (var i = 0; i < boolUIs.length; i++) {
        const name = boolUIs[i];
        $("#" + name).css("background-color", function () {
            return window[name] ? "rgba(52, 217, 176, 0.66)" : "rgba(52, 217, 176, 0.33)";
        });
    }
    for (var q = 0; q < numericUIs.length; q++) {
        syncUI(numericUIs[q][0]);
    }
}

/**
 * Adaptive layout using JQuery by inspecting the width of the window.
 */
$(window).on('resize', function () {
    if ($(window).width() < 960) {
        $(".controls-block, .controls, .hide, .show").each(function () {
            $(this).hide();
        });
    } else {
        var controlsVisible = false;
        $(".controls").each(function () {
            if ($(this).is(':visible')) {
                controlsVisible = true;
            }
        });
        if (!controlsVisible) {
            $(".show").each(function () {
                $(this).show();
            });
        }
    }
});