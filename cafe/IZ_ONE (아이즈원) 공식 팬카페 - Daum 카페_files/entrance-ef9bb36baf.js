/*
 * 대문 뷰어 script 
 * 
 */
document.domain = "daum.net";
function Resizer() {
    this.intervalId = null;
    this.roopCnt = 5;
    this.preh = -1;
    this.glb = null;
}
Resizer.prototype = {
    init: function (glb) {
        this.glb = glb;
        this.resizeFromLocalStorage();
        this.resize();
    },
    call: function () {
        this.roopCnt--;
        this.intervalId = setTimeout(this.glb + '.resize()', 1000);
    },
    resize: function () {
        if (document.body) {
            var height = document.getElementById("EntranceArea").offsetHeight;
            if (this.preh == height || this.roopCnt < 0) {
                this.execute(height);
                return;
            }
            this.preh = height;
        }
        this.call();
    },
    execute: function (height) {
        clearTimeout(this.intervalId);
        if (parent && parent.document.getElementById('entrance_intro')) {
            parent.document.getElementById('entrance_intro').height = height;
            if (!!window.localStorage) {
                window.localStorage.setItem(this.glb, height);
            }
            this.resizeForBorder();
        }
    },
    resizeForBorder: function () {
        var target = document.getElementById('tx_background_opacity');
        if(target !== null){
			var base = document.getElementById("EntranceArea");
			var diff = parseInt(target.style.borderWidth) * 2;

			target.style.height = base.offsetHeight - diff + 'px';
			target.style.width = base.offsetWidth - diff + 'px';
        }
    },
    resizeFromLocalStorage: function() {
        if (!!window.localStorage) {
            var prevHeight = window.localStorage.getItem(this.glb);
            if (!!prevHeight) {
                this.execute(prevHeight)
            }
        }
    }
};
var IFRAME_RESIZE_SHELL = null;
function forceResize() {
    IFRAME_RESIZE_SHELL = new Resizer();
    IFRAME_RESIZE_SHELL.init("IFRAME_RESIZE_SHELL");
}