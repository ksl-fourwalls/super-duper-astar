class Car {
    constructor(x, y, whichCar) {
      this.x = x;
      this.y = y;
      this.w = 50;
      this.h = 50;
      this.speed = 0;
      this.whichCar = whichCar;
      this.angle = 0;
    }
  
    move(distance) {
      this.x += distance;
    }
  
    accelerate(acceleration) {
      this.speed += acceleration;
    }
  
    brake(deceleration) {
      this.speed -= deceleration;
      if (this.speed < 0) {
        this.speed = 0;
      }
    }
    turn(angle) {
        this.angle += angle;
    }

    draw(canvasContext, coord) {
       // canvasContext.fillStyle = this.color;

        // Save the current state of the canvas context
        canvasContext.save();
    
        // Translate and rotate the canvas context to position and rotate the car
        //canvasContext.translate(this.x, this.y);
       // canvasContext.rotate(this.angle);
    
       canvasContext.scale(0.7, 0.7);
       
        // Draw the car (assumed rectangular representation)
       // canvasContext.fillRect(-25, -15, 50, 30);
        canvasContext.drawImage(images[1], 0, 0, this.w, this.h, coord.x, coord.y, images[1].width, images[1].height);

        // Restore the canvas context to its original state
        canvasContext.restore();
      }
/*
      draw(canvasContext, cameraX) {
        canvasContext.drawImage(images[1], 0, 0, 50, 50, this.x, this.y, images[1].width, images[1].height);

      }
      */
   // draw(canvasContext) {
        /*
      canvasContext.fillStyle = this.color;
      canvasContext.fillRect(this.x, this.y, 50, 50); // Assuming a rectangular representation
    */
    //}
    setAutopilot(targetX, targetY) {
        this.autopilot = true;
        this.autopilotTarget = { x: targetX, y: targetY };
      }
    
      disableAutopilot() {
        this.autopilot = false;
        this.autopilotTarget = null;
      }
    
      autopilotMove() {
        if (this.autopilot) {
          const dx = this.autopilotTarget.x - this.x;
          const dy = this.autopilotTarget.y - this.y;
          const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
        
          if (distanceToTarget > 1) {
            const angle = Math.atan2(dy, dx);
            const speedX = Math.cos(angle);
            const speedY = Math.sin(angle);
            this.move(this.speed + speedX);
            this.y += this.speed + speedY;
                    // Adjust the angle to point towards the current waypoint
/*
            const targetAngle = Math.atan2(dy, dx);
            const angleDifference = targetAngle - this.angle;
    
            // Gradually turn the car towards the target angle
            const maxTurnAngle = 0.05;
            const turnAmount = Math.min(Math.abs(angleDifference), maxTurnAngle);
            if (angleDifference < 0) {
              this.turn(turnAmount);
            } else {
              this.turn(-turnAmount);
            }
            */
          } else {
            this.disableAutopilot();
          }
        }
      }
    
  }
  