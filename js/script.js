var cnv = document.getElementById("cnv").getContext("2d");
cnv.font = "30px Arial";
var leather = new Image();
leather.src = "./images/backGround.jpg";
const FPS = 50;
var HEIGHT = 600;
var WIDTH = 500;
var BRICK_WIDTH = 50;
var BRICK_HEIGHT = 20;
var MAX_COLORS = 7;
var brickList={};
var counter=0;
var changePaddleColor=0;
var speed =5;
var score = 0;
var HighScore = 0;
var isRunning = false;
var color=[
    'red',
    'green',
    'yellow',
    'blue',
    'black',
    'orange',
    'violet'
];

var paddle = {
    x_pos:WIDTH/2,
    y_pos:HEIGHT-20,
    width:60,
    height:15,
    color:'red',
};
var ball = {
    radius:7,
    c_x:paddle.x_pos+paddle.width/2,
    c_y:paddle.y_pos,
    xvel:-0.5,
    yvel:-0.5,
    vel:1,
    color:'black'
}
createBrick = function(id,x_pos,y_pos,width,height,color){
    var brick = {
        x_pos:x_pos,
        y_pos:y_pos,
        width:width,
        height:height,
        color:color
    }
    brickList[id] = brick;

}
distance = function(x1,y1,x2,y2){
    return(Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)));
}
checkCollision = function(p_rect, p_circle)
{
    //return binary
    //last 5 bits will be used
    // last bit 1 if colision 1 otherwise
    // 2nd last 1 if xvel is +ve ,0 if no change
    // 3rd last 1 if xvel is -ve, 0 if no change
    // 4th last 1 if yvel is +ve, 0 if no change
    // 5th last 1 if yvel is -ve ,0 if no change
    //6th last bit 1 if xvel may need to be increased a little

    if(p_circle.c_x + p_circle.radius < p_rect.x_pos) //checks if ball is too left to the brick
        return 0;
    if(p_circle.c_y +p_circle.radius < p_rect.y_pos)//checks if ball is too above
        return 0;
    if(p_circle.c_x - p_circle.radius > p_rect.x_pos + p_rect.width)//checks if ball is too right
        return 0;
    if(p_circle.c_y - p_circle.radius > p_rect.y_pos + p_rect.height)//checks if ball is too below
        return 0;


    //if it hits only down part not bottom corners;
    if(p_circle.c_y > p_rect.y_pos+p_rect.height && p_circle.c_x >= p_rect.x_pos &&p_circle.c_x <= p_rect.x_pos + p_rect.width)//checks if ball hits below brick
    {

        //p_circle.y_vel = abs_double(p_circle.y_vel);
        return 9;//0b01001
    }

    //checks if ball hits upper face of brick but not corners
    if(p_circle.c_y < p_rect.y_pos && p_circle.c_x >= p_rect.x_pos &&p_circle.c_x <= p_rect.x_pos + p_rect.width)
    {
        //std::cout<<"upper\n";
        //p_circle.y_vel = -abs_double(p_circle.y_vel);
        return 17;//0b10001;
    }

    //checks if ball hits left side but not corners
    if(p_circle.c_x < p_rect.x_pos && p_circle.c_y >= p_rect.y_pos && p_circle.c_y <= p_rect.y_pos + p_rect.height)
    {
        //std::cout<<"left\n";

       // if(p_circle.x_vel==0)
         //   p_circle.x_vel = 0.5;  //sets a little velocity so that ball don't keep hitting other bricks above or below it
        //p_circle.x_vel = -abs_double(p_circle.x_vel);//if it hits a brick on left side it should be deflected toward right

        return 37;//0b100101;
    }

    //checks if bal hits right side but not corners
    if(p_circle.c_x > p_rect.x_pos +p_rect.width && p_circle.c_y >= p_rect.y_pos && p_circle.c_y <= p_rect.y_pos + p_rect.height)
    {
        //std::cout<<"right\n";

        //if(p_circle.x_vel==0)
       //     p_circle.x_vel = 0.5;
        //p_circle.x_vel = abs_double(p_circle.x_vel);

        return 35;//0b100011;
    }

    // checks for left upper corner
    if(distance(p_circle.c_x, p_circle.c_y , p_rect.x_pos, p_rect.y_pos)< p_circle.radius-2)
    {
        //std::cout<<"upper left\n";
        //check if ball hit left or upper side
        if(Math.abs(p_circle.x_vel) > Math.abs(p_circle.y_vel)) //if x vel is greater that
        {                                                   //means ball hits on left side
            //p_circle.x_vel = -abs_double(p_circle.x_vel);

            return 5;//0b00101;
        }
        else if(Math.abs(p_circle.x_vel) < Math.abs(p_circle.y_vel))
        {
            //checks if ball hit upper side
            //p_circle.y_vel = -abs_double(p_circle.y_vel);

            return 9;//0b01001;
        }
        else
        {
            // ball hit at exactly 45 degree ball should go upper left
            //p_circle.x_vel = -abs_double(p_circle.x_vel);
            //p_circle.y_vel = -abs_double(p_circle.y_vel);

            return 21;//0b10101;
        }
    }

    //checks for upper
    //right corner
    if(distance(p_circle.c_x, p_circle.c_y , p_rect.x_pos+p_rect.width, p_rect.y_pos) < p_circle.radius-2)
    {
        //std::cout<<"upper right\n";
        if(Math.abs(p_circle.x_vel) > Math.abs(p_circle.y_vel)) //if x vel is greater that
        {                                                   //means ball hits on right side
            //p_circle.x_vel = -abs_double(p_circle.x_vel);

            return 5;//0b00101;
        }
        else if(Math.abs(p_circle.x_vel) < Math.abs(p_circle.y_vel))
        {
            //checks if ball hit uright side of corner
            //p_circle.x_vel = abs_double(p_circle.x_vel);

            return 3;//0b00011;
        }
        else
        {
            // ball hit at exactly 45 degree ball should go upper left
           // p_circle.x_vel = abs_double(p_circle.x_vel);
            //p_circle.y_vel = -abs_double(p_circle.y_vel);

            return 19;//0b10011;
        }
    }

    //checks for bottom right corner
    if(distance(p_circle.c_x, p_circle.c_y , p_rect.x_pos+p_rect.width, p_rect.y_pos+p_rect.height) < p_circle.radius-2)//-2 just for less sensitivity of corners so that
    {                                                                                                                 //if 2 tiles are together bottom get hits first not corner of other tile
        if(Math.abs(p_circle.x_vel) > Math.abs(p_circle.y_vel)) //if x vel is greater that
        {                                                   //means ball hits on right side
            //checks for right side of corner
            //also checks if x velocity is not zero if so the set some little value
            //if(p_circle.x_vel == 0)
              //  p_circle.x_vel = 0.5;
            //p_circle.x_vel = abs_double(p_circle.x_vel);

            return 35;//0b100011;
        }
        else if(Math.abs(p_circle.x_vel) < Math.abs(p_circle.y_vel))
        {
            //checks if ball hit uright side of corner
            //p_circle.y_vel = abs_double(p_circle.y_vel);

            return 9;//0b01001;
        }
        else
        {
            // ball hit at exactly 45 degree ball should go upper left
            //p_circle.x_vel = abs_double(p_circle.x_vel);
            //p_circle.y_vel = abs_double(p_circle.y_vel);

            return 11;//01011;
        }
    }

    //checks for bottom left corner
    if(distance(p_circle.c_x, p_circle.c_y , p_rect.x_pos, p_rect.y_pos+p_rect.height) < p_circle.radius-2)
    {
        if(Math.abs(p_circle.x_vel) > Math.abs(p_circle.y_vel)) //if x vel is greater that
        {                                                   //means ball hits on left side
            //checks for left side of corner
            //also checks if x velocity is not zero if so the set some little value
            //if(p_circle.x_vel == 0)
              //  p_circle.x_vel = 0.5;
            //p_circle.x_vel = -abs_double(p_circle.x_vel);

            return 37;//0b100101;
        }
        else if(Math.abs(p_circle.x_vel) < Math.abs(p_circle.y_vel))
        {
            //checks if ball hit bottom side of corner
            //p_circle.y_vel = abs_double(p_circle.y_vel);

            return 9;//0b01001;
        }
        else
        {
            // ball hit at exactly 45 degree ball should go upper left
            //p_circle.x_vel = -abs_double(p_circle.x_vel);
            //p_circle.y_vel = abs_double(p_circle.y_vel);

            return 13;//0b01101;
        }
    }
    return 0;
}


drawEverything = function(){
    cnv.save();
    var pattern = cnv.createPattern(leather,'repeat');
    cnv.fillStyle = pattern;
    cnv.fillRect(0,70,500,530);
    cnv.restore();
    for(var bricks in brickList){
        cnv.save();
        var g1 = cnv.createLinearGradient(brickList[bricks].x_pos, brickList[bricks].y_pos, brickList[bricks].x_pos + brickList[bricks].width, brickList[bricks].y_pos + brickList[bricks].height);
        g1.addColorStop(0,color[Math.floor(bricks*6+0.9)]);
        //g1.addColorStop(,color[Math.floor(bricks*6+0.9)]);

        g1.addColorStop(0.5,'white');
        g1.addColorStop(1,color[Math.floor(bricks*6+0.9)])
        cnv.fillStyle = g1;
        cnv.fillRect(brickList[bricks].x_pos, brickList[bricks].y_pos, brickList[bricks].width, brickList[bricks].height);
        cnv.lineWidth = 1;
        cnv.strokeStyle = 'black';
        cnv.strokeRect(brickList[bricks].x_pos, brickList[bricks].y_pos, brickList[bricks].width, brickList[bricks].height);
        cnv.restore();
    }
    cnv.save();
    var g1 = cnv.createLinearGradient(paddle.x_pos, paddle.y_pos, paddle.x_pos, paddle.y_pos+paddle.height);
    g1.addColorStop(0,color[(counter+1)%7]);
    g1.addColorStop(0.2,color[(counter+2)%7]);
    g1.addColorStop(0.4,color[(counter+3)%7]);
    g1.addColorStop(0.6,color[(counter+4)%7]);
    g1.addColorStop(0.8,color[(counter+5)%7]);
    g1.addColorStop(1,color[(counter+6)%7]);
    changePaddleColor++;
    if(changePaddleColor%4==0){
        counter++;
    counter = counter%7;
    }
    cnv.fillStyle = g1;
    cnv.fillRect(paddle.x_pos, paddle.y_pos, paddle.width, paddle.height);
    cnv.lineWidth = 1;
    cnv.strokeStyle = 'black';
    cnv.strokeRect(paddle.x_pos, paddle.y_pos, paddle.width, paddle.height)
    cnv.beginPath();
    var g2 = cnv.createRadialGradient(ball.c_x,ball.c_y,0,ball.c_x-ball.radius/4,ball.c_y+ball.radius/4, ball.radius);
    g2.addColorStop(0,'white');
    g2.addColorStop(1,'black');
    cnv.fillStyle = g2;
    cnv.arc(ball.c_x, ball.c_y, ball.radius,0, 2*Math.PI, false);
    cnv.fill();
    cnv.arc(ball.c_x, ball.c_y, ball.radius,0, 2*Math.PI, false);
    cnv.lineWidth = 2;
    cnv.strokeStyle = 'black';
    cnv.stroke();
    cnv.fillRect(0,67,WIDTH,3);
    if(score > HighScore)
        HighScore = score;
    cnv.fillText('Score: ' + score ,10,40);
    cnv.fillText('HighScore: '+ HighScore,230,40);
    cnv.restore();



}
startGame = function(){
    counter++;
    brickList = {};
    isRunning = false;
    score = 0;
    speed = 5;
    ball.xvel =0;
    ball.yvel = 0;
    ball.vel = 0;
    ball.c_x=paddle.x_pos+paddle.width/2;
    ball.c_y=paddle.y_pos-ball.radius;
    for(var i = 0; i <= WIDTH - BRICK_WIDTH ;i+=BRICK_WIDTH){
        for(var j = 70; j < HEIGHT/2.5+70; j+=BRICK_HEIGHT){
            var x = Math.floor(Math.random()*3.9)
            //creating a random variable whether or not to create a brick at coordinate x,y about 75% chances
            if(x==0||x==2||x==3||j==70){
                //if so create a random color brick at that point
                var c = color[Math.floor(Math.random() * (MAX_COLORS+0.9))];
                //plus 0.9 to make the chances of last color also equal as we are taking floor value
                var id = Math.random();
                createBrick(id,i,j,BRICK_WIDTH,BRICK_HEIGHT,c);
            }

        }
    }
}
updateVariables = function(){
    ball.c_x += ball.xvel;
    ball.c_y += ball.yvel;
    if(ball.c_x <0 || ball.c_x >= WIDTH)
        ball.xvel = -ball.xvel;
    if(ball.c_y <70)
        ball.yvel = -ball.yvel;
    else if(ball.c_y >= HEIGHT){
        counter = 0;
        if(score>=HighScore){
            alert('Congrats! You Made the high Score');
        }
        startGame();
    }
    for(bricks in brickList){
        var isCollision = checkCollision(brickList[bricks],ball);
        if(isCollision>0)
        if(isCollision >0){
            if(isCollision/32 >= 1){
                ball.xvel = 0.3;
                isCollision = isCollision%32;
            }
            if(isCollision/16>=1){
                ball.yvel = -Math.abs(ball.yvel);
                isCollision = isCollision%16;
            }
            if(isCollision/8 >=1){
                ball.yvel = Math.abs(ball.yvel);
                isCollision = isCollision%8;
            }
            if(isCollision/4 >= 1){
                ball.xvel = -Math.abs(ball.xvel);
                isCollision = isCollision%4;
            }
            if(isCollision/2>=1){
                ball.xvel = Math.abs(ball.xvel);
            }
            delete(brickList[bricks]);
            if(score < 200){
                speed = 5;
                score += 50;
            }
            else if(score < 500){
                score+=60;
                speed = 6;
            }
            else if(score <1000){
                score+=100;
                speed = 7;
            }
            else if(score < 3000){
                score+=200;
                speed = 8;
            }
            else if(score < 6000){
                speed = 9;
                score += 400;
            }
            else if(score < 8000){
                speed = 10;
                score+=500;
            }
            else if(score < 12000){
                speed = 11;
                score+=550;
            }
            else if(score < 15000){
                speed = 12;
                score+=650;
            }
            else if(score < 20000){
                speed = 13;
                score+=800;
            }
            else if(score < 28000){
                speed = 14;
                score+=1000;
            }
            else if(score <  40000){
                speed = 15;
                score+=2000;
            }
            else if(score < 55000){
                speed = 16;
                score += 2200;
            }
            else if(score < 80000){
                speed = 17;
                score += 2500;
            }
            else if(score < 100000){
                speed = 18;
                score+= 3000;
            }         
            else if(score < 150000){
                speed = 19;
                score += 4000;
            }
            else if(score < 170000){
                speed = 20;
                score += 7000;
            }
            else{
                speed = 21;
                score += 10000;
            }
        }
    }

    //////////////AFTER HERE JUST TO CHECK
    /////////////////////////////
    /////////////////////////
    var isCollision = checkCollision(paddle,ball);
    if(isCollision){
        var v = ball.c_x - (paddle.x_pos);
            //v increases towards right
            if(v <= (paddle.width )/21.0) //divides by 13.0 to make it double
                ball.xvel = -0.60*ball.vel; //paddle is divided in 13 parts 1 is zero vel other are in pairs having same abs(velocity)
            else if(v <= 2*(paddle.width )/21.0)
                ball.xvel = -0.54*ball.vel;
            else if(v <= 3*(paddle.width )/21.0)
                ball.xvel = -0.48*ball.vel;
            else if(v <= 4*(paddle.width )/21.0)
                ball.xvel = -0.42*ball.vel;
            else if(v <= 5*(paddle.width )/21.0)
                ball.xvel = -0.36*ball.vel;
            else if(v < 6*(paddle.width )/21.0)
                ball.xvel = -0.30*ball.vel;
            else if(v <= 7*(paddle.width)/21.0)
                ball.xvel = -0.24*ball.vel;
            else if(v <= 8*(paddle.width)/21.0)
                ball.xvel = -0.18*ball.vel;
            else if(v <= 9*(paddle.width)/21.0)
                ball.xvel = -0.12*ball.vel;
            else if(v < 10*(paddle.width)/21.0) //equals towards left
                ball.xvel = -0.06*ball.vel;         //side of paddle
            else if(v <= 11*(paddle.width )/21.0)  //center area is max
                ball.xvel = 0;                       //and not equal right side
            else if(v < 12*(paddle.width )/21.0)   //so both sides area of impact is same
                ball.xvel = 0.06*ball.vel;
            else if(v < 13*(paddle.width )/21.0)
                ball.xvel = 0.12*ball.vel;
            else if(v < 14*(paddle.width )/21.0)
                ball.xvel = 0.18*ball.vel;
            else if(v < 15*(paddle.width )/21.0)
                ball.xvel = 0.24*ball.vel;
            else if(v < 16*(paddle.width )/21.0)
                ball.xvel = 0.30*ball.vel;
            else if(v < 17*(paddle.width )/21.0)
                ball.xvel = 0.36*ball.vel;
            else if(v < 18*(paddle.width )/21.0)
                ball.xvel = 0.42*ball.vel;
            else if(v < 19*(paddle.width )/21.0)
                ball.xvel = 0.48*ball.vel;
            else if(v < 20*(paddle.width )/21.0)
                ball.xvel = 0.54*ball.vel;
            else
                ball.xvel = 0.60*ball.vel;

            ball.yvel = -Math.abs(Math.sqrt(ball.vel*ball.vel - ball.xvel*ball.xvel));
        }

}
update = function(){
    for(var j = 0; j < speed;j++){
        updateVariables();
    }
    cnv.clearRect(0,0,WIDTH,HEIGHT);
    drawEverything();       
}
document.onclick = function(mouse){
    if(!isRunning){
        isRunning = true;
        ball.vel = 1;
        ball.xvel = -0.5;
        ball.yvel = -Math.abs(Math.sqrt(ball.vel*ball.vel - ball.xvel*ball.xvel));;
       
    }
}
document.onmousemove = function(mouse){
    var mouseX = mouse.clientX - document.getElementById("cnv").getBoundingClientRect().left;
    var mouseY = mouse.clientY - document.getElementById("cnv").getBoundingClientRect().top;
    if(mouseX - paddle.width/2 < 0)
        paddle.x_pos = 0;
    else if(mouseX + paddle.width/2 > WIDTH)
        paddle.x_pos = WIDTH - paddle.width;
    else
        paddle.x_pos = mouseX - paddle.width/2;
    if(!isRunning){

    ball.c_x=paddle.x_pos+paddle.width/2;
    ball.c_y=paddle.y_pos-ball.radius;
    }
}

startGame();
setInterval(update,1000/FPS);