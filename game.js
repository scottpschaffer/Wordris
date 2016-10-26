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
    var masterWords = [];
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var colors = ["red", "orange", "green", "purple", "blue"]
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
            this.color = colors[Math.floor(Math.random() * colors.length)];
        },

        draw: function() {
            this.move();
            
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);

            ctx.fillStyle = "white";
            ctx.fillText(this.letter, this.x + 25, this.y + 15 + 2, 20);
        },

        move: function() {
            // Detect controller input
            if (Ctrl.left && (this.x < Game.width - (this.w))) {
                this.x += this.speed;
            } else if (Ctrl.right && this.x > 0) {
                this.x += -this.speed;
            }
            if ((this.y < (550 - this.h)) && !(Bricks.collide(this.x, this.y))){
                this.y += 1;
            }
            else 
            {
                Bricks.save(this.x, this.y, this.letter, this.color);
                Bricks.process();
                console.log("Done");
                if (this.y <= 210)
                {
                    brix1 = [];

                    Game.canvas.addEventListener('click', Game.restartGame, false);
                    Screen.gameover();
                    xx = false;
                    console.log(xx);
                    return;
                }
                else
                {
                    Game.init();
                }
                
            }
            
        },

    }

    var Bricks = {
        init: function() {

        },

        save: function(x1, y1, l1, c1){
            brix1.push({x: x1, y: y1, l: l1, c: c1});
        },

        draw: function(){
            
            for (var i = 0; i < brix1.length; i++){
                ctx.fillStyle = brix1[i].c;
                ctx.fillRect(brix1[i].x, brix1[i].y, 50, 20);
                ctx.fillStyle = "white";
                ctx.fillText(brix1[i].l, brix1[i].x + 25, brix1[i].y + 15, 20);
            }
        },

        collide: function(x2, y2){
            //console.log("collide");
            for (var j = 0; j < brix1.length; j++)
            {
                if ((((x2 + 50) > brix1[j].x) && ((x2+50) <=(brix1[j].x + 50)) || (x2 >= brix1[j].x) && (x2 < (brix1[j].x + 50))) && (((y2 + 20) >= brix1[j].y) && ((y2 + 20) <= (brix1[j].y + 20))))
                {
                    return true;
                }
            }
            return false;
        },

        process: function(){
            var words = this.getListOfWords();
        },    

        getListOfWords: function(){
            var temp1 = [];
            var temp2 = [];
            for (var y = 530; y > 210; y--)
            {
                temp2 = [];
                for (var x = 0; x < 360; x++)
                {
                    
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
            return temp1;
        },

        checkIfWords: function(cList){
            if (masterWords.length == 0)
            {
                masterWords = cList;
            }
            else
            {
                for (var x = 0; x < cList.length; x++)
                {
                    if (cList[x] != masterWords[x])
                    {
                        var result = findWord(cList[x]);
                        x
                    }
                }
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
            //console.log ("canvasX: " + canvasX + " Paddle.w: " + Paddle.w);
            if (mouseX > canvasX + Paddle.w &&
                mouseX < canvasX + Game.width) {
                var newX = mouseX - canvasX;
                newX -= paddleMid;
                Paddle.x = newX;
            }
        }
    };

/*Key (Dictionary):
Key (Student 4):
16d591fc-9c27-4304-8057-5faeb1d1da35
ff732ecd-23b1-4a56-a316-2aedfca4050c */

    window.onload = function() {
    Game.setup();
    };
}());