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
    // Array of bricks
    var brix1 = [];
    // Array of words that will be compared against to determine what has changed
    var masterWords = [];
    // Array of bad words to compare against
    var badWords = [];
    // Array temporarily acting as dictionary in place of DB
    var dictList1 = [{name: "CAB", definition: "Going somewhere in someone else's car"},
                    {name: "BAC", definition: "The side you sleep on"},
                    {name: "CACA", definition: "The poop"}];
    // Letters of Alaphabet usable
    var letters = ["A", "B", "C"];
    //, "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var colors = ["red", "orange", "green", "purple", "blue"]
    // Used to allow game to replay
    var again = true;
    // Area where HTML where definition is displayed
    var defText;
    

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
            defText = document.getElementById('def');
        },

        init: function(){
            FallingBrick.init();
        },

        runGame: function() {
            Game.canvas.removeEventListener('click', Game.runGame, false);
            Game.init();
            // Run animation
            Game.animate();
            
        },

        restartGame: function(){
            again = true;
        },

        animate: function(){
            Game.play = requestAnimFrame(Game.animate);

            if (again){
                Game.draw();
            }
           
        },

        draw: function(){
            ctx.clearRect(0, 0, this.width, this.height);
            FallingBrick.draw();
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

    var FallingBrick = {
        w: 50,
        h: 20,
        
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
                    again = false;
                    console.log(again);
                    return;
                }
                else
                {
                    Game.init();
                }
                
            }
            
        }

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

        // This needs to be separate from collide because brick already in Brix1 and has to skip itself
        collide2: function(x2, y2, n2){
            for (var j = 0; j < brix1.length; j++)
            {
                if (j != n2)
                {
                    if ((((x2 + 50) > brix1[j].x) && ((x2+50) <=(brix1[j].x + 50)) || (x2 >= brix1[j].x) && (x2 < (brix1[j].x + 50))) && (((y2 + 20) >= brix1[j].y) && ((y2 + 20) <= (brix1[j].y + 20))))
                    {
                        return true;
                    }
                }
            }
            return false;
        },

        process: function(){
            var words = this.getListOfWords();
            this.checkIfWords(words);
            this.moveBricksDown();
        },    

        getListOfWords: function(){
            var temp1 = [];
            var temp2 = [];
            
            // From 530 (top) to 210 (limit of bricks)
            for (var y = 530; y > 210; y--)
            {
                temp2 = [];

                // 410 is width of canvas minus 50 (width of brick) = 360
                for (var x = 0; x < 360; x++)
                {
                    // Go through every brick in list
                    for (var n = 0; n < brix1.length; n++)
                    {
                        // If x/y corner of brick matches anything in list of bricks
                        if ((x == brix1[n].x) && (y == brix1[n].y))
                        {   
                            // Add the letter and brick # to list
                            temp2.push({letters: brix1[n].l, number: n});
                        }
                    }
                    
                }

                var temp3= [];
                var temp4 = [];
                for (var z = 0; z < temp2.length; z++)
                {
                    // Have to use this arrays because can't join on temp2[z].letters
                    temp3.push(temp2[z].letters);
                    temp4.push(temp2[z].number);
                }
                // Return list of words and the block numbers that make up each word (used for deletions)
                temp1.push({word: (temp3.join("")), numb: temp4});
            }
            return temp1;
        },

        checkIfWords: function(cList){
            var coords = [];
            coords.sort;
            if (masterWords.length == 0)
            {
                masterWords = cList;
            }
            else
            {
                for (var x = 0; x < cList.length; x++)
                {
                    // If word in array of words doesn't match its counterpart in masterlist then change happened
                    if (cList[x].word != masterWords[x].word)
                    {
                        coords = this.findSubWord(cList[x].word);
                        // remove Bricks
                        if (coords.length > 1)
                        {
                            var werd = cList[x].numb;

                            var removePart1 = werd.splice(coords[0], (coords[1] - coords[0]) + 1);
                            removePart1.sort(function(a, b){return b-a});

                            for (var u = 0; u < removePart1.length; u++)
                            {
                                brix1.splice(removePart1[u], 1);
                            }
                        }
                        masterWords[x] = cList[x];
                    }
                }
            }
        },

        findSubWord: function(daWord){
            var w;
            var nums = [];
            for (var x = 0; x < (daWord.length - 2); x++)
            {
                for (var y = (daWord.length - 1); y > x; y--)
                {
                    w = daWord.substring(x, y+1);
                    // If not in badWords array
                    if (!(this.isBadWord(w)))
                    {
                        // Check if word in Dictionary
                        var z = this.isInDictionary(w);
                        // Dictionary returns "-1" string if not in Dictionary
                        if (z != "-1")
                        {
                            // Return Start and Stop section of word that is in Dictionary
                            nums.push(x);
                            nums.push(y);
                            return nums;
                        }
                        else
                        {
                            // If not in Dictionary, then put in Array of known bad words
                            badWords.push(w);
                        }
                    }
                }
            }
            return nums;
        },

        isBadWord: function(daWord)
        {
            for (var x = 0; x < badWords.length; x++)
            {
                if (daWord == badWords[x])
                {
                    return true;
                }
            }
            return false;
        },

        isInDictionary: function(daWord)
        {
            for (var x = 0; x < dictList1.length; x++)
            {
                if (daWord == dictList1[x].name)
                {
                    var declareDef =  dictList1[x].name + " - Definition: " + dictList1[x].definition;
                    defText.textContent = declareDef;
                    this.xhrTest();
                    return declareDef;
                }
            }
            return "-1";
        },

        moveBricksDown: function(){
            for (var n = 0; n < brix1.length; n++)
            {
                // If x/y corner of brick matches anything in Brix1 array
                while ((brix1[n].y < 530) && !(Bricks.collide2(brix1[n].x, brix1[n].y, n)))
                {
                    brix1[n].y += 1;
                }
            }
        },

        reqListener: function(response) {
            //debugger
            console.log(response.srcElement.responseText);
            //getElementsByTagName("dt")[0].nodeValue);
        },

        xhrTest: function()
        {
            var oReq = new XMLHttpRequest();
            oReq.addEventListener("load", this.reqListener);
            oReq.open("GET", "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/spoon?key=16d591fc-9c27-4304-8057-5faeb1d1da35");
            oReq.send();
            console.log("oReq: " + oReq + " reqListener: ");
        }
    };

    var Ctrl = {
        init: function() {
            // Browser based events
            window.addEventListener('keydown', this.keyDown, true);
            window.addEventListener('keyup', this.keyUp, true);
            window.addEventListener('mousemove', this.moveFallingBrick, true);
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

        moveFallingBrick: function(event) {
            var mouseX = event.pageX;
            //console.log(mouseX);
            var canvasX = Game.canvas.offsetLeft;
            var FallingBrickMid = FallingBrick.w;
            //console.log ("canvasX: " + canvasX + " FallingBrick.w: " + FallingBrick.w);
            if (mouseX > canvasX + FallingBrick.w &&
                mouseX < canvasX + Game.width) {
                var newX = mouseX - canvasX;
                newX -= FallingBrickMid;
                FallingBrick.x = newX;
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