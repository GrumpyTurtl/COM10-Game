//brakes not included

//links the html canvas to js
var c = document.getElementById('cvs');
var ctx = c.getContext('2d');

ctx.canvas.width = 1000;
ctx.canvas.height = 900;

//jesus(stack overflow) gave me this in a dream, it stops images from becoming blurry when rotated
ctx.imageSmoothingEnabled = false;

//shows values on screen
var debugX = 100, debugY = 100;
function Debug(value){
    ctx.font = "10px serif";
    ctx.fillStyle = "white";
    ctx.fillText(value, debugX,debugY);
    debugX += 10;
}

//for every image wait till it loads(currently game is small enough to not need it)
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


function checkCollision(a,b){
    if(a.position.x < b.position.x + b.width && a.position.x + a.width > b.position.x){
        if(a.position.y < b.position.y + b.height && a.position.y + a.height > b.position.y){
            return true;
        }
    }
    return false;
}


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

        // this.rotate = function(degrees){
        //     let center = findCenter(this.vertOrigin);
        //     let radians = degrees * Math.PI/180;

        //     for (let i = 0; i < this.vertices.length; i++) {
        //         this.vertices[i] = rotateVertex(this.vertOrigin[i], center, radians);
        //     }
        // }

        //this.rotate(this.rotation);

        this.renderImage = function (){
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation*Math.PI/180.0);
            ctx.translate(-this.position.x, -this.position.y);
            ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
            ctx.restore();
        } 

        //draws every vertex and fills it in
        this.render = function (fillColour) {
            ctx.fillStyle = fillColour;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
    }


}


class UI{
    constructor(x,y,w,h,img,shown,text, font,buttoncall){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
        this.shown = shown;
        this.text = text;
        this.font = font;
        this.buttoncall = buttoncall;
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
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation*Math.PI/180.0);
            ctx.translate(-this.position.x, -this.position.y);
            ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
            ctx.restore();
        }

        this.renderText = function (colour) {
            ctx.fillStyle = colour;
            ctx.font = this.font;
            ctx.fillText(this.text, this.x, this.y);
        }

    }
}



const road = new Image();
const car0 = new Image();
const car1 = new Image();
const car2 = new Image();
const car3 = new Image();
road.src = "imgs/road.png";
car0.src = "imgs/car.png";
car1.src = "imgs/car1.png";
car2.src = "imgs/car2.png";
car3.src = "imgs/car3.png";
road.width = 512 * 1.2,road.height = 512 * 2;
car0.width = 100,car0.height = car0.width* 2;
car1.width = 100,car1.height = car1.width* 2;
car2.width = 100,car2.height = car2.width* 2;
car3.width = 100,car3.height = car3.width* 2;


var player = new GameObject(0,0,100,200,car0,1,{x:0.99, y:0.99},{x:200, y:200});

var roads = [new GameObject(0,0,512,512*2,road,1,0,0),new GameObject(0,0,512,512*2,road,1,0,0)];

var grass = [new GameObject([{x:0,y:0},{x:500,y:0},{x:500,y:0},{x:500,y:c.height},{x:0,y:c.height},{x:0,y:0}], null, 0,0,0),new GameObject([{x:0,y:0},{x:100,y:0},{x:100,y:0},{x:500,y:c.height},{x:0,y:c.height}], null, 0,0,0)];

var score = new UI(30,30,100,100,null,true,"Score: 0","24px Serif", null);

var playerScore = 0;

var npcs = [];
for(let i = 0; i < 3; i++){
    npcs.push(new GameObject(0,0,100,200,car1,1,{x:0, y:0},{x:99, y:99}))

    switch(Math.round(Math.random() * 3)){
        case(1):
            npcs[i].image = car1;
        break;

        case(2):
            npcs[i].image = car2;
        break;

        case(3):
            npcs[i].image = car3;
        break;
    }

    npcs[i].offset(225,-200);
}



var world = {
    x:0,
    y:0,
}

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

/*the "loading" screen
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,c.width,c.height);
    ctx.fillText("Loading", 100,100);
*/


Load([car1,car2,car3,car0,road]);//waits for each image to load

player.offset(c.width/2 - player.image.width/2,c.height/2 - player.image.height/2);

roads[0].goTo(c.width/2 - roads[0].width/2, -roads[0].height);
roads[1].goTo(c.width/2 - roads[1].width/2, 0);

grass[0].offset(c.width/2 + roads[0].image.width/2, 0);
grass[1].offset(roads[0].position.x - 500, 0);

function Loop(){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = "green"
    ctx.fillRect(0,0,c.width,c.height);

    //check if elements are off screen
    // if(roads[0].position.y + roads[0].height < 0){
    //     roads[0].goTo(roads[1].position.x,roads[1].position.y + roads[1].height);
    // }
    // if(roads[1].position.y + roads[1].height < 0){
    //     roads[1].goTo(roads[1].position.x,roads[0].position.y + roads[0].height);
    // }

    if(roads[0].position.y > c.height){
        roads[0].goTo(roads[1].position.x,  roads[1].position.y - roads[0].height);
    }
    if(roads[1].position.y > c.height){
        roads[1].goTo(roads[1].position.x,  -roads[1].height);
    }

    roads[0].renderImage();
    roads[1].renderImage()
    player.renderImage(); 

    player.render("blue");

    for(let i = 0; i < npcs.length; i++){
        npcs[i].render("purple");
    }
    
    if(time.deltaTime != 0){
        playerScore += (Math.round((time.time * Math.abs(player.velocity.y + 1) / 100)));
    }
    score.text = "Score: " + playerScore
    score.renderText("black");

    window.requestAnimationFrame(Loop);
}

window.requestAnimationFrame(Loop);

function PhysicsLoop(){
    time.deltaTime = (new Date().getTime() - time.pastTime)/100;
    time.pastTime = new Date().getTime();

    if(checkCollision(player,grass[0]) ||   checkCollision(player,grass[1])){
        player.friction.x = 0.90;
        player.friction.y = 0.90;
    }else{
        player.friction.x = 0.99;
        player.friction.y = 0.99;
    }


    player.convertForces();
    player.force.x *= player.friction.x;
    player.force.y *= player.friction.y;

    player.offset(player.velocity.x * time.deltaTime,0)
    roads[0].offset(0,-player.velocity.y * time.deltaTime);
    roads[1].offset(0,-player.velocity.y * time.deltaTime);
    world.y += -player.velocity.y * time.deltaTime;



    for(let i = 0; i < npcs.length; i++){
        npcs[i].velocity.y = -20 * time.deltaTime;

        npcs[i].offset(npcs[i].velocity.x * time.deltaTime, npcs[i].velocity.y - player.velocity.y  * time.deltaTime)







        if(npcs[i].position.y + 500 < 0 || npcs[i].position.y > c.height + 300){
            //image
            let rand = Math.round(Math.random() * 3);
            switch(rand){
                case(1):
                    npcs[i].image = car1;
                break;

                case(2):
                    npcs[i].image = car2;
                break;

                case(3):
                    npcs[i].image = car3;
                break;
            }

            //lane
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

        if(npcs[i].position.y + 500 < 0){
            npcs[i].position.y = c.height;
        }else if(npcs[i].position.y > c.height + 300){
            npcs[i].position.y = -200;
        }


        if(checkCollision(npcs[i], player)){
            console.log("collsion")
            npcs[i].velocity.x = player.velocity.x - npcs[i].mass * player.mass;
            npcs[i].velocity.x = player.velocity.x - npcs[i].mass * player.mass;

            player.addForce(npcs[i].mass * player.mass * -player.velocity.x,npcs[i].mass * player.mass * -player.velocity.y);
        }

    }
    










    time.time += time.deltaTime;
    window.requestAnimationFrame(PhysicsLoop);
}

window.requestAnimationFrame(PhysicsLoop);

function inputs(){
    if(keybinds.forward.value == true){
        player.addForce(0,-70 / player.mass * time.deltaTime);
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
        

    window.requestAnimationFrame(inputs);
}

inputs();
//inputs
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

c.addEventListener("mousemove", function () {

});

document.addEventListener("mousedown", function () {

});


document.addEventListener("wheel", function () {

});
