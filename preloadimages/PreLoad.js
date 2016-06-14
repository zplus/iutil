!(function (win) {
    var PreLoad = function (source, opt) {
        var cfg = opt || {};
        this.source = source;
        this.count = 0;
        this.total = source.length;
        // 加载事件
        this.onload = cfg.onload || loading;
        this.prefix = cfg.prefix || "";
        this.init();
    };
    PreLoad.prototype.init = function () {
        var self = this;
        self.source.forEach(function (item) {
            var type = item.substr(item.lastIndexOf(".") + 1).toLowerCase(),
                src = self.prefix + item;
            switch (type) {
                case"js":
                    self.script.call(self, src);
                    break;
                case"css":
                    self.stylesheet.call(self, src);
                    break;
                case"svg":
                case"jpg":
                case"gif":
                case"png":
                case"jpeg":
                    self.image.call(self, src);
            }
        })
    };
    PreLoad.prototype.getProgress = function () {
        return Math.round(this.count / this.total * 100)
    };
    PreLoad.prototype.image = function (src) {
        var el = document.createElement("img");
        this.load(el, src);
        el.src = src;
    };
    PreLoad.prototype.stylesheet = function (src) {
        var el = document.createElement("link");
        this.load(el, src);
        el.rel = "stylesheet";
        el.type = "text/css";
        el.href = src;
        document.head.appendChild(el);
    };
    PreLoad.prototype.script = function (src) {
        var el = document.createElement("script");
        this.load(el, src);
        el.type = "text/javascript";
        el.src = src;
        document.head.appendChild(el);
    };
    PreLoad.prototype.load = function (el, src) {
        var self = this;
        el.onload = el.onerror = el.onabort = function (event) {
            self.onload && self.onload({count: ++self.count, total: self.total, item: src, type: event.type});
        }
    };

    function loading(load) {
        var count = load.count;
        var total = load.total;
        // var progress = Math.round(100 * count / total) + '%';
        // console.log(progress);
        if (count === total) return;
    }

    win.PreLoad = PreLoad;
})(window);
