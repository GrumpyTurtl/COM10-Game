var c = document.getElementById('cvs');
var ctx = c.getContext('2d');

ctx.canvas.width = 1000;
ctx.canvas.height = 900;

//jesus(stack overflow) gave me this in a dream
ctx.imageSmoothingEnabled = false;

var debugX = 100, debugY = 100;
function Debug(value){
    ctx.font = "10px serif";
    ctx.fillStyle = "white";
    ctx.fillText(value, debugX,debugY);
    debugX += 10;
}

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

   
    if(aMax.x > bMin.x && bMax.x > aMin.x){
        
        if(aMax.y > bMin.y && bMax.y > aMin.y){
            // let collisionDepth = {}
            // collisionDepth.x = (aMax.x > bMin.x) ? aMax.x - bMin.x : bMax.x - aMin.x;
            // collisionDepth.x = (aMax.y > bMin.y) ? aMax.y - bMin.y : bMax.y - aMin.y;
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function render(a, fillColour) {

    ctx.lineWidth = 10;
    ctx.beginPath();

    for (var i = 0; i < a.vertices.length; i++) {
            ctx.lineTo(a.vertices[i].x, a.vertices[i].y);
    }

    ctx.fillStyle = fillColour;
    ctx.fill();
    ctx.closePath();
}



function rotateVertex(vertex, center, angle) {
    const xDiff = vertex.x - center.x;
    const yDiff = vertex.y - center.y;
  
    const xNew = center.x + xDiff * Math.cos(angle) - yDiff * Math.sin(angle);
    const yNew = center.y + xDiff * Math.sin(angle) + yDiff * Math.cos(angle);
  
    return { x: xNew, y: yNew };
}

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
    constructor(vertices, image, mass, friction){
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

        this.addForce = function (x,y){
            this.force.x += x * this.mass
            this.force.y += y * this.mass;
        }

        this.convertForces = function (){
            this.acceleration.x = this.force.x / this.mass;
            this.acceleration.y = this.force.y / this.mass;
        
            this.velocity.x = this.acceleration.x * time.deltaTime;
            this.velocity.y = this.acceleration.y * time.deltaTime;
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
    }


}

class UI{
    constructor(x,y,w,h,shown,text,button,buttoncall){
        
    }
}

class Vector {
    constructor({x=0,y=0}={}){
        this.x = x;
        this.y = y;
    }
}




const car0 = new Image();
const car1 = new Image();
const car2 = new Image();
const car3 = new Image();
car0.src = "imgs/car.png";
car1.src = "imgs/car1.png";
car2.src = "imgs/car2.png";
car3.src = "imgs/car3.png";
car0.width = 100,car0.height = car0.width* 2;
car1.width = 100,car1.height = car1.width* 2;
car2.width = 100,car2.height = car2.width* 2;
car3.width = 100,car3.height = car3.width* 2;

var player = new GameObject([{x:0,y:0},{x:100,y:0},{x:100,y:200},{x:0,y:200}],car0,1,{x:0.90, y:0.99});

var keybinds = {
    forward:"w",
    left:"a",
    down:"s",
    right:"d",
}

var time = {
    time:0,
    deltaTime:1,
}

/*the "loading" screen
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,c.width,c.height);
    ctx.fillText("Loading", 100,100);
*/

Load([car1,car2,car3,car0]);//waits for each image to load
player.offset(c.width/2 - player.image.width/2,c.height/2 - player.image.height/2)

function Loop(){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = "green"
    ctx.fillRect(0,0,c.width,c.height);

    player.renderImage(c.width/2,c.height/2);

    window.requestAnimationFrame(Loop);
}

window.requestAnimationFrame(Loop);
setInterval(PhysicsLoop, time.deltaTime);

function PhysicsLoop(){
    player.convertForces();
    player.force.x *= player.friction.x
    player.force.y *= player.friction.y
    


    time.time += time.deltaTime;
}


function inputs(e){
    if(e.key){
        switch(e.key){
            case(keybinds.forward):
                player.addForce(0,-1);
                player.rotation = (player.rotation > -0.1 && player.rotation < 0.1) ? 0 : player.rotation;
                if(player.rotation > 0.1){player.rotation -= 0.5;}
                if(player.rotation < -0.1){player.rotation += 0.5;}
            break;

            case(keybinds.left):
                player.addForce(-1,0);
                player.rotation = -2;
            break;

            case(keybinds.down):
                player.addForce(0,1);
                player.rotation = (player.rotation > -0.1 && player.rotation < 0.1) ? 0 : player.rotation;
                if(player.rotation > 0.1){player.rotation -= 0.5;}
                if(player.rotation < -0.1){player.rotation += 0.5;}
            break;

            case(keybinds.right):
                player.addForce(1,0);
                player.rotation = 2;
            break;
        }
    }
}
document.addEventListener("keydown", inputs);
c.addEventListener("mousemove", inputs);
document.addEventListener("mousedown", inputs);
document.addEventListener("wheel", inputs);