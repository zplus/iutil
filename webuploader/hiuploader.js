// 图片上传 
// 来自百度webuploader.js 
(function ($, window, undefined) {
    $.fn.extend({
        hiuploader: function (opt) {
            var cfg = $.extend({
                server: '../upload/image.action' // todo
                , fileVal: 'uploadFile'
                , multiple: false // 是否允许多选
                , addMode: 'html' // append || html
                , auto: 'auto'
                , isMakeThumb: true
                , thumbnailWidth: 100
                , thumbnailHeight: 100
                , addTpl: function (file) {
                    return '<div id="' + file.id + '" class="file-item thumbnail">' +
                        '<img>' +
                        '<div class="info"></div>' +
                        '</div>'
                } // 生成缩略图的模板
                , uploadSuccess: null
                , accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                }
                , fileSingleSizeLimit: 5 * 1024 * 1024
            }, opt);
            return this.each(function () {
                var $list = $(this),
                // 优化retina, 在retina下这个值是2
                    ratio = window.devicePixelRatio || 1,

                // 缩略图大小
                    thumbnailWidth = cfg.thumbnailWidth * ratio,
                    thumbnailHeight = cfg.thumbnailHeight * ratio,

                // Web Uploader实例
                    uploader;

                // 初始化Web Uploader
                uploader = WebUploader.create({

                    // 自动上传。
                    auto: cfg.auto,

                    // swf文件路径
                    swf: '../assets/js/libs/Uploader.swf',

                    // 文件接收服务端。
                    server: cfg.server,

                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: {
                        id: $list.siblings('.filePicker'),
                        multiple: cfg.multiple
                    },

                    // 只允许选择文件，可选。
                    accept: cfg.accept
                });
                // 当有文件添加进来的时候
                uploader.on('fileQueued', function (file) {
                    // 删除之前的队列
                    if (cfg.addMode == 'html' && cfg.auto) {
                        var queue = uploader.getFiles();
                        for (var i = 0; i < queue.length - 1; i++) {
                            uploader.removeFile(queue[i]);
                        }
                    }

                    var $li = $(cfg.addTpl(file)),
                        $img = $li.find('img');
                    $li.closest('form').find('button[type="submit"]').prop('disabled', true);

                    // append ==> html
                    $list[cfg.addMode]($li);
                    var $info = $li.find('.info');
                    var fileSize = file.size;
                    if (fileSize > cfg.fileSingleSizeLimit) {
                        var msg = '文件不能超过' + WebUploader.formatSize(cfg.fileSingleSizeLimit, 2, ['B', 'K', 'M', 'G', 'TB']);
                        $info.removeClass('success').addClass('error').html(msg);
                        uploader.removeFile(file);
                        return;
                    }

                    // 创建缩略图
                    cfg.isMakeThumb && uploader.makeThumb(file, function (error, src) {
                        if (error) {
                            $img.replaceWith('<span>不能预览</span>');
                            return;
                        }
                        $img.attr('src', src);
                    }, thumbnailWidth, thumbnailHeight);

                    // 绑定删除事件
                    var $btn_remove = $li.find('.file-remove');
                    $btn_remove.on('click', function () {
                        var $li = $('#' + file.id);
                        $btn_remove.off();
                        $li.off().remove();

                        file = file.id ? file : uploader.queue.getFile(file);
                        uploader.request('cancel-file', file);
                        uploader.removeFile(file);
                    });
                });

                // 文件上传过程中创建进度条实时显示。
                uploader.on('uploadProgress', function (file, percentage) {
                    var $li = $('#' + file.id),
                        $percent = $li.find('.progress .progress-bar');

                    // 避免重复创建
                    if (!$percent.length) {
                        $percent = $('<div class="progress progress-striped active"><div class="progress-bar progress-bar-info"></div></div>')
                            .appendTo($li).find('.progress-bar');
                    }

                    $percent.css('width', percentage * 100 + '%');
                });

                // 询问服务端响应是否有效
                uploader.on('uploadAccept', function (block, ret) {
                    // var $obj = $('#' + block.file.id);
                    // $obj.data('src', ret.url);
                });

                // 文件上传成功，给item添加成功class, 用样式标记上传成功。
                uploader.on('uploadSuccess', function (file, response) {
                    var $li = $('#' + file.id);
                    $li.addClass('upload-state-done');
                    var $info = $li.find('.info');
                    $info.removeClass('error').addClass('success').html('上传成功');
                    $li.data('src', response.url);
                    $li.data('title', response.title);

                    cfg.uploadSuccess && cfg.uploadSuccess(file);
                });

                // 文件上传失败，现实上传出错。
                uploader.on('uploadError', function (file) {
                    var $li = $('#' + file.id),
                        $info = $li.find('.info');
                    $info.removeClass('success').addClass('error').html('上传失败<a class="retry" href="javascript:;">重新上传</a>');
                    $info.on('click', '.retry', function () {
                        uploader.retry();
                    });
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
                // 完成上传完了，成功或者失败，先删除进度条。
                uploader.on('uploadComplete', function (file) {
                    var $li = $('#' + file.id);
                    $li.closest('form').find('button[type="submit"]').prop('disabled', false);
                    $li.find('.progress').remove();
                });
            });
        }
    });
}(window.jQuery, window));
