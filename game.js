(function() {
    
    window.requestAnimFrame = (function() {
        return  window.requestAnimationFrame        ||
        window.webkitRequestAnimationFrame          ||
        window.mozRequestAnimationFrame             ||
        window.oRequestAnimationFrame               ||
        window.msRequestAnimationFrame              ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    // Residing place for our Canvas' context
    var ctx = null;
    var brix1 = [];
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var xx = true;
    var Game = {
        // Setup configuration
        canvas: document.getElementById('canvas'),
        setup: function() {
            if (this.canvas.getContext) {
                // Setup variables
                ctx = this.canvas.getContext('2d');

                // Cache width and height of the Canvas to save processing power
                this.width = this.canvas.width;
                this.height = this.canvas.height;

                // Run the game
                Screen.welcome();
                this.canvas.addEventListener('click', this.runGame, false);
                Ctrl.init();
                //setTimeout(Ctrl.init, 100000);
                
            }
        },

        init: function(){
            Paddle.init();
        },

        runGame: function() {
            Game.canvas.removeEventListener('click', Game.runGame, false);
            Game.init();
            // Run animation
            Game.animate();
            
        },

        restartGame: function(){
            xx = true;
        },

        animate: function(){
            Game.play = requestAnimFrame(Game.animate);

            if (xx){
                Game.draw();
            }
           
        },

        draw: function(){
            ctx.clearRect(0, 0, this.width, this.height);
            Paddle.draw();
            Bricks.draw();
        }
    };

    var Screen = {
        welcome: function() {
            // Setup base values
            this.text = 'Wordris';
            this.textSub = 'Click To Start';
            this.textColor = 'white';

            // Create screen
            this.create();
        },

        gameover: function() {
            this.text = 'Game Over';
            this.textSub = 'Click To Retry';
            this.textColor = 'red';

            this.create();
        },

        create: function() {
            // Background
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, Game.width, Game.height);

            // Main text
            ctx.fillStyle = this.textColor;
            ctx.textAlign = 'center';
            ctx.font = '40px helvetica, arial';
            ctx.fillText(this.text, Game.width / 2, Game.height / 2);

            // Sub text
            ctx.fillStyle = '#999999';
            ctx.font = '20px helvetica, arial';
            ctx.fillText(this.textSub, Game.width / 2, Game.height / 2 + 30);
        }
    };

    var Paddle = {
        w: 50,
        h: 20,
        r: 9,
        
        init: function(){
            this.x = 100;
            this.y = 210;
            this.speed = 1;
            this.letter = letters[Math.floor(Math.random() * letters.length)];
        },

        draw: function() {
            this.move();
            
            ctx.fillStyle = this.gradient();
            ctx.fillRect(this.x, this.y, this.w, this.h);

            ctx.fillStyle = "white";
            ctx.fillText(this.letter, this.x + 25, this.y + 15 + 2, 20);
        },

        move: function() {
            // Detect controller input
            if (Ctrl.left && (this.x < Game.width - (this.w))) {
                this.x += this.speed;
            } else if (Ctrl.right && this.x > -this.w) {
                this.x += -this.speed;
            }
            if ((this.y < (550 - this.h)) && !(Bricks.collide(this.x, this.y))){
                this.y += 1;
            }
            else 
            {
                Bricks.save(this.x, this.y, this.letter);
                Bricks.process();
                console.log("Done");
                if (this.y <= 210)
                {
                    brix1 = [];
                    //xx = true;
                    Game.canvas.addEventListener('click', Game.restartGame, false);
                    //while (xx){
                    //    console.log("sssss");
                        Screen.gameover();
                        xx = false;
                        console.log(xx);
                   // }
                    //throw new Error();
                    return;
                    //Game.setup();
                }
                else
                {
                    Game.init();
                }
                
            }
            
        },

        gradient: function() {
            if (this.gradientCache) {
                return this.gradientCache;
            }

            this.gradientCache = ctx.createLinearGradient(this.x, this.y, this.x, this.y + 20);
            this.gradientCache.addColorStop(0, '#111');
            this.gradientCache.addColorStop(1, '#999');

            return this.gradientCache;
        }
    }

    var Bricks = {
        init: function() {
            //var brix = {x: 0, y: 0};
            //this.brix = 5;
            //brix1
        },

        save: function(x1, y1, l1){
            console.log("LALALALALALALA: " + l1);
            brix1.push({x: x1, y: y1, l: l1});
            
        },

        draw: function(){
            
            for (var i = 0; i < brix1.length; i++){
                ctx.fillStyle = "green";
                ctx.fillRect(brix1[i].x, brix1[i].y, 50, 20);
                ctx.fillStyle = "white";
                ctx.fillText(brix1[i].l, brix1[i].x + 25, brix1[i].y + 15, 20);
            }
        },

        collide: function(x2, y2){
            //console.log("collide");
            for (var j = 0; j < brix1.length; j++){
                //console.log("x" +j+": " + brix1[j].x + " y" + j + ":" + brix1[j].y);
                //if (((y2 + 20) >= brix1[j].y) && ((y2 + 20) <= (brix1[j].y + 20)))
                if ((((x2 + 50) > brix1[j].x) && ((x2+50) <=(brix1[j].x + 50)) || (x2 >= brix1[j].x) && (x2 < (brix1[j].x + 50))) && (((y2 + 20) >= brix1[j].y) && ((y2 + 20) <= (brix1[j].y + 20))))
                {
                    //console.log("xx1: " + brix1[j].x + " yy1:" + brix1[j].y);
                    return true;
                }
            }
            return false;
        },

        process: function(){
            var temp1 = [];
            var temp2 = [];
            for (var y = 530; y > 210; y--){
                temp2 = [];
                for (var x = 0; x < 360; x++){
                    
                    for (var n = 0; n < brix1.length; n++)
                    {

                        if ((x == brix1[n].x) && (y == brix1[n].y))
                        {   
                            //console.log("The letter is: " + brix1[n].l);
                            temp2.push(brix1[n].l);
                        }
                    }
                    //console.log(temp2.toString());
                    
                }
                temp1[y] = temp2.toString();
                console.log("The Word is " + temp1[y]);
            }
        }
    };

    var Ctrl = {
        init: function() {
            // Browser based events
            window.addEventListener('keydown', this.keyDown, true);
            window.addEventListener('keyup', this.keyUp, true);
            window.addEventListener('mousemove', this.movePaddle, true);
        },

        keyDown: function(event) {
            switch(event.keyCode) {
                case 39: // Left
                    Ctrl.left = true;
                    break;
                case 37: // Right
                    Ctrl.right = true;
                    break;
                default:
                    break;
            }
        },

        keyUp: function(event) {
            switch(event.keyCode) {
                case 39: // Left
                    Ctrl.left = false;
                    break;
                case 37: // Right
                    Ctrl.right = false;
                    break;
                default:
                    break;
            }
        },

        movePaddle: function(event) {
            var mouseX = event.pageX;
            //console.log(mouseX);
            var canvasX = Game.canvas.offsetLeft;
            var paddleMid = Paddle.w;

            if (mouseX > canvasX + Paddle.w &&
                mouseX < canvasX + Game.width) {
                var newX = mouseX - canvasX;
                newX -= paddleMid;
                Paddle.x = newX;
            }
        }
    };

    window.onload = function() {
    Game.setup();
    };
}());