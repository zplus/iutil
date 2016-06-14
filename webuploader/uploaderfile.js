/** example
<div class="form-group">
    <label class="control-label col-md-2">附件上传：</label>
    <div class="col-md-2">
        <div class="uploader-area">
            <div id="filePicker"></div>
            <button type="button" class="btn btn-info btn-lg btn-block btn-single">上传</button>
        </div>
    </div>
    <div class="col-md-6">
        <table class="table table-bordered dataTable uploader-file-list">
            <tbody id="filelist"></tbody>
        </table>
    </div>
</div>
**/
$(function () {

    // 初始化Web Uploader
    var uploader = WebUploader.create({

        // 选完文件后，是否自动上传。
        auto: true,

        // swf文件路径
        swf: '../assets/js/libs/Uploader.swf',

        // 文件接收服务端。
        server: '../upload/file.action',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',

        // 只允许选择图片文件。
        accept: {
            title: 'all',
            extensions: '*',
            mimeTypes: '*/*'
        },

        multiple: true
    });
    var $list = $('#filelist');
    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
        var $item = $('<tr id="' + file.id + '" class="file-item">' +
            '<td class="file-name">' + file.name + '</td>' +
            '<td class="file-info"></td>' +
            '<td class="file-tool"></td>' +
            '</tr>'
        );
        // $list为容器jQuery实例
        $list.append($item);
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        var $info = $('#' + file.id).find('.file-info'),
            $percent = $info.find('.progress .progress-bar');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<em class="progress-info"></em><div class="progress progress-striped active"><div class="progress-bar progress-bar-info"></div></div>')
                .appendTo($info).find('.progress-bar');
        }
        var process = percentage * 100 + '%';
        $percent.css('width', process);
        $info.find('.progress-info').text(process);
    });


    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file, response) {
        var $li = $('#' + file.id);
        var size = WebUploader.formatSize(file.size, 2, ['B', 'K', 'M', 'G', 'TB']);
        $li.find('.file-info').text(size);
        var html =
            '<a href="'+response.url+'" class="text-info btn-down">下载</a>' +
            '<a href="javascript:;" class="text-info btn-del" data-file=' + file + '>删除</a>';
        $li.find('.file-tool').html(html);
        $li.data('info', {'url': response.url, 'title': response.title});
    });

    uploader.on('error', function (type) {
        var errMsg;
        switch (type) {
            case "Q_TYPE_DENIED"://Q_TYPE_DENIED 当文件类型不满足时触发。。
                errMsg = "文件格式错误";
                break;
            case "Q_EXCEED_SIZE_LIMIT"://Q_EXCEED_SIZE_LIMIT 在设置了Q_EXCEED_SIZE_LIMIT且尝试给uploader添加的文件总大小超出这个值时派送。
                errMsg = "文件总大小超出限定值";
                break;
            case "Q_EXCEED_NUM_LIMIT "://Q_EXCEED_NUM_LIMIT 在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值时派送。
                errMsg = "上传数量超出限定值";
                break;
            case "F_EXCEED_SIZE":
                errMsg = "文件大小超出限定值";
                break;
            case "F_DUPLICATE":
                errMsg = "文件重复上传";
                break;
            default:
                errMsg = type;
                break;
        }
        console.log(errMsg);
    });
    // 文件上传失败，现实上传出错。
    uploader.on('uploadError', function (file) {
        var $li = $('#' + file.id),
            $tool = $li.find('.file-tool');
        var html = '<a class="text-info btn-retry" href="javascript:;">重新上传</a>' +
            '<a href="javascript:;" class="text-info btn-del" data-file=' + file + '>删除</a>';
        $tool.html(html);
    });

    uploader.on('uploadComplete', function (file) {
        var $info = $('#' + file.id).find('.file-info');
        $info.find('.progress').fadeOut(function () {
            $info.empty();
        });
    });

    $(document).on('click.removefile', '#filelist .btn-del', function () {
        var $btn = $(this);
        $btn.closest('tr').fadeOut(function () {
            try {
                $(this).remove();
                var file = $btn.data('file');
                if (file) {
                    file = file.id ? file : uploader.queue.getFile(file);
                    uploader.request('cancel-file', file);
                    uploader.removeFile(file);
                }
            } catch (e) {
                console.warn(e);
            }
        });
    }).on('click.retry', '.btn-retry', function () {
        try {
            uploader.retry();
        } catch (e) {
            console.warn(e);
        }
    });
});
