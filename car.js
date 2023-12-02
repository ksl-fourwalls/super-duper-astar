class Car {
    constructor(x, y, whichCar) {
      this.x = x;
      this.y = y;
      this.w = 3 * 16;
      this.h = 24;
      this.speed = 0.8;
      this.whichCar = whichCar;
      this.angle = 0;
      this.points = [0, 15, 2];
      this.currentWaypointIndex = 0;
    }
  
    getNextWaypoint() {
      return this.points[this.currentWaypointIndex++];
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

    draw(canvasContext, camera) {
       // canvasContext.fillStyle = this.color;

        // Save the current state of the canvas context
        canvasContext.save();

	canvasContext.translate(Math.round((this.x-camera.x)), Math.round((this.y-camera.y)));
        canvasContext.rotate(this.angle);
        canvasContext.drawImage(images[1], 
		this.w * this.whichCar, 0, 
		this.w, this.h, this.w/2, this.h/2, 
	images[1].width/2, images[1].height);

        // Restore the canvas context to its original state
        canvasContext.restore();
      }

      setAutopilot(targetX, targetY) {
        this.autopilot = true;
        //this.autopilotTarget = { x: targetX, y: targetY };
	this.autopilotTarget = {
		x: PathLister[this.points[0]].x+PathLister[this.points[0]].w,
		y: PathLister[this.points[0]].y+PathLister[this.points[0]].h/2
	};
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

	  // Adjust the angle to point towards the current waypoint
	  //const targetAngle = Math.atan2(dy, dx);
	  this.x += Math.cos(angle) *  this.speed;
	  this.move(this.speed  * Math.sin(angle) );
	  this.angle = angle;

	  for (const idx in obstacles)
	  {
	  const obstacle = obstacles[idx];
	  if (
              (this.x - this.w / 2) < (obstacle.x + obstacle.w) &&
              (this.x + this.w / 2) > obstacle.x &&
              (this.y - this.h / 2) < (obstacle.y + obstacle.h) &&
              (this.y + this.h / 2) > obstacle.y
          ) {
                    // Collision detected, adjust movement
              this.x -= this.speed * Math.cos(angle) +1;
              this.y += this.speed * Math.sin(angle)+1;
          }
	  }

          } else if (++this.currentWaypointIndex < this.points.length) {
		  this.autopilotTarget.x = PathLister[this.points[this.currentWaypointIndex]].x+PathLister[this.points[this.currentWaypointIndex]].w *
			  (1-Math.cos(PathLister[this.points[this.currentWaypointIndex]].angle*Math.PI/180)/2)-this.w;
		  this.autopilotTarget.y = PathLister[this.points[this.currentWaypointIndex]].y+PathLister[this.points[this.currentWaypointIndex]].h *
			  (1-Math.sin(PathLister[this.points[this.currentWaypointIndex]].angle*Math.PI/180)/2)-this.h;

	} else {
            this.disableAutopilot();
          }
        }
      }
    
  }
  
