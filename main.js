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
    new Path(0, 242, 372, 72, 0 ),           // 0
    new Path(0, 372, 372, 72, 0 ),           // 1
    new Path(370, 0, 172, 226, 90 ),         // 2
    new Path(370, 480, 172, 142, 90 ),       // 3
    new Path(378, 704, 164, 110, 90 ),       // 4
    new Path(158, 822, 222, 68, 0),         // 5
    new Path(370, 896, 174, 66, 90),         // 6
    new Path(544, 894, 90, 62, 0),            // 7
    new Path(544, 620, 90, 80, 180),            // 8
    new Path(640, 702, 92, 190, 90),           // 9
    new Path(644, 620, 98, 80, 180),            // 10
    new Path(734, 620, 128, 78, 0, +15),           // 11
    new Path(734, 894, 106, 64, 0),           // 12
    new Path(834, 704, 126, 254, 90),          // 13
    new Path(862, 476, 94, 144, 90),           // 14
    new Path(368, 222, 364, 252, 0 ),          // 15
    new Path(834, 0, 124, 402, 0)             // 16
];

var Graph = [
    [0,15,[[372,276]]],
    [2,15,[[444,226]]],
    [1,15,[[372,406]]],
    [15,3,[[432,480]]],
    [15,16,[[481,275], [649,279],[734,406], [870,424]]],
    [3,8,[[444,622],[544,648]]],
    [3,4,[[444,622],[444,704]]],
    [8,10,[[634,648],[644,648]]],
    [8,9,[[634,648],[644,648],[674,702]]],
    [9,12,[[674,892], [734,914]]],
    [4,5,[[444,814], [401,843], [380,848]]],
    [4,6,[[444,814], [444,896]]],
    [6,7,[[544,915]]],
    [7,12,[[634,915], [734,915]]],
    [7,9,[[674,892]]],
    [12,13,[[834,904]]],
    [10,11,[[735,658]]],
    [11,13,[[862,648], [885,704]]],
    [13,14,[[885,704]]],
    [11,14,[[862,648], [897,620]]],
    [14,16,[[897,476],[884,402]]]
];

let obstacles;

async function main() {
    await Promise.all(images.map(function (image) {
        return new Promise(function (resolve, reject) { image.onload = resolve; });
    }));
    const mapSize = 300;
    const ycoord = 240
    let car = new Car(100, ycoord+32, 0);
    obstacles = [new Car(100, ycoord, 1), new Car(180, ycoord, 1), 
        new Obstacle(541,334,48,32), new Car(497,693,1,90),
        new Obstacle(321,780,60,37), new Car(553,403, 1)
    ]

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

    car.setAutopilot(1, 10);
//obstacles[0].setAutopilot(1, 6);

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
