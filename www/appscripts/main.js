require(
    [],
    function () {
        
        console.log("yo, I'm alive!");

        var paper = new Raphael(document.getElementById("mySVGCanvas"));
        //Put the width and heigth of the canvas into variables for our own convenience
        var pWidth = paper.canvas.offsetWidth;
        var pHeight = paper.canvas.offsetHeight;
    //---------------------------------------------------------------------------------------------------------

        //game background
        var bgRect = paper.rect(0,0,pWidth,pHeight);
        bgRect.attr({"fill": "url(http://media02.hongkiat.com/planet-earth-space-wallpapers/western_hemisphere.jpg)"});

        // Create 25 dots in an array
        // Create a variable to hold the number of elements
        var numDots = 25;
        var dotArray = []; //Initialize the list to empty
        var i = 0; //Initialize the count of dots

        while (i < numDots){
            dotArray[i]= paper.circle(pWidth/2, pHeight/2, 20);
            dotArray[i].attr({"fill": "#A0A0A0"})

            //Initialize the position and rates of the dots
            dotArray[i].xpos = pWidth/2;
            dotArray[i].ypos = pHeight/2;

            // Add properties to keep track of the rate the dot is moving
            // MAPPING of ranges (here, [0,1] -> [-5,5])
            dotArray[i].xrate= -5+10*Math.random();
            dotArray[i].yrate= -7+14*Math.random();

            //Initialize emittable dots
            dotArray[i].emittable = true;

            i++;
        };

    //---------------------------------------------------------------------------------------------------------

        //set the different difficulty levels 
        
        var easy = document.getElementById("easy");
        var medium = document.getElementById("medium");
        var difficult = document.getElementById("difficult");
        var diffLevel;
      
        //difficulty level for the game is being set according to the speed of the target   
        //'if' statement to set the speed so each radio button pressed leads to a different level of the game 
        easy.addEventListener('click', function() {
            console.log("You have chosen Easy level.");
            diffLevel = 500;
        });

        medium.addEventListener('click', function() {
            console.log("You have chosen Medium level.");
            diffLevel = 300;
        });

        difficult.addEventListener('click', function() {
            console.log("You have chosen Difficult level.");
            diffLevel = 100;
        });

        //set default diffLevel value if difficulty level is not chosen
        diffLevel = 500;

    //---------------------------------------------------------------------------------------------------------
        
        // Put a transparent rect OVER everything to collect mouse clicks
        // note: must have fill in order to respond to clicks (even tho we make it transparent!)
        // transRect must be added to paper *after* all dots to be on top.
        var transRect = paper.rect(0,0,pWidth, pHeight);
        transRect.attr({"fill": "white", "fill-opacity": 0});


        //Create a draggable alien
        var alien = paper.circle(100,100,60);
        alien.attr({
            'fill': "url(http://www.gifs.cc/aliens/alien-in-spaceship.gif)", 
            "stroke-opacity": 0
        });

        //To make alien draggable
        //mouseDown variable to keep track of the mouse state between mousemove callbacks       
        var mouseDown = {
            pushed: 0,
            x: 0,
            y: 0,
        };

        //Listen for mousedown on the alien only
        alien.node.addEventListener('mousedown', function(ev){
            mouseDown.pushed = 1;

            mouseDown.x=ev.offsetX;
            mouseDown.y=ev.offsetY;

            //console.log("mouseDown");
        });

        //alien is draggable only when mouseDown is on it
        alien.node.addEventListener('mousemove', function(ev){
            mouseDown.x=ev.offsetX;
            mouseDown.y=ev.offsetY;
            if (mouseDown.pushed) {    
                alien.attr({'cx': ev.offsetX, 'cy': ev.offsetY});
            }
            //console.log("mousemove");
        });
        
        alien.node.addEventListener('mouseup', function(ev){
            mouseDown.pushed = 0;
            //console.log("mouseup");
        });

    //---------------------------------------------------------------------------------------------------------

        var counter = 0;
        var dist;
        
        //to start game using start button
        var startButton = paper.circle(300, 200, 80);
        var startText = paper.text(300, 200, 'START');
        startText.attr({'font-size': "15px", 'font-weight': "bold"});
        startButton.attr({
            'fill': "url(http://www.psdgraphics.com/wp-content/uploads/2011/09/metal-plate-rivets.jpg)", 
            'stroke': "black", 
            'stroke-width': 1
        });

        //hide button and text when game begins
        startButton.hide();
        startText.hide();

        var ready = function(){
        	//show start button again when i want to
            startButton.show();
        	startText.show();
            //hide alien when start button is shown
            alien.hide();

            //bring dotArrays back to its original position when game restarts
            i = 0;
            while (i < numDots){
                
                dotArray[i].xpos = pWidth/2;
                dotArray[i].ypos = pHeight/2;

                // Add properties to keep track of the rate the dot is moving
                // MAPPING of ranges (here, [0,1] -> [-5,5])
                dotArray[i].xrate= -5+10*Math.random();
                dotArray[i].yrate= -7+14*Math.random();

                dotArray[i].emittable = true;

                i++;
            };
            
            //ask the player to select their preferred level of difficulty
            alert("Set your preferred difficulty level for the game! Good Luck!");            
        };

        var mt;
        var em;
        var timeout;

        var start = function() {
            console.log("The game is starting");
        	
        	//hide start button when game is starting 
            startButton.hide();
        	startText.hide();

            //show alien when game starts
            alien.show();
            //bring alien back to its original position whenever game restarts
            alien.attr({'cx': 100, 'cy': 100});

            //show arrays when game starts
            i=0;
            while(i<numDots){
                dotArray[i].show();
                dotArray[i].attr({
                    "fill": "#A0A0A0",
                    'fill-opacity': 1
                });
                i++
            };

        	counter = 0;

            //this is to stop the game (in 20 secs)
            timeout = setTimeout(gameStop, 20000);

            //this is to start moving the targets
            moveTarget();
            mt = setInterval(moveTarget,40);
            em = setInterval(emitter, diffLevel);
            
	        //Play music when webpage loads
	        alienSpaceship.play();
        };

        startButton.node.addEventListener('click', start);

    //---------------------------------------------------------------------------------------------------------

        var moveTarget = function(){

            i=0;
            while(i<numDots){
                //Update x and y position of the dots
                dotArray[i].xpos += dotArray[i].xrate;
                dotArray[i].ypos += dotArray[i].yrate;
                //Now actually move the dot using our 'state' variables
                dotArray[i].attr({'cx': dotArray[i].xpos, 'cy': dotArray[i].ypos});

                //if mouse is pushed, this function will be executed
                if (mouseState.pushed === true){
                    //distance between dotArrays and mouse clicks
                    dist = distance(dotArray[i].xpos, dotArray[i].ypos, mouseState.x, mouseState.y);

                    //to calculate if clicks are on the dotArray target
                    if (dist<20){

                        dotArray[i].attr({
                            "fill": "white", 
                            "fill-opacity": 0,
                            "stroke-opacity": 0,
                            'cx': -100,
                            'cy': -100
                        });

                        //once a dot is clicked, that particular dot will no longer be emitted again
                        dotArray[i].emittable = false;

                        counter++;
                        console.log("your click count is now " + counter);
                    };
                };

                //distance between dotArrays and alien
                dist = distance(dotArray[i].xpos, dotArray[i].ypos, mouseDown.x, mouseDown.y);

                //if dot has not been clicked before and if it "hits" the alien, the game is over
                if (dist < 35 & dotArray[i].emittable === true){
                    console.log("got a hit between target " + i + " and myObject!");
                    gameStop();
                };

                i++;
            };
        };

    //---------------------------------------------------------------------------------------------------------

        // Mouse tracking - used to change graphical feature in vicinty of mouse
        var mouseState = {
            pushed: false,
            x: 0,
            y: 0,
        };

        transRect.node.addEventListener("click", function(ev){
            mouseState.pushed=true;
            //console.log("the mouse state is " + mouseState.pushed);

            mouseState.x=ev.offsetX;
            mouseState.y=ev.offsetY;

            moveTarget();
            mouseState.pushed=false;
        });

        // write a distance function of four variables
        var distance=function(x1,y1,x2, y2){
            return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
        };

    //---------------------------------------------------------------------------------------------------------

        //To keep track of which dot is being emitted
        var nextToEmit=0;

        // new interval timer that emits by setting one dot's position back to the center of the page
        var emitter = function(){

            //if the nextToEmit dot has already been clicked, nextToEmit+1 dot will be called instead
            while(dotArray[nextToEmit].emittable === false){
                // "mod" operator (%) to loop the "next to emit" counter 
                nextToEmit = (nextToEmit+1) % numDots;
                //console.log("next to emit is " + nextToEmit);                  
            };

                dotArray[nextToEmit].xpos = pWidth/2;
                dotArray[nextToEmit].ypos = pHeight/2;

                // Add properties to keep track of the rate the dot is moving
                // MAPPING of ranges (here, [0,1] -> [-5,5])
                dotArray[nextToEmit].xrate= -5+10*Math.random();
                dotArray[nextToEmit].yrate= -7+14*Math.random();

                // "mod" operator (%) to loop the "next to emit" counter 
                nextToEmit = (nextToEmit+1) % numDots;
                //console.log("next to emit is " + nextToEmit);  
        };

    //---------------------------------------------------------------------------------------------------------

        //setting the game to run for a fixed amount of time no matter how many successful clicks are made
        var gameStop = function (){
            confirm("You have destroyed " + counter + " asteroids! Good job! :)");
            console.log("20 seconds up");

            //reset the counter
            counter = 0;

            //clear moveTarget, emitter and time limit when game ends
            clearInterval(mt);
            clearInterval(em);
            clearTimeout(timeout);

            //hide dots
            i=0;
            while(i<numDots){
                dotArray[i].hide();
                i++
            };

            ready();
            alienSpaceship.pause();
        };

        ready(); // Put the start button on the screen

        //set background music
        var alienSpaceship = new Audio("resources/alienSpaceship.wav");
    }
);