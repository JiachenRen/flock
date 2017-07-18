/**
 * Created by Jiachen on 7/9/17.
 */
function validate() {
    const $name = $("#name");
    const $target = $("#sql_fb");
    if (Utils.removeSpecialChars($name.val()) !== $name.val()) {
        $name.css({"border": "solid 1px rgba(255,0,0,0.7)", "box-shadow": "0 0 5px 1px #ff0000"});
        $target.html("name can only contain letters, numbers, dashes, underlines, and spaces.");
    } else if ($name.val() === "") {
        $name.css("border", "solid 1px #aa79fc");
        $name.css("box-shadow", "0 0 5px 1px #cf4afc");
        $target.html("not saved; please enter file name");
    } else if ($name.val().length < 3 || $name.val().length > 20) {
        $name.css("border", "solid 1px rgba(255,200,0,0.7)");
        $name.css("box-shadow", "0 0 5px 1px rgba(255,200,0,1)");
        $target.html("name must be between 3 and 20 characters.");
    } else {
        $name.css("border", "solid 1px rgba(0,255,0,0.7)");
        $name.css("box-shadow", "0 0 5px 1px #00ff00");
        $target.html("press enter to save.");
        return true;
    }
    return false;
}

/**
 * Sends the recorded presets as a JSON obj to the server, which then interprets it and queries the data into the data base.
 */
function savePreset() {
    const name = Utils.removeSpecialChars($("#name").val()); //remove any special characters for security reason.
    $.ajax({
        type: 'POST',
        url: '../assets/php/save-presets.php',
        data: {json: JSON.stringify(new RecordedPreset(name))},
        dataType: 'json'
    }).fail(function (data) {
        var feedback = data.responseText.split("\n");
        feedback = feedback[feedback.length - 1];
        var $target = $("#sql_fb");
        if (feedback.indexOf("successful") !== -1)
            $target.html("Successfully saved");
        else if (feedback.indexOf("overridden") !== -1)
            $target.html("Preset with the same name has been overridden.");
        else $target.html(data.responseText);
    });
}