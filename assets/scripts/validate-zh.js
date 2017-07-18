/**
 * Created by Jiachen on 7/9/17.
 */
function validate() {
    const $name = $("#name");
    const $target = $("#sql_fb");
    if (Utils.removeSpecialChars($name.val()) !== $name.val()) {
        $name.css({"border": "solid 1px rgba(255,0,0,0.7)", "box-shadow": "0 0 5px 1px #ff0000"});
        $target.html("名字中只能包含合法的字符（包括中文）");
    } else if ($name.val() === "") {
        $name.css("border", "solid 1px #aa79fc");
        $name.css("box-shadow", "0 0 5px 1px #cf4afc");
        $target.html("未保存；请输入文件名");
    } else if ($name.val().length < 3 || $name.val().length > 20) {
        $name.css("border", "solid 1px rgba(255,200,0,0.7)");
        $name.css("box-shadow", "0 0 5px 1px rgba(255,200,0,1)");
        $target.html("名字的长度必须在三个到二十个字符的长度之间");
    } else {
        $name.css("border", "solid 1px rgba(0,255,0,0.7)");
        $name.css("box-shadow", "0 0 5px 1px #00ff00");
        $target.html("点击回车键保存；保存后全世界的人都可以看见／加载：）");
        return true;
    }
    return false;
}

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
            $target.html("已成功保存");
        else if (feedback.indexOf("overridden") !== -1)
            $target.html("文件已存在；原文件内容成功覆盖");
        else $target.html(data.responseText);
    });
}