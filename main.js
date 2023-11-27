const canvas = document.querySelector("#MyCanvas");
const canvasCtx = canvas.getContext("2d");
const mapcanvas = document.querySelector("#MapCanvas");
const mapCanvasCtx = mapcanvas.getContext("2d");

var images = [
    "/images/untitled.png",
    "/images/cars.png"
  ].map(function(i) {
    var img = new Image();
    img.src = i;
    return img;
});

async function main() {
    await Promise.all(images.map(function(image) {
        return new Promise(function(resolve, reject) {image.onload = resolve;});
    }));
    ycoord = 500
    let car = new Car(0,ycoord, "red");

    let position = { x: 0, y: 0 , w: images[0].width, h:images[0].height, m_const: 3};
    let cameraX = car.x - position.w/position.m_const/2;

    canvasCtx.drawImage(images[0], position.x, position.y, position.w/position.m_const, position.h/position.m_const, 
    0, 0, position.w, position.h);
    mapCanvasCtx.drawImage(images[0], position.x, position.y, 
        position.w/position.m_const, 
        position.h/position.m_const, 
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
            mapCanvasCtx.drawImage(images[0], position.x, position.y, 
                position.w/position.m_const, position.h/position.m_const, 
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
                position.y += moveImg;
                if (position.y >= (position.h - position.h/position.m_const)) {
                    //position.y = position.h - position.h/position.m_const;
                    position.y -= moveImg;
                } 

                */
              break;
            case "ArrowUp":
                /*
                position.y -= moveImg;
                if (position.y < 0) {
                    position.y = 0; }
                    */
              break;
            case "ArrowLeft":
                /*
                position.x -= moveImg;
                if (position.x < 0) {
                    position.x = 0; }    
                    */    
                break;
            case "ArrowRight":
                /*
                position.x += moveImg; 
                if (position.x >= (position.w - position.w/position.m_const)) {
                    position.x = position.w - position.w/position.m_const; }// images[0].width - moveImg; }
                break;
                */
            default:
                return; // Quit when this doesn't handle the key event.
        }

    });

    let carCoord = {x: undefined, y: undefined};
    function updateCoord() {

        car.autopilotMove();
        // both are independent of each other
        const constvalue = position.w/position.m_const - 25;
        //position.w -> car.x
        //canvas.w -> ?


        position.x = (car.x + car.w /2) - canvas.width / 2;
        position.y = ( car.y + car.h / 2 ) -  canvas.height / 2;

        // keep camera  in bound
        if (position.y < 0) {
            position.y = 0; }
        if (position.x < 0) {
                position.x = 0; }  

        if (position.y >= (position.h - position.h/position.m_const)) {
            position.y = position.h - position.h/position.m_const;
        } 
        if (position.x >= (position.w - position.w/position.m_const)) {
            position.x = position.w - position.w/position.m_const; 
        }

        carCoord.x = car.x - position.x; // car.x * canvas.width / position.w;
        carCoord.y = car.y - position.y; // car.y * canvas.height / position.h;


    }

    function render() {
        updateCoord();
        canvasCtx.drawImage(images[0], position.x, position.y, 
            position.w/position.m_const, position.h/position.m_const, 
            0, 0, canvas.width, canvas.height);

        if (zoomFactorInt === 1)  {mapCanvasCtx.drawImage(images[0], position.x, position.y, 
            position.w/position.m_const, position.h/position.m_const, 
            0, 0, 200, 200);
        }
        else {
            mapCanvasCtx.drawImage(images[0], 
                0, 0, 200, 200);  
        }
        car.draw(canvasCtx, carCoord);
        window.requestAnimationFrame(render);
    }
    window.requestAnimationFrame(render);
}

main();