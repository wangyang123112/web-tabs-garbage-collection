function save(a, b, c, d) {
    chrome.storage.local.get(['kong', 'doc_title', 'link'], function(obj) {
        if (obj.link == undefined) {
            chrome.storage.local.set({
                'kong': [],
                'doc_title': [],
                'link': [],
                'time': []
            }, function() {
                console.log(obj);
            });
        }

        chrome.storage.local.get(['kong', 'doc_title', 'link', 'time'], function(arr) {
            var one = arr.kong;
            var two = arr.doc_title;
            var three = arr.link;
            var four = arr.time;
            one.push(a);
            two.push(b);
            three.push(c);
            four.push(d);
            chrome.storage.local.set({
                'kong': one,
                'doc_title': two,
                'link': three,
                'time': four
            }, function() {
                console.log('存储成功。')
            })
        });
    })

}

$('.query').click(function() {
    var port = chrome.extension.connect({
        name: "Sample Communication"
    });
    if ($('#gc').is(':checked')) {
        port.postMessage("p");
        chrome.storage.local.set({
            'tom': true
        }, function() {
            console.log('tom的值为true');
        })
        port.onMessage.addListener(function(msg) {
            console.log("message recieved" + msg);
        });
    } else if (!$('#gc').is(':checked')) {
        port.postMessage("no");
        chrome.storage.local.set({
            'tom': false
        }, function() {
            console.log('tom的值为false');
        })
        port.onMessage.addListener(function(msg) {
            console.log("message recieved" + msg);
        });
    }
});

(function initable() {
    chrome.storage.local.get(['kong', 'doc_title', 'link', 'time', 'tom'], function(arr) {
        if (arr.kong == undefined) {
            console.log('kong不初始化');
            return;
        } else {
            console.log('初始化追加');
            var one = arr.kong;
            var two = arr.doc_title;
            var three = arr.link;
            var four = arr.time
            for (var i = 0; i < arr.kong.length; i++) {
                var magic_str1 = '<tr class="' + one[i] + '"><td class="b"><a href="' + three[i] + '">' + two[i] + '</a></td><td class="b">' + four[i] + '</td><td class="b"><input type="button" value="删除"></td></tr>';
                $(tree).append(magic_str1);
                del(one[i]);
                console.log(one[i]);
            }
        }
        if (arr.tom == undefined) {
            return;
        } else if (arr.tom) {
            document.querySelector('.query').innerHTML = '<span>是否选用垃圾回收工具</span><input type="checkbox" name="" id="gc" checked>';
        } else {
            document.querySelector('.query').innerHTML = '<span>是否选用垃圾回收工具</span><input type="checkbox" name="" id="gc">'
        }

    })
})()
// setInterval(garbagecollection, 5000);

if (doc_title == '') {
    var doc_title = '无名网页';
}
var $addWeb = $('#zhang');
var tree = document.querySelector('.tree');
kong = 'a';

function del(e) {
    $('.' + e + ' .b input').on({
        click: function() {
            $(this).parent().parent().remove();
            chrome.storage.local.get(['kong', 'doc_title', 'link', 'time'], function(arr) {
                var one = arr.kong;
                var index = one.findIndex(function(age) {
                    return age == e;
                })
                one.splice(index, 1);
                var two = arr.doc_title;
                two.splice(index, 1);
                var three = arr.link;
                three.splice(index, 1);
                var four = arr.time;
                four.splice(index, 1);
                chrome.storage.local.set({
                    'kong': one,
                    'doc_title': two,
                    'link': three,
                    'time': four
                }, function() {
                    console.log('扫雷成功。');
                })

            })
        }
    })
}
$addWeb.click('click', function() {
    chrome.tabs.query({
        'currentWindow': true,
        'active': true
    }, function(tabs) {
        link = tabs[0].url;
        doc_title = tabs[0].title;
        time = Date().split(' ').splice(1, 4).join(' ');

        var magic_str1 = '<tr class="' + kong + '"><td class="b"><a href="' + link + '">' + doc_title + '</a></td><td class="b">' + time + '</td><td class="b"><input type="button" value="删除"></td></tr>';
        $(tree).append(magic_str1);
        save(kong, doc_title, link, time);
        del(kong);
        kong += 'a';
    });
})

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        console.log('存储键“%s”（位于“%s”命名空间中）已更改。' +
            '原来的值为“%s”，新的值为“%s”。',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});
