/**
 * 最多可输入
 * 
 function setmaxlength($form) {
    $form.find('input[data-max]').each(function () {
        var $this = $(this);
        if (!this.ld_inited) {
            //未初始化过。则初始化
            $(this).text_counter({
                maxLength: $this.data('max'),
                template: '最多{max}字符，已输入{num}个',
                msgTarget: $this.data('target')
            });
            this.ld_inited = true;
        }
    });
}

<input data-max="20" data-target="#limit"/>
<p id="limit"></p>
 */
$.fn.extend({
    text_counter: function (options) {
        var that = this;
        //文本计数器
        options = $.extend({maxLength: 500, template: "最多可输入{max}个字符，已输入{num}个"}, options);
        function counter() {
            var sender = $(this);
            //统计字符数时，要去掉其中的回车符
            var l = sender.val().replace(/[\n\r]/g, "").length;
            if (l >= options.maxLength) {
                l = options.maxLength;
                sender.val(sender.val().substring(0, l));
            }
            changed(l);
        }

        function changed(num) {
            if (options.msgTarget) {
                var content = options.template.replace("{max}", options.maxLength).replace("{num}", num);
                $(options.msgTarget).html(content);
                $(that).attr("data-num", num);
            }
        }

        $(this).unbind("input").on("input", function () {
            counter.call(this);
        });
        var curVal = $(that).val() || "";
        changed(curVal.length);
    }
});
