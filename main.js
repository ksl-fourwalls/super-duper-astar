const canvas = document.querySelector("#MyCanvas");
const canvasCtx = canvas.getContext("2d");
const mapcanvas = document.querySelector("#MapCanvas");
const mapCanvasCtx = mapcanvas.getContext("2d");

var images = [
    "images/untitled.png",
    "images/cars.png"
].map(function (i) {
    var img = new Image();
    img.src = i;
    return img;
});


let global_obstacles = [
    [0, 0, 366, 237],
    [0, 450, 363,248],
    [540,477,325,146],
    [534,0,291,243],
    [718,237,177,146],
    [539,699,99, 197],
    [735,698,95,196],
    [0,895,366,61]
];

let PathLister = [
    new Path(0, 242, 372, 72, 0, [15]),           // 0
    new Path(0, 372, 372, 72, 0, [15]),           // 1
    new Path(370, 0, 172, 226, 90, [15]),         // 2
    new Path(370, 480, 172, 142, 90, [15, 8, 4]),       // 3
    new Path(378, 704, 164, 110, 90, [3, 8, 6, 5]),       // 4
    new Path(158, 822, 222, 68, 0,[4,6]),         // 5
    new Path(370, 896, 174, 66, 90,[7,4,5]),         // 6
    new Path(544, 894, 90, 62, 0,[6,9,12]),            // 7
    new Path(544, 620, 90, 80, 180,[3,4,10]),            // 8
    new Path(640, 702, 92, 190, 90,[10,7,12]),           // 9
    new Path(644, 620, 98, 80, 180,[11,8,9]),            // 10
    new Path(734, 620, 128, 78, 0),           // 11
    new Path(734, 894, 106, 64, 0),           // 12
    new Path(834, 704, 126, 254, 90),          // 13
    new Path(862, 476, 94, 144, 90),           // 14
    new Path(368, 222, 364, 252, 0,[0, 1, 2, 3] ),          // 15
    new Path(834, 0, 124, 402, 0)             // 16
];

let obstacles;

function checkCollision(a, b) {
    //The sides of the rectangles
    let leftA, leftB;
    let rightA, rightB;
    let topA, topB;
    let bottomA, bottomB;

    //Calculate the sides of rect A
    leftA = a.x;
    rightA = a.x + a.w;
    topA = a.y;
    bottomA = a.y + a.h;

    //Calculate the sides of rect B
    leftB = b.x;
    rightB = b.x + b.w;
    topB = b.y;
    bottomB = b.y + b.h;

    //If any of the sides from A are outside of B
    if( bottomA <= topB )
    {
        return false;
    }

    if( topA >= bottomB )
    {
        return false;
    }

    if( rightA <= leftB )
    {
        return false;
    }

    if( leftA >= rightB )
    {
        return false;
    }

    //If none of the sides from A are outside B
    return true;
}

async function main() {
    await Promise.all(images.map(function (image) {
        return new Promise(function (resolve, reject) { image.onload = resolve; });
    }));
    const mapSize = 300;
    const ycoord = 240
    let car = new Car(100, ycoord+32, 0);
    obstacles = [new Car(100, ycoord, 1), new Car(180, ycoord, 1)]

    let camera = { x: 0, y: 0, w: images[0].width, h: images[0].height };


    canvasCtx.drawImage(images[0], camera.x, camera.y, canvas.width, canvas.height,
        0, 0, camera.w, camera.h);

    mapCanvasCtx.drawImage(images[0], camera.x, camera.y,
        canvas.width,
        canvas.height,
        0, 0, mapSize, mapSize);
    let zoomFactorInt = 1;
    document.querySelector("#zoom").addEventListener("click", function () {
        if (zoomFactorInt === 1) {
            zoomFactorInt = 0;
            mapCanvasCtx.drawImage(images[0],
                0, 0, mapSize, mapSize);

        }
        else {
            zoomFactorInt = 1;
            mapCanvasCtx.drawImage(images[0], camera.x, camera.y,
                canvas.width, canvas.height,
                0, 0, mapSize, mapSize);

        }
    });

 car.setAutopilot();
    mapcanvas.addEventListener("click", function(e) {
        if (zoomFactorInt == 1)
            return;
        let rect = mapcanvas.getBoundingClientRect();
        let width = e.clientX-rect.left, height = e.clientY-rect.top;
        if (width < rect.right && height < rect.right)
        {
        }
           
    });

    document.addEventListener("keydown", (event) => {
        if (event.defaultPrevented) {
            return; // Should do nothing if the default action has been cancelled
        }
        let moveImg = 20;
        switch (event.key) {
            default:
                return; // Quit when this doesn't handle the key event.
        }

    });

    let othervehiclespeed = { x: undefined, y: undefined };

    function updateCoord() {

        car.autopilotMove();
        //https://lazyfoo.net/tutorials/SDL/39_tiling/index.php
        camera.x = Math.round((car.x + car.w / 2) - canvas.width / 2);
        camera.y = Math.round((car.y + car.h / 2) - canvas.height / 2);
        // keep camera  in bound
        if (camera.y < 0) {
            camera.y = 0;
        }
        if (camera.x < 0) {
            camera.x = 0;
        }

        if (camera.y >= (camera.h - canvas.height)) {
            camera.y = camera.h - canvas.height;
        }
        if (camera.x >= (camera.w - canvas.width)) {
            camera.x = camera.w - canvas.width;
        }
    }
    function render() {
        updateCoord();
        canvasCtx.drawImage(images[0], camera.x, camera.y,
            camera.w, camera.h,
            0, 0, camera.w, camera.h);

        if (zoomFactorInt === 1) {
            mapCanvasCtx.drawImage(images[0], camera.x, camera.y,
                canvas.width, canvas.height,
                0, 0, mapSize, mapSize);
        }
        else {
            mapCanvasCtx.drawImage(images[0],
                0, 0, mapSize, mapSize);
        }
        obstacles.forEach(element => {
            element.draw(canvasCtx, camera);
        });
        /*

        car.x, car.y

        x,y
        --------------------
        |                  |
        |                  |
        |                  |
        |                  |
        --------------------
                        w,h
        camera.w/camera.m_const
        camera.x
                          
        */



        car.draw(canvasCtx, camera);

        window.requestAnimationFrame(render);
    }
    window.requestAnimationFrame(render);
}

main();
