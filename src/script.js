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


//very basic SAT that only works on rectangles,
function checkCollision(a,b){
    //setting initial values
    let aMax = {x:0,y:0};
    let aMin = {x:Infinity,y:Infinity};
    let bMax = {x:0,y:0};
    let bMin = {x:Infinity,y:Infinity};

    //gets the biggest and smallest x vertex, y vertex for both objects
    for(let i = 0; i < Math.max(a.vertices.length, b.vertices.length); i++){
        if(a.vertices[i]){
        aMax.x = Math.max(a.vertices[i].x, aMax.x);
        aMin.x = Math.min(a.vertices[i].x, aMin.x);
        aMax.y = Math.max(a.vertices[i].y, aMax.y);
        aMin.y = Math.min(a.vertices[i].y, aMin.y);
        }

        if(b.vertices[i]){
        bMax.x = Math.max(b.vertices[i].x, bMax.x);
        bMin.x = Math.min(b.vertices[i].x, bMin.x);
        bMax.y = Math.max(b.vertices[i].y, bMax.y);
        bMin.y = Math.min(b.vertices[i].y, bMin.y);

        }
        
    }//note: this is resource heavy, Might be better to save the values to the object, and update them on position change
    //note:its all resource heavy, fix it maybe

   //if it is colliding on the x axis
    if(aMax.x > bMin.x && bMax.x > aMin.x){
        //and if its colliding on the y axis
        if(aMax.y > bMin.y && bMax.y > aMin.y){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}




//some math stuff that i stole from somewhere ages ago,  used for rotating hitbox,not in use so far, maybe delete it?
function rotateVertex(vertex, center, angle) {
    const xDiff = vertex.x - center.x;
    const yDiff = vertex.y - center.y;
  
    const xNew = center.x + xDiff * Math.cos(angle) - yDiff * Math.sin(angle);
    const yNew = center.y + xDiff * Math.sin(angle) + yDiff * Math.cos(angle);
  
    return { x: xNew, y: yNew };
}

//also used for roation, and physics later
function findCenter(vertices){
    const n = vertices.length;
    let sumX = 0;
    let sumY = 0;

    for(const vertex of vertices){
        sumX += vertex.x;
        sumY += vertex.y;
    }

    return { x: sumX/n, y: sumY/n};
}


class GameObject {
    constructor(vertices, image, mass, friction,terminalVel){
        this.terminalVel = terminalVel;
        this.friction = friction
        this.vertices = vertices;
        this.vertOrigin = vertices;
        this.image = image;
        this.velocity = {x:0,y:0};
        this.mass = mass;
        this.acceleration =  {x:0,y:0};
        this.force =  {x:0,y:0};
        this.position = this.vertices[0];
        this.rotation = 0;
        if(image){
            this.width = image.width;
            this.height = image.height;
        }

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
            for (let i = 0; i < this.vertices.length; i++) {
                this.vertices[i] = {
                    x: this.vertices[i].x + dx,
                    y: this.vertices[i].y + dy,
                };
            }
            this.position = this.vertices[0];
        }

        this.goTo = function(x,y) {
            for (let i = 0; i < this.vertices.length; i++) {
                this.vertices[i] = {
                    x: this.vertOrigin[i].x + x,
                    y: this.vertOrigin[i].y + y
                }
            }
        }

        this.rotate = function(degrees){
            let center = findCenter(this.vertOrigin);
            let radians = degrees * Math.PI/180;

            for (let i = 0; i < this.vertices.length; i++) {
                this.vertices[i] = rotateVertex(this.vertOrigin[i], center, radians);
            }
        }

        this.rotate(this.rotation);

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
            ctx.lineWidth = 10;
            ctx.beginPath();

            for (var i = 0; i < this.vertices.length; i++) {
                    ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
            }

            ctx.fillStyle = fillColour;
            ctx.fill();
            ctx.closePath();
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

class Vector {
    constructor({x=0,y=0}={}){
        this.x = x;
        this.y = y;
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


var player = new GameObject([{x:0,y:0},{x:100,y:0},{x:100,y:200},{x:0,y:200}],car0,1,{x:0.99, y:0.99},{x:99, y:99});

var roads = [new GameObject([{x:0,y:0}],road,1,0,0),new GameObject([{x:0,y:0}],road,1,0,0)];

var grass = [new GameObject([{x:0,y:0},{x:500,y:0},{x:500,y:0},{x:500,y:c.height},{x:0,y:c.height}], null, 0,0,0),new GameObject([{x:0,y:0},{x:500,y:0},{x:500,y:0},{x:500,y:c.height},{x:0,y:c.height}], null, 0,0,0)];

var score = new UI(30,30,100,100,null,true,"Score: 0","24px Serif", null);
var acoholLevel = new UI(c.width - 170, 30, 100,100,null, true, "Acohol Level: 0", "24px serif", null)

var npcs = [];
for(let i = 0; i < 5; i++){
    npcs.push(new GameObject([{x:0,y:0},{x:100,y:0},{x:100,y:200},{x:0,y:200}],car1,1,{x:0.99, y:0.99},{x:99, y:99}))
}



var world = {
    x:0,
    y:0,
}

var keybinds = {
    forward:{key:"w",value:false},
    left:{key:"a",value:false},
    down:{key:"s",value:false},
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

roads[0].offset(c.width/2 - roads[0].image.width/2,c.height/2 - roads[0].image.height/2);
roads[1].offset(c.width/2 - roads[0].image.width/2,c.height/2 - roads[0].image.height/2 + roads[0].height);

grass[0].offset(c.width/2 + roads[0].image.width/2, 0);
grass[1].offset(roads[0].position.x - 500, 0);


function Loop(){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = "green"
    ctx.fillRect(0,0,c.width,c.height);

    //check if elements are off screen
    if(roads[0].position.y + roads[0].height < 0){
        roads[0].offset(0,roads[0].height*2);
    }
    if(roads[1].position.y + roads[1].height < 0){
        roads[1].offset(0,roads[1].height*2);
    }

    if(roads[0].position.y > c.height){
        roads[0].offset(0,-roads[1].height*2);
    }
    if(roads[1].position.y > c.height){
        roads[1].offset(0,-roads[0].height*2);
    }
    for(let i = 0; i < npcs.length; i++){
        let currentNpc = npcs[i];

        if(currentNpc > c.height){
            if(player.velocity.x > 0){

            }else{
                
            }
        }

        if(currentNpc < 0){
            if(player.velocity.x > 0){

            }else{

            }
        }
    }

    roads[0].renderImage();
    roads[1].renderImage();
    player.renderImage();  


    score.text = "Score: " + Math.round(time.time);
    score.renderText("black");
    //acoholLevel.renderText("black");

    window.requestAnimationFrame(Loop);
}

window.requestAnimationFrame(Loop);

function PhysicsLoop(){
    time.deltaTime = (new Date().getTime() - time.pastTime)/100;
    time.pastTime = new Date().getTime();
    player.convertForces();
    player.force.x *= player.friction.x;
    player.force.y *= player.friction.y;

    player.offset(player.velocity.x * time.deltaTime,0)
    roads[0].offset(0,-player.velocity.y * time.deltaTime);
    roads[1].offset(0,-player.velocity.y * time.deltaTime);
    world.y += -player.velocity.y

    if(checkCollision(player,grass[0]) ||   checkCollision(player,grass[1])){
        
    }

    time.time += time.deltaTime;
    window.requestAnimationFrame(PhysicsLoop);
}

window.requestAnimationFrame(PhysicsLoop);

function inputs(){
    if(keybinds.forward.value == true){
        player.addForce(0,-10 / player.mass);
        player.rotation = (player.rotation > -0.1 && player.rotation < 0.1) ? 0 : player.rotation;
        if(player.rotation > 0.1){player.rotation -= 0.7;}
        if(player.rotation < -0.1){player.rotation += 0.7;}
    }

    if(keybinds.left.value  == true){
        player.addForce(-10 / player.mass,0);
        player.rotation = -2;
    }

    if(keybinds.down.value== true){
        player.addForce(0,10 / player.mass);
        player.rotation = (player.rotation > -0.1 && player.rotation < 0.1) ? 0 : player.rotation;
        if(player.rotation > 0.1){player.rotation -= 0.7;}
        if(player.rotation < -0.1){player.rotation += 0.7;}
    }

    if(keybinds.right.value == true){
        player.addForce(10 / player.mass,0);
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

            case(keybinds.down.key):
                keybinds.down.value = true;
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

        case(keybinds.down.key):
            keybinds.down.value = false;
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
