/**
 * A background canvas Nyan cat
 *
 * Does not work in IE
 */
var nyan = {

    path: '',
    wrapper: null,
    canvas:  null,
    sound:   null,
    last:    null,
    step: 1,
    timeout: null,

    /**
     * Call this when the DOM is ready
     *
     * @param string path - where the nyan cat files are located, no trailing slash!
     */
    init: function (path){
        nyan.path = path;

        // keep out incompatible browsers
        if(!document.createElement('audio').canPlayType) return;
        if(!document.createElement('canvas').getContext) return;

        // wrap around everythng in the body
        // http://stackoverflow.com/questions/1577814
        nyan.wrapper = document.createElement('div');
        while (document.body.firstChild) {
            nyan.wrapper.appendChild(document.body.firstChild);
        }
        nyan.setStyle(document.body,nyan.wrapper);
        nyan.wrapper.style.zIndex = 5;
        document.body.appendChild(nyan.wrapper);

        // create the canvas
        nyan.canvas = document.createElement('canvas');
        nyan.setStyle(document.body,nyan.canvas);
        nyan.canvas.style.zIndex = 1;
        nyan.canvas.width  = nyan.wrapper.offsetWidth;
        nyan.canvas.height = nyan.wrapper.offsetHeight;
        document.body.insertBefore(nyan.canvas,nyan.wrapper);

        // add the audio object
        nyan.sound = document.createElement('audio');
        if(nyan.sound.canPlayType('audio/mpeg') != ''){
            nyan.sound.src = nyan.path+'/nyanlooped.mp3';
        }else{
            nyan.sound.src = nyan.path+'/nyanlooped.ogg';
        }

        nyan.sound.addEventListener('ended',function(){
            // loop around
            // http://forestmist.org/2010/04/html5-audio-loops/
            this.currentTime = 0;
        }, false);
        document.body.appendChild(nyan.sound);

        // add mouse listener
        nyan.wrapper.addEventListener('mousemove', nyan.onMouseMove);
    },

    /**
     * Set the cursor to nyan cat in the correct animation step
     */
    setCursor: function(step,left){
        nyan.wrapper.style.cursor = 'url('+nyan.path+'/'+(left?'l':'r')+step+'.png), default';
    },

    /**
     * Stops the madness
     */
    stop: function(){
        nyan.wrapper.style.cursor = 'auto';
        nyan.sound.pause();
    },

    /**
     * The real worker
     *
     * draws nyan cat, the rainbow and starts the audio
     */
    onMouseMove: function(evt){
        var mousePos = nyan.getMousePos(nyan.wrapper, evt);

        if(!nyan.last){
            nyan.last = mousePos;
            return;
        }

        if(Math.abs(nyan.last.x - mousePos.x) >= 1 ||
           Math.abs(nyan.last.y - mousePos.y) > 1) {
            var context = nyan.canvas.getContext('2d');

            // start sound and timeout
            nyan.sound.play();
            if(nyan.timeout) window.clearTimeout(nyan.timeout);
            nyan.timeout = window.setTimeout(nyan.stop,500);

            // red
            context.beginPath();
            context.rect(mousePos.x +5, mousePos.y +2, 15, 3);
            context.fillStyle = 'rgba(255,0,0,0.5)';
            context.fill();

            // orange
            context.beginPath();
            context.rect(mousePos.x +5, mousePos.y +5, 15, 3);
            context.fillStyle = 'rgba(255,153,0,0.5)';
            context.fill();

            // yellow
            context.beginPath();
            context.rect(mousePos.x +5, mousePos.y +8, 15, 3);
            context.fillStyle = 'rgba(255,255,0,0.5)';
            context.fill();

            // geen
            context.beginPath();
            context.rect(mousePos.x +5, mousePos.y +11, 15, 3);
            context.fillStyle = 'rgba(51,255,0,0.5)';
            context.fill();

            // blue
            context.beginPath();
            context.rect(mousePos.x +5, mousePos.y +14, 15, 3);
            context.fillStyle = 'rgba(0,153,255,0.7)';
            context.fill();

            // purple
            context.beginPath();
            context.rect(mousePos.x +5, mousePos.y +17, 15, 3);
            context.fillStyle = 'rgba(102,51,255,0.5)';
            context.fill();

            //animate
            nyan.setCursor(nyan.step,((nyan.last.x - mousePos.x) > 0));

            // animation counter
            nyan.step++;
            if(nyan.step > 12) nyan.step = 1;

            // remember position
            nyan.last = mousePos;
        }

    },

    /**
     * copy styles from body to our wrapper and canvas
     *
     * needed to keep any margins or paddings
     */
    setStyle: function(from, to){
        var style = window.getComputedStyle(from);
        to.style.cssText = style.cssText;
        to.style['position'] = 'absolute';
        to.style['top'] = '0px';
        to.style['left'] = '0px';
        to.style['background'] = 'transparent none';
    },

    /**
     * return mouse position relative to the given object
     */
    getMousePos: function(obj, evt){
        // get canvas position
        var top = 0;
        var left = 0;
        while (obj && obj.tagName != 'BODY') {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }

        // return relative mouse position
        var mouseX = evt.clientX - left + window.pageXOffset;
        var mouseY = evt.clientY - top + window.pageYOffset;
        return {
            x: mouseX,
            y: mouseY
        };
    }
}
