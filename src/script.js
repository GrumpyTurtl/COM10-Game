var c = document.getElementById('cvs');
var ctx = c.getContext('2d');

ctx.canvas.width  = window.innerHeight*1.25;
ctx.canvas.height = window.innerHeight*0.95;

var debugX = 100, debugY = 100;
function Debug(value){
    ctx.font = "10px serif"
    ctx.fillStyle = "white"
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
        ,100)
    }
}


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


class GameObject {
    constructor(vertices, image){
        
    }
}

class Vector {
    constructor({x=0,y=0}={}){
        this.x = x;
        this.y = y;
    }
}


var player = new GameObject();
player.vertices = [
    {x:0,y:0},
    {x:100,y:0},
    {x:100,y:200},
    {x:0,y:200},
]
const car0 = new Image()
const car1 = new Image()
const car2 = new Image()
const car3 = new Image()
car0.src = "imgs/car.png";
car1.src = "imgs/car1.png";
car2.src = "imgs/car2.png";
car3.src = "imgs/car3.png";

ctx.fillStyle = "white";
ctx.fillRect(0,0,c.width,c.height);
ctx.fillText("Loading", 100,100);
Load([car1,car2,car3,car0]);
ctx.fillRect(0,0,c.width,c.height);
ctx.drawImage(car0,c.width/2 - car0.width/2,c.height/2 - car0.height/2);