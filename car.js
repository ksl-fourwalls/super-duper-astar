class Car {
    constructor(x, y, whichCar) {
      this.x = x;
      this.y = y;
      this.w = 3 * 16;
      this.h = 24;
      this.speed = 0.8;
      this.whichCar = whichCar;
      this.angle = 0;
      this.points = [1, 15, 2];
      this.currentWaypointIndex = 0;
    }
  
    getNextWaypoint() {
      return this.points[this.currentWaypointIndex];
  }
    move(distance) {
      this.y += distance;
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

    /*
    drawRelative(canvasContext, coords) {
      canvasContext.save();
      canvasContext.scale(0.7, 0.7);
      // 960px -> 1
      // ? -> 3
      canvasContext.drawImage(images[1], this.w * this.whichCar, 0, this.w, this.h, 
        coords.x , coords.y, 
        images[1].width, images[1].height);
        canvasContext.restore();

    }
    */

    drawRelative(canvasContext, camera) {
      // canvasContext.fillStyle = this.color;

       // Save the current state of the canvas context
       canvasContext.save();
   
      //canvasContext.scale(0.5, 0.5);
     // canvasContext.scale(0.3 * camera.w / canvas.width, 0.3 * camera.h / canvas.height);

      
       // Draw the car (assumed rectangular representation)
      // canvasContext.fillRect(-25, -15, 50, 30);
       canvasContext.drawImage(images[1], this.w, 0, images[1].width/2, images[1].height, 
         Math.round(this.x - camera.x), Math.round(this.y - camera.y), 
         images[1].width/2, images[1].height);

       // Restore the canvas context to its original state
       canvasContext.restore();
     }


    draw(canvasContext, camera) {
       // canvasContext.fillStyle = this.color;

        // Save the current state of the canvas context
        canvasContext.save();
    
        // Translate and rotate the canvas context to position and rotate the car
       // if (this.whichCar)
       //canvasContext.translate(camera.x, camera.y);

       // canvasContext.rotate(this.angle);
    
       //canvasContext.scale(0.3 * camera.w / canvas.width, 0.3 * camera.h / canvas.height);
       
        // Draw the car (assumed rectangular representation)
       // canvasContext.fillRect(-25, -15, 50, 30);
        canvasContext.drawImage(images[1], this.w * this.whichCar, 0, this.w, this.h, 
          Math.round((this.x - camera.x)), 
          Math.round((this.y - camera.y)), 
          images[1].width/2, images[1].height);

        // Restore the canvas context to its original state
        canvasContext.restore();
      }

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

            this.x += Math.cos(angle) * this.speed;
            this.move(this.speed * Math.sin(angle));
                    // Adjust the angle to point towards the current waypoint
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
          } else {
            this.disableAutopilot();
          }
        }
      }
    
  }
  