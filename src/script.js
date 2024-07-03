//brakes not included - made by oli hills
//note: sorry if this is impossible to read. I tried to add comments.


//description needed:


//links the html canvas to js
var c = document.getElementById('cvs');
var ctx = c.getContext('2d');

ctx.canvas.width = 1000;
ctx.canvas.height = 900;

//jesus(stack overflow) gave me this, it stops images from becoming blurry when rotated
ctx.imageSmoothingEnabled = false;

//for every image wait till it loads(currently its just the road can fail to load sometimes);
function Load(images = []){
    for(let i = 0; i < images.length; i++){

        let interval = setInterval(function (){
                if(images[i].complete){
                    clearInterval(interval);
                }
            }
        ,1)
    }
}

//simple AABB collision
function checkCollision(a,b){
    if(a.position.x < b.position.x + b.width && a.position.x + a.width > b.position.x){//if colliding on x
        if(a.position.y < b.position.y + b.height && a.position.y + a.height > b.position.y){// and y
           return true;
        }
    }
    return false;
    
}

//all physics based objects in game, and ones that need collisions
class GameObject {
    constructor(x,y,width,height, image, mass, friction,terminalVel){
        this.terminalVel = terminalVel;
        this.friction = friction
        this.image = image;
        this.velocity = {x:0,y:0};
        this.mass = mass;
        this.acceleration =  {x:0,y:0};
        this.force =  {x:0,y:0};
        this.position = {x: x, y: y};
        this.rotation = 0;
        this.width = width;
        this.height = height;

        this.addForce = function (x,y){
            this.force.x += x * this.mass
            this.force.y += y * this.mass;
        }

        this.convertForces = function (){

            this.acceleration.x = this.force.x / this.mass;
            this.acceleration.y = this.force.y / this.mass;

            this.velocity.x = this.acceleration.x * time.deltaTime;
            this.velocity.y = this.acceleration.y * time.deltaTime;

            //sets values to 0 if they are insignificant
            this.velocity.x = (this.velocity.x < 0.01 && this.velocity.x > -0.01 ) ? 0 : this.velocity.x;
            this.velocity.y = (this.velocity.y < 0.01 && this.velocity.y > -0.01 ) ? 0 : this.velocity.y;

            this.acceleration.x = (this.acceleration.x < 0.01 && this.acceleration.x > -0.01 ) ? 0 : this.acceleration.x;
            this.acceleration.y = (this.acceleration.y < 0.01 && this.acceleration.y > -0.01 ) ? 0 : this.acceleration.y;

            this.force.x = (this.force.x < 0.01 && this.force.x > -0.01 ) ? 0 : this.force.x;
            this.force.y = (this.force.y < 0.01 && this.force.y > -0.01 ) ? 0 : this.force.y;
            
            //terminal velocity
            this.velocity.x = (this.velocity.x > this.terminalVel.x) ? this.terminalVel.x: this.velocity.x;
            this.velocity.y = (this.velocity.y > this.terminalVel.y) ? this.terminalVel.y: this.velocity.y;
            this.velocity.x = (this.velocity.x < -this.terminalVel.x) ? -this.terminalVel.x: this.velocity.x;
            this.velocity.y = (this.velocity.y < -this.terminalVel.y) ? -this.terminalVel.y: this.velocity.y;

        }

        this.offset = function(dx,dy){
            this.position.x += dx;
            this.position.y += dy;
        }

        this.goTo = function(x,y) {
            this.position.x = x;
            this.position.y = y;
        }

        //the reason it is complicated is because it rotates the image.
        this.renderImage = function (){
            ctx.save();//saves the canvas in its current state
            ctx.translate(this.position.x, this.position.y);//moves "0,0" to object position
            ctx.rotate(this.rotation*Math.PI/180.0);//rotates around 0,0
            ctx.translate(-this.position.x, -this.position.y);//moves 0,0 back to 0,0
            ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
            ctx.restore();//restores the canvas in its original state
        } 

        this.render = function (fillColour) {
            ctx.fillStyle = fillColour;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
    }
}

//all buttons and text.
class UI{
    constructor(x,y,w,h,img,shown,text,font){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
        this.shown = shown;
        this.text = text;
        this.font = font;
        this.rotation;

        this.render = function (fillColour, BorderColour) {
            if(this.shown){
                ctx.fillStyle = fillColour;
                ctx.strokeStyle = fillColour;
                ctx.fillRect(this.x, this.y, this.w, this.h);
                ctx.fillText(this.text,this.x,this,y);
            }
        }

        this.renderimage = function (){
            if(this.shown){
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation*Math.PI/180.0);
                ctx.translate(-this.position.x, -this.position.y);
                ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
                ctx.restore();
            }
        }

        this.renderText = function (colour, dx, dy) {
            if(this.shown){
                ctx.fillStyle = colour;
                ctx.font = this.font;
                ctx.fillText(this.text, this.x + dx, this.y + dy);
            }
        }


    }
}


//image initialisation
const ROAD = new Image();
const CAR0 = new Image();
const CAR1 = new Image();
const CAR2 = new Image();
const CAR3 = new Image();
const MENUIMG = new Image();

ROAD.src = "imgs/road.png";
CAR0.src = "imgs/car.png";
CAR1.src = "imgs/car1.png";
CAR2.src = "imgs/car2.png";
CAR3.src = "imgs/car3.png";
MENUIMG.src = "imgs/menu.png";

ROAD.width = 512 * 1.2,ROAD.height = 512 * 2;
CAR0.width = 100,CAR0.height = CAR0.width* 2;
CAR1.width = 100,CAR1.height = CAR1.width* 2;
CAR2.width = 100,CAR2.height = CAR2.width* 2;
CAR3.width = 100,CAR3.height = CAR3.width* 2;

//audio initialisation
const Honk = new Audio("audio/honk.wav");
const Crash = new Audio("audio/crash.wav");
Honk.volume = 1;


//allowing for if i add keybinding option
var keybinds = {
    forward:{key:"w",value:false},
    left:{key:"a",value:false},
    right:{key:"d",value:false},
}

var time = {
    time:0,
    deltaTime: new Date().getTime(),
    pastTime: new Date().getTime(),
}


Load([CAR1,CAR2,CAR3,CAR0,ROAD,MENUIMG]);



var player;
var playerScore;
var playerHealth;

var roads;
var npcs;

var score;
var startScreen;

var paused;
var godMode;
var highscore = ["","","","","","","","","",""];
var lowscore = ["","","","","","","","","",""];
var tables;


init(); 

//initialises all objects and scores(not images)
function init(){

    //game objects
    player = new GameObject(0,0,100,200,CAR0,2,{x:0.99, y:0.99},{x:9200, y:9200});
    roads = [new GameObject(0,0,512,512*2,ROAD,1,0,0),new GameObject(0,0,512,512*2,ROAD,1,0,0)];
    grass = [new GameObject(0,0,200,1000, null, 0,0,0),new GameObject(0,0,200,1000, null, 0,0,0)];

    //UI
    score = new UI(20,30,100,100,null,true,"Score: 0","24px Serif", null);
    startScreen = [new UI(400,500,200,50,null,true,"Start Game", "24px Serif"), new UI(400,570,200,50,null,true, "God Mode: off", "24px Serif")];
    tables = new UI(700,0,300,900,null,true,"Highscore:", "24px Serif");

    //npcs init
    npcs = [];
    for(let i = 0; i < 3; i++){
        npcs.push(new GameObject(0,0,100,200,CAR1,4,{x:0, y:0},{x:99, y:99}));

        switch(Math.round(Math.random() * 3)){
            case(1):
                npcs[i].image = CAR1;
            break;

            case(2):
                npcs[i].image = CAR2;
            break;

            case(3):
                npcs[i].image = CAR3;
            break;
        }

        npcs[i].goTo(225,-200 * Math.random() * 40);//makes so spread out at start of the game
    }

    //random vars
    paused = true;
    godMode = false;
    playerScore = 0;
    playerHealth = 2000;
    


    player.offset(c.width/2 - player.image.width/2,c.height/2 - player.image.height/2);

    roads[0].goTo(c.width/2 - roads[0].width/2 -45, -roads[0].height);
    roads[1].goTo(c.width/2 - roads[1].width/2 -45, 0);

    grass[0].goTo(0,0);
    grass[1].goTo(810,0);
}

//run every frame for rendering
function Loop(){
    ctx.clearRect(0,0,c.width,c.height);

    //rendering
        roads[0].renderImage();
        roads[1].renderImage();
        grass[0].render("green");
        grass[1].render("green");
        player.renderImage(); 
        for(let i = 0; i < npcs.length; i++){
            npcs[i].renderImage();
        }
        
    //score handling
        playerScore += (Math.round(( Math.abs(player.velocity.y + 1) / 100)));
        score.text = "Score: " + playerScore
        score.renderText("black", 5,5);


    //health bar
        playerHealth = (playerHealth < 0) ? 0 : playerHealth;

        ctx.fillStyle = "black";
        ctx.fillRect(20,40,160,20);
        ctx.fillStyle = "red";
        ctx.fillRect(25,45,150,10);
        ctx.fillStyle = "lime";
        ctx.fillRect(25,45,playerHealth/13.333,10);

    //start/death Screen
        if(paused){
            ctx.drawImage(MENUIMG, 0, 0,1000,900);
            startScreen[0].render("#46494f");
            startScreen[0].renderText("Black", 50,32);
            startScreen[1].render("#46494f");
            startScreen[1].renderText("Black", 30,32);
            startScreen[0].shown = true;
            tables.render("rgba(70, 73, 79,0.8)");
            tables.renderText("Black", 20, 24);
            ctx.font = "20px Serif";
            ctx.fillText("1: " + highscore[0], 730, 44);
            ctx.fillText("2: " + highscore[1], 730, 64);
            ctx.fillText("3: " + highscore[2], 730, 84);
            ctx.fillText("4: " + highscore[3], 730, 104);
            ctx.fillText("5: " + highscore[4], 730, 124);
            ctx.fillText("6: " + highscore[5], 730, 144);
            ctx.fillText("7: " + highscore[6], 730, 164);
            ctx.fillText("8: " + highscore[7], 730, 184);
            ctx.fillText("9: " + highscore[8], 730, 204);
            ctx.fillText("10: " + highscore[9], 730, 224);
            ctx.font = "24px Serif";
            ctx.fillText("Lowscore", 720, 254);
            ctx.font = "20px Serif";
            ctx.fillText("1: " + lowscore[0], 730, 274);
            ctx.fillText("2: " + lowscore[1], 730, 294);
            ctx.fillText("3: " + lowscore[2], 730, 314);
            ctx.fillText("4: " + lowscore[3], 730, 334);
            ctx.fillText("5: " + lowscore[4], 730, 354);
            ctx.fillText("6: " + lowscore[5], 730, 374);
            ctx.fillText("7: " + lowscore[6], 730, 394);
            ctx.fillText("8: " + lowscore[7], 730, 414);
            ctx.fillText("9: " + lowscore[8], 730, 434);
            ctx.fillText("10: " + lowscore[9], 730, 454);
        }

    window.requestAnimationFrame(Loop);
}

window.requestAnimationFrame(Loop);


//loops every frame but keeps track of time between frames - for movement and physics
function PhysicsLoop(){
    //setting delta time
        time.deltaTime = (new Date().getTime() - time.pastTime)/100;
        time.pastTime = new Date().getTime();
    

    //death 
    if(playerHealth <= 0){
        paused = true;
        if(!godMode){
            highscore.push(playerScore);
        }

        function Greatest(a,b){
            return b-a;
        }

        highscore.sort(Greatest);

        for(let i = 0; i < lowscore.length; i++){
            if(lowscore[i] == ""){
                lowscore[i] = Infinity;
            }
        }

        lowscore.push(playerScore);
        lowscore.sort((a,b) => a-b);

        for(let i = 0; i < lowscore.length; i++){
            if(lowscore[i] == Infinity){
                lowscore[i] = "";
            }
        }

        init();
    }

    if(highscore.length > 10){
        highscore.pop();
    }

    if(lowscore.length > 10){
        lowscore.pop();
    }

    //slow player if on grass
    if(checkCollision(player,grass[0]) ||   checkCollision(player,grass[1])){
        player.friction.x = 0.90;
        player.friction.y = 0.90;
    }else{
        player.friction.x = 0.99;
        player.friction.y = 0.99;
    }

    //wrapping roads 
    if(roads[0].position.y > c.height){
        roads[0].goTo(roads[1].position.x,  roads[1].position.y - roads[0].height);
    }
    if(roads[1].position.y > c.height){
        roads[1].goTo(roads[1].position.x,  -roads[1].height);
    }


    //physics for player
    player.convertForces();
    player.force.x *= player.friction.x;
    player.force.y *= player.friction.y;

    //offsetting via velocity
    player.offset(player.velocity.x * time.deltaTime,0)
    roads[0].offset(0,-player.velocity.y * time.deltaTime);
    roads[1].offset(0,-player.velocity.y * time.deltaTime);

    //npc handleing
    if(!paused){
        for(let i = 0; i < npcs.length; i++){
            //move every npcs by their velocity
            npcs[i].offset(npcs[i].velocity.x * time.deltaTime, npcs[i].velocity.y - player.velocity.y  * time.deltaTime);
            //if off screen - reset
            if(npcs[i].position.y + 500 < 0 || npcs[i].position.y > c.height + 300){
                npcs[i].velocity.y = -20 * time.deltaTime;
                npcs[i].velocity.x = 0;

                //choose random image
                let rand = Math.round(Math.random() * 3);
                switch(rand){
                    case(1):
                        npcs[i].image = CAR1;
                    break;

                    case(2):
                        npcs[i].image = CAR2;
                    break;

                    case(3):
                        npcs[i].image = CAR3;
                    break;
                }

                //random lane
                switch(Math.round(Math.random() * 4)){
                    case(1):
                        npcs[i].position.x = 225;
                    break;
                    
                    case(2):
                        npcs[i].position.x = 375;
                    break;

                    case(3):
                        npcs[i].position.x = 525;
                    break;

                    case(4):
                        npcs[i].position.x = 675;
                    break;

                }
            }

            //wrapping
            if(npcs[i].position.y + 500 < 0){
                npcs[i].position.y = c.height;
            }else if(npcs[i].position.y > c.height + 300){
                npcs[i].position.y = -200;
            }   

            //npcs collisions
            if(checkCollision(npcs[i], player)){
                let force = {x:0 , y:0}
                while(checkCollision(npcs[i], player)){
                    if(npcs[i].position.x < player.position.x + player.width && npcs[i].position.x > player.position.x + player.width/2){
                        npcs[i].position.x++;
                        force.x++;
                    }else{
                        npcs[i].position.x--;
                        force.x--;
                    }

                    if(npcs[i].position.y < player.position.y + player.height && npcs[i].position.y > player.position.y + player.height/2){
                        npcs[i].position.y++;
                        force.y++;
                    }else{
                        npcs[i].position.y--;
                        force.y--;
                    }
                }
                npcs[i].velocity.x += force.x * time.deltaTime;
                npcs[i].velocity.y += force.y  * (-1 *player.velocity.y / 10) * time.deltaTime;

                player.velocity.y / player.mass * time.deltaTime;
                playerHealth -= Math.abs(Math.round(player.velocity.y/100 + npcs[i].velocity.y));
                Crash.play();
            }
        }
        
    }


    time.time += time.deltaTime;
    window.requestAnimationFrame(PhysicsLoop);
}

window.requestAnimationFrame(PhysicsLoop);




//handles inputs so there is no delay when holding down keys
function inputs(){
if(!paused){
    
    if(keybinds.forward.value == true){
        player.addForce(0,-150 / player.mass * time.deltaTime);
        player.rotation = (player.rotation > -0.1 && player.rotation < 0.1) ? 0 : player.rotation;
        if(player.rotation > 0.1){player.rotation -= 0.7;}
        if(player.rotation < -0.1){player.rotation += 0.7;}
    }

    if(keybinds.left.value  == true){
        player.addForce(-60 / player.mass * time.deltaTime,0);
        player.rotation = -2;
    }

    if(keybinds.right.value == true){
        player.addForce(60 / player.mass * time.deltaTime,0);
        player.rotation = 2;
    }
} 

    window.requestAnimationFrame(inputs);
}

inputs();


//event listeners
document.addEventListener("keydown", function (e){
        switch(e.key){
            case(keybinds.forward.key):
                keybinds.forward.value = true;
            break;

            case(keybinds.left.key):
                keybinds.left.value = true;
            break;

            case(keybinds.right.key):
                keybinds.right.value = true;
            break;

            default:
                const Honk = new Audio("audio/honk.wav");
                Honk.volume = 1;
                Honk.play();
                if(Math.round(Math.random() * 100) == 50){
                    for(let i = 0; i < npcs.length; i++){
                        npcs[i].velocity.x += (npcs[i].position.x > player.position.x) ? 100 : -100;
                        
                    }
                }
            break;
        }
});

document.addEventListener("keyup", function (e){
    switch(e.key){
        case(keybinds.forward.key):
            keybinds.forward.value = false;
        break;

        case(keybinds.left.key):
            keybinds.left.value = false;
        break;

        case(keybinds.right.key):
            keybinds.right.value = false;
        break;
    }
});

document.addEventListener("mousedown", function (event) {
    if(startScreen[0].shown){//start button
        //took this from stack overflow:
            const rect = c.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

        if(x > startScreen[0].x && x < startScreen[0].x + startScreen[0].w){
            if(y > startScreen[0].y && y < startScreen[0].y + startScreen[0].h){
                paused = false;
                startScreen[0].shown = false;
            }
        }
    }

    if(startScreen[1].shown){//easter egg(gives you invincibility by clicking in the very top right corner)
        const rect = c.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        if(x > startScreen[1].x && x < startScreen[1].x + startScreen[1].w){
            if(y > startScreen[1].y && y < startScreen[1].y + startScreen[1].h){
                if(playerHealth < 100000000){
                    playerHealth = Infinity;
                    startScreen[1].text = "God Mode: on";
                    godMode = true;
                }else{
                    playerHealth = 2000;
                    startScreen[1].text = "God Mode: off";
                    godMode = false;
                }
            }
        }
    }
});
