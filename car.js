class Car {
  constructor(x, y, whichCar) {
    this.x = x;
    this.y = y;
    this.w = 3 * 16;
    this.h = 24;
    this.speed = 1.8;
    this.whichCar = whichCar;
    this.angle = 0;
    this.points = [];
    this.whichPath = [0, 15, 3, 8,10, 9]; 
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

  drawRadar(ctx, camera) {
    const radarLength = 120;
    const radarAngle = 20; // Beam angle in degrees
    const numRadarBeams = 5;

    ctx.strokeStyle = '#00f000df';
    ctx.lineWidth = 0.5;

    for (let i = 0; i < numRadarBeams; i++) {
      const angleRad = 90 * Math.PI / 180 - Math.PI / 2 + (i - (numRadarBeams - 1) / 2) * (radarAngle * Math.PI / 180);
      const endX = 2 * this.w + radarLength * Math.cos(angleRad);
      const endY = this.h + radarLength * Math.sin(angleRad);

      ctx.beginPath();
      ctx.moveTo(this.w + this.w / 2, this.h);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }

  draw(canvasContext, camera) {

    // Save the current state of the canvas context
    canvasContext.save();

    canvasContext.translate(Math.round((this.x - camera.x)), Math.round((this.y - camera.y)));
    canvasContext.rotate(this.angle);
    canvasContext.drawImage(images[1], this.w * this.whichCar, 0, this.w, this.h, this.w / 2, this.h / 2,
      images[1].width / 2, images[1].height);

    if (this.whichCar == 0)
      this.drawRadar(canvasContext, camera);

    // Restore the canvas context to its original state
    canvasContext.restore();

  }

  setAutopilot(targetX, targetY) {
    this.autopilot = true;
    //this.autopilotTarget = { x: targetX, y: targetY };
    this.autopilotTarget = {
      x: PathLister[this.whichPath[0]].x + PathLister[this.whichPath[0]].w + 200,
      y: PathLister[this.whichPath[0]].y + PathLister[this.whichPath[0]].h / 2
    };


    for (var i = 0; i < 2; i++) {
         this.points.push({x: PathLister[this.whichPath[0]].x,y: 
          PathLister[this.whichPath[0]].y + PathLister[this.whichPath[0]].h/2});
    }


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
        this.x += Math.cos(angle) * this.speed;
        this.move(this.speed * Math.sin(angle));
        this.angle = angle;
        //console.log( PathLister[this.points[this.currentWaypointIndex]].angle * Math.PI / 180 - angle);

        for (const idx in obstacles) {
          const obstacle = obstacles[idx];
          // this is good shit
          if (
            (
            (this.x - this.w / 2) < (obstacle.x + obstacle.w) &&
            (this.x + 3 * this.w / 2) > obstacle.x &&
            (this.y - this.h / 2) < (obstacle.y + obstacle.h) &&
            (this.y + 3 * this.h / 2) > obstacle.y
            )
            || (
            (this.x -  3 * this.w / 2) < (obstacle.x + obstacle.w) &&
            (this.x + this.w / 2) > obstacle.x && 
            (this.y - 3 * this.h / 2) < (obstacle.y + obstacle.h) &&
            (this.y +  this.h / 2) > obstacle.y
            )
          ) {
            console.log("helo");
            // Collision detected, adjust movement
            this.x += this.speed * Math.cos(angle);
            this.y += this.speed * Math.sin(angle);
          }
        }


        for (const idx in global_obstacles) {
          const obstacle = global_obstacles[idx];
          if (
            (this.x - this.w / 2) < (obstacle[0] + obstacle[2]) &&
            (this.x + 3 * this.w / 2) > obstacle[0] &&
            (this.y - this.h / 2) < (obstacle[1] + obstacle[3]) &&
            (this.y + 3 * this.h / 2) > obstacle[1]
          ) {
            // Collision detected, adjust movement
            this.x -= this.speed * Math.cos(angle);
            this.y -= this.speed * Math.sin(angle);
          }
        }

        /*
        const compareval = { x: undefined, y: undefined};
        const rad = PathLister[this.points[this.currentWaypointIndex]].angle* Math.PI / 180;
        const constval = 5;
        if (Math.cos(rad) == 1 || Math.cos(rad) == -1) {
          compareval.x = PathLister[this.points[this.currentWaypointIndex]].x
          if (this.x < compareval.x)
          {
            this.x = PathLister[this.points[this.currentWaypointIndex]].x + constval;
          }
          compareval.x += PathLister[this.points[this.currentWaypointIndex]].w;
          if (this.x > compareval.x)
          {
            this.x = compareval.x - constval;


        } else {
          compareval.y = PathLister[this.points[this.currentWaypointIndex]].y;
          if (this.y < compareval.y)
          {
            this.y = compareval.y + constval;
          }
          compareval.y += PathLister[this.points[this.currentWaypointIndex]].h;
          if (this.y > compareval.y)
          {
            this.y = compareval.y - constval;
          }
        }
        /*
        console.log(PathLister[this.points[this.currentWaypointIndex]].x + PathLister[this.points[this.currentWaypointIndex]].w *
          (Math.cos(PathLister[this.points[this.currentWaypointIndex]].angle * Math.PI / 180) / 2) - this.w,
            PathLister[this.points[this.currentWaypointIndex]].y + PathLister[this.points[this.currentWaypointIndex]].h *
          (Math.sin(PathLister[this.points[this.currentWaypointIndex]].angle * Math.PI / 180) / 2) - this.h);
          */

          /*
        if ((this.x-this.w/2) < PathLister[this.points[this.currentWaypointIndex]].x)
          this.x = PathLister[this.points[this.currentWaypointIndex]].x + this.w/2;
        */
      } else if (this.currentWaypointIndex < this.points.length) {
        console.log("fuck");
        this.autopilotTarget = this.points[this.currentWaypointIndex++];
        /*
        const angle = PathLister[this.points[this.currentWaypointIndex]].angle;
        const rad = angle * Math.PI / 180;
        //console.log(Math.cos(rad),Math.sin(rad));

        console.log(angle, this.angle/Math.PI * 180);
        /*
        if (Math.cos(rad) == 1 || Math.cos(rad) == -1) {
          this.autopilotTarget.x = PathLister[this.points[this.currentWaypointIndex]].x+ PathLister[this.points[this.currentWaypointIndex]].w * Math.cos(rad);
          this.autopilotTarget.y = PathLister[this.points[this.currentWaypointIndex]].y + PathLister[this.points[this.currentWaypointIndex]].h/2;
        }
        else //else if (Math.sin(rad) == 1 || Math.sin(rad) == -1)
        {
          this.autopilotTarget.x = PathLister[this.points[this.currentWaypointIndex]].x + PathLister[this.points[this.currentWaypointIndex]].w/2;
          this.autopilotTarget.y = PathLister[this.points[this.currentWaypointIndex]].y + PathLister[this.points[this.currentWaypointIndex]].h* Math.sin(rad);
        }
          */

      } 
      else {
        this.disableAutopilot();
      }
    }
  }

}

