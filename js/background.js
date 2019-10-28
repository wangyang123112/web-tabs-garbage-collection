var time_for;

chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        if (msg == 'p') {
            time_for = setInterval(garbagecollection, 300000);
        } else if (msg == 'no') {
            clearInterval(time_for);
        }
        port.postMessage("Hi Popup.js");
    });
})

function garbagecollection() {
    chrome.storage.local.get('link', function(arr) {
        var t = arr.link;
        chrome.tabs.query({}, function(list) {
            for (var i = 0; i < list.length; i++) {
                var url1 = list[i].url;
                var count = t.findIndex(function(a) {
                    return a === url1;
                });
                if (count == -1) {
                    var id = list[i].id;
                    chrome.tabs.remove(id, function() {
                        console.log('garbage collection already be worded...del:%s', url1);
                    })
                }

            }
        })
    })
}