```css
#toc { position: fixed; top: 0; left: 0; padding-top: 20px; width: 150px; height: 100%; background: #333; box-shadow: inset -5px 0 5px 0 #000; color: #fff }
#toc ul { margin: 0; padding: 0; list-style: none; }
#toc li { padding: 5px 10px }
#toc a { display: block; color: #fff; text-decoration: none; }
#toc .toc-num { color: #999; margin-right: 5px; }
#toc .toc-h2 { padding-left: 10px; }
#toc .toc-h3 { padding-left: 20px; }
#toc .toc-h4 { padding-left: 30px; }
#toc .toc-h5 { padding-left: 40px; }
#toc .toc-h6 { padding-left: 50px; }
#toc .toc-active { background: #369; box-shadow: inset -5px 0 10px -5px #000 }
```

```js
/**
 * Created by zplus on 2015/6/5.
 */

;
(function (win, undefined) {

    var TOC = document.getElementById('toc');
    if (!TOC) {
        TOC = document.createElement('div');
        TOC.id = 'toc';
        document.body.insertBefore(TOC, document.body.firstChild);
    }

    var headings;
    if (document.querySelectorAll) {
        headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    } else {
        headings = searchHead(document.body, []);
    }

    function searchHead(root, sects) {
        for (var el = root.firstChild; el != null; el = el.nextSibling) {
            if (el.nodeType !== 1) continue;
            if (el.tagName.length == 2 && el.tagName.charAt(0) == 'H') {
                sects.push(el);
            } else {
                searchHead(el, sects);
            }
        }
        return sects;
    }

    // 初始化一个数组来保持跟踪章节号
    var sectionNumbers = [0, 0, 0, 0, 0, 0];
    var itemArr = [];

    for (var h = 0; h < headings.length; h++) {
        var heading = headings[h];

        if (heading.parentNode == TOC) continue;

        var level = parseInt(heading.tagName.charAt(1), 10);

        if (isNaN(level) || level < 1 || level > 6) continue;

        // 对于该标题级别增加sectionNumber对应的数字
        sectionNumbers[level - 1]++;
        // 重置所有标题比它级别低的数字为零
        for (var i = level; i < 6; i++) sectionNumbers[i] = 0;

        // 将所有标题级别的章节号组合产生一个章节号
        console.log(sectionNumbers);
        var sectionNumber = sectionNumbers.slice(0, level).join('.');
        console.log(sectionNumber);

        // 创建锚点
        var anchor = document.createElement('a');
        anchor.name = 'toc' + sectionNumber;
        heading.parentNode.insertBefore(anchor, heading);

        itemArr.push('<li class="toc-h', level, '"><a href="#toc', sectionNumber, '"><span class="toc-num">', sectionNumber, '</span>', heading.innerHTML, '</a></li>');
    }

    TOC.innerHTML += '<ul>' + itemArr.join('') + '</ul>';
})(window);
```

[demo](http://jsbin.com/fetohu/3/edit?html,css,js,output)
