/**
 * Created by Jiachen on 7/8/17.
 * Saves the current configuration into MySql database. This is the hardest part! Took me 2 days.
 * Loads preset data sent back from the server.
 */
/**
 * Type inferred / code generated using java. This is used to load json.
 * @type {[string]}
 */
const booleans = ["background", "randomColor", "gravitationalWrap", "reptile", "tailVisible", "tailTranslucent", "headVisible", "connect", "roundedLineCap"];
function isBoolean(str) {
    return booleans.indexOf(str) !== -1;
}

/**
 * Javascript generated using Java.
 * @param name the name of the preset ***REQUIRED***
 * @constructor
 */
function RecordedPreset(name) {
    this.name = name;
    this.scope = scope;
    this.avoidance = avoidance;
    this.repel = repel;
    this.maxAcc = maxAcc;
    this.resistance = resistance;
    this.pulse = pulse;
    this.radius = radius;
    this.radiusVariance = radiusVariance;
    this.amp = amp;
    this.strokeWeight = strokeWeight;
    this.background = background;
    this.randomColor = randomColor;
    this.gravitationalWrap = gravitationalWrap;
    this.reptile = reptile;
    this.tailLength = tailLength;
    this.tailVisible = tailVisible;
    this.tailTranslucent = tailTranslucent;
    this.maxTailOpacity = maxTailOpacity;
    this.headVisible = headVisible;
    this.maxTailWidth = maxTailWidth;
    this.minTailWidth = minTailWidth;
    this.connect = connect;
    this.maxNumConnect = maxNumConnect;
    this.maxConnectDist = maxConnectDist;
    this.connectionLineWidth = connectionLineWidth;
    this.connectionOpacity = connectionOpacity;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
    this.roundedLineCap = roundedLineCap;
    this.numDroids = numDroids;
    this.minBrightness = minBrightness;
    this.pixelDensity2 = pixelDensity2;
}

/**
 * Loads a specific preset acquired from the server.
 * @param name the name of the preset to be queried
 * @param num maximum number of results
 */
function loadPreset(name, num) {
    $.ajax({
        type: 'GET',
        url: '../assets/php/query-db.php',
        data: {name: name, num: num},
        dataType: 'json'
    }).done(function (json) {
        var buttons = "";
        window["json"] = json; //stores the json at a global scope
        for (var i = 0; i < json.length; i++) {
            buttons += "<p><span class=\"controls-action\" onclick='processJSON($(this).html())'>"
                + json[i]["name"] + "</span></p>";
        }
        $("#suggestions").html(buttons);
    }).fail(function (data) {
        console.log("Failed: " + data.responseText);
    });
}

/**
 * Here's the exiting part! Process the JSON and apply changes in the browser!
 * @param name the name of the JSON obj.
 */

function processJSON(name) {
    var data; //extract the desired json object given its name property.
    for (var i = 0; i < json.length; i++) {
        if (json[i]["name"] === name) {
            data = json[i];
            break;
        }
    }
    for (var key in data) {
        if (!data.hasOwnProperty(key)) continue;
        if (key === "name" || key === "date/time") continue;
        var val = "unknown";
        if (isBoolean(key)) val = (data[key] === "1");
        else val = parseFloat(data[key]);
        window[key] = val; //take effect, baby! So long! So long!
    }

    //update EVERYTHING!
    renew();
    syncAll();
    spawn(numDroids);
}

/**
 * Validates the name and updates the UI accordingly.
 */


const $name = $("#name");

$name.on('keyup', function (event) {
    if (event.which === 13 && validate()) savePreset();
});
$name.on('input', validate);

const $preset = $("#preset_entry");
$preset.on('input', function () {
    loadPreset($preset.val(), 5);
});


