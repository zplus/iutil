function preloadimages(prefix, imgs) {
    var postaction = function () {
    };

    function load() {
        count++;
        if (count == imgs.length) {
            postaction(arr);
        }
    }

    if ("undefined" != typeof imgs) {
        var arr = [], count = 0;
        imgs = $.isArray(imgs) ? imgs : [imgs];
        for (var i = 0; i < imgs.length; i++) {
            var img = new Image;
            arr[i] = img;
            img.end = false;
            img.src = prefix + imgs[i];
            if (img.complete) {
                img.end = true;
                setTimeout(function () {
                    load()
                }, 10);
            } else {
                img.onload = function () {
                    this.end = true;
                    load()
                }
            }
            img.onerror = function () {
                load()
            };
        }
        return {
            done: function (fn) {
                postaction = fn || postaction
            }
        }
    }
}
