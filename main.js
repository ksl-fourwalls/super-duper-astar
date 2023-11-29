const canvas = document.querySelector("#MyCanvas");
const canvasCtx = canvas.getContext("2d");
const mapcanvas = document.querySelector("#MapCanvas");
const mapCanvasCtx = mapcanvas.getContext("2d");

var images = [
    "images/untitled.png",
    "images/cars.png"
  ].map(function(i) {
    var img = new Image();
    img.src = i;
    return img;
});

async function main() {
    await Promise.all(images.map(function(image) {
        return new Promise(function(resolve, reject) {image.onload = resolve;});
    }));
    ycoord = 100
    let car = new Car(100,ycoord, 0);
    let obstacles = [new Car( 100, ycoord, 1)]

    let camera = { x: 0, y: 0 , w: images[0].width, h:images[0].height, m_const: 3};

    canvasCtx.drawImage(images[0], camera.x, camera.y, camera.w/camera.m_const, camera.h/camera.m_const, 
    0, 0, camera.w, camera.h);

    mapCanvasCtx.drawImage(images[0], camera.x, camera.y, 
        camera.w/camera.m_const, 
        camera.h/camera.m_const, 
        0, 0, 200, 200);
    let zoomFactorInt = 1;
    document.querySelector("#zoom").addEventListener("click", function() {
        if (zoomFactorInt === 1)  {
            zoomFactorInt = 0;
            mapCanvasCtx.drawImage(images[0], 
                0, 0, 200, 200);  

        }
        else {
            zoomFactorInt = 1;
            mapCanvasCtx.drawImage(images[0], camera.x, camera.y, 
                camera.w/camera.m_const, camera.h/camera.m_const, 
                0, 0, 200, 200);

        }
    });
    car.setAutopilot(600,ycoord);

    document.addEventListener("keydown", (event) => {
        if (event.defaultPrevented) {
            return; // Should do nothing if the default action has been cancelled
        }
        let moveImg = 20;
        switch (event.key) {
            case "ArrowDown":
                /*
                camera.y += moveImg;
                if (camera.y >= (camera.h - camera.h/camera.m_const)) {
                    //camera.y = camera.h - camera.h/camera.m_const;
                    camera.y -= moveImg;
                } 

                */
              break;
            case "ArrowUp":
                /*
                camera.y -= moveImg;
                if (camera.y < 0) {
                    camera.y = 0; }
                    */
              break;
            case "ArrowLeft":
                /*
                camera.x -= moveImg;
                if (camera.x < 0) {
                    camera.x = 0; }    
                    */    
                break;
            case "ArrowRight":
                /*
                camera.x += moveImg; 
                if (camera.x >= (camera.w - camera.w/camera.m_const)) {
                    camera.x = camera.w - camera.w/camera.m_const; }// images[0].width - moveImg; }
                break;
                */
            default:
                return; // Quit when this doesn't handle the key event.
        }

    });

    let othervehiclespeed = {x:undefined, y:undefined};

    function updateCoord() {

        car.autopilotMove();
        //https://lazyfoo.net/tutorials/SDL/39_tiling/index.php
        camera.x = Math.round((car.x + car.w /2) - canvas.width / 2);
        camera.y =  Math.round(( car.y + car.h / 2 ) - canvas.height / 2);
        // keep camera  in bound
        if (camera.y < 0) {
            camera.y = 0; 
        }
        if (camera.x < 0) {
                camera.x = 0;
            }  

        if (camera.y >= (camera.h - camera.h/camera.m_const)) {
            camera.y = camera.h - camera.h/camera.m_const;
        } 
        if (camera.x >= (camera.w - camera.w/camera.m_const)) {
            camera.x = camera.w - camera.w/camera.m_const; 
        }
    }
    function render() {
        updateCoord();
        canvasCtx.drawImage(images[0],camera.x, camera.y, 
            camera.w/camera.m_const, camera.h/camera.m_const, 
            0, 0, canvas.width, canvas.height);

        if (zoomFactorInt === 1)  {mapCanvasCtx.drawImage(images[0],0,0, 
            camera.w/camera.m_const, camera.h/camera.m_const, 
            0, 0, 200, 200);
        }
        else {
            mapCanvasCtx.drawImage(images[0], 
                0, 0, 200, 200);  
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



        car.drawRelative(canvasCtx, camera);

        window.requestAnimationFrame(render);
    }
    window.requestAnimationFrame(render);
}

main();
