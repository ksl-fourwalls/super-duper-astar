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
    let car = new Car(0, 175, "red");

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
    car.setAutopilot(500, 175);

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

    function update() {

        car.autopilotMove();
        position.x = car.x;
        position.y = car.y;

    }

    function render() {
        update();
        canvasCtx.drawImage(images[0], position.x, position.y, 
            position.w/position.m_const, position.h/position.m_const, 
            0, 0, canvas.height, canvas.height);

        if (zoomFactorInt === 1)  {mapCanvasCtx.drawImage(images[0], position.x, position.y, 
            position.w/position.m_const, position.h/position.m_const, 
            0, 0, 200, 200);
        }
        else {
            mapCanvasCtx.drawImage(images[0], 
                0, 0, 200, 200);  
        }
        car.draw(canvasCtx, position);
        window.requestAnimationFrame(render);
    }
    window.requestAnimationFrame(render);
}

main();