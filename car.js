class Car {
  constructor(x, y, whichCar, angle=0) {
    this.x = x;
    this.y = y;
    this.w = 3 * 16;
    this.h = 24;
    this.speed = 1.8;
    this.whichCar = whichCar;
    this.angle = angle * Math.PI/180;
    this.points = [];
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

  setAutopilot(src, dst) {
    this.autopilot = true;

let paths = [];
// Utility function for printing
// the found path in graph
function printpath(path) {
	let size = path.length;
  /*
	for (let i = 0; i < size; i++) {
		document.write(path[i]);
    document.write(",");
	}*/
  paths.push(path);
}

// Utility function to check if current
// vertex is already present in path
function isNotVisited(x, path) {
	let size = path.length;
	for (let i = 0; i < size; i++) {
		if (path[i] === x) {
			return 0;
		}
	}
	return 1;
}

// Utility function for finding paths in graph
// from source to destination
function findpaths(g, src, dst, v) {
	// Create a queue which stores
	// the paths
	let q = [];

	// Path array to store the current path
	let path = [];
	path.push(src);
	q.push(path.slice());
	
	while (q.length) {
		path = q.shift();
		let last = path[path.length - 1];

		// If last vertex is the desired destination
		// then print the path
		if (last === dst) {
			printpath(path);
		}

		// Traverse to all the nodes connected to
		// current vertex and push new path to queue
		for (let i = 0; i < g[last].length; i++) {
			if (isNotVisited(g[last][i], path)) {
				let newpath = path.slice();
				newpath.push(g[last][i]);
				q.push(newpath);
			}
		}
	}
}

// Driver code

	// Number of vertices
	let v = Graph.length;
	let g = Array.from({ length: v }, () => []);

	// Construct a graph

  for (let i = 0; i < Graph.length; i++) {
    g[Graph[i][0]].push(Graph[i][1]);
    g[Graph[i][1]].push(Graph[i][0]);
  }


	// Function for finding the paths
	findpaths(g, src, dst, v);

  for (let i = 1; i < paths[0].length; i++)
  {
    for (let j = 0; j < Graph.length; j++)
    {
      if ((paths[0][i-1] === Graph[j][0]) && (paths[0][i] === Graph[j][1]))
      {
        for (let k = 0; k < Graph[j][2].length; k++)
        {
          let point = {x: Graph[j][2][k][0], y: Graph[j][2][k][1]};
          this.points.push(point);
        }
      }
      else if ((paths[0][i-1] === Graph[j][1]) && (paths[0][i] === Graph[j][0]))
      {
        for (let k = Graph[j][2].length-1; k >= 0; k--)
        {
          let point = {x: Graph[j][2][k][0], y: Graph[j][2][k][1]};
          this.points.push(point);
        }
      }
    }
  }
  console.log(paths[0]);
  console.log(this.points);

   this.autopilotTarget = {x: this.points[0].x,y: this.points[0].y};
    //this.points.push(point);
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
            (this.x +  this.w / 2) > obstacle.x &&
            (this.y - this.h / 2) < (obstacle.y + obstacle.h) &&
            (this.y +  this.h / 2) > obstacle.y
            ) || (
            (this.x -   this.w / 2) < (obstacle.x + obstacle.w) &&
            (this.x + this.w / 2) > obstacle.x && 
            (this.y -  this.h / 2) < (obstacle.y + obstacle.h) &&
            (this.y +  this.h / 2) > obstacle.y
            )
          ) {
            // Collision detected, adjust movement
            this.x += this.speed * Math.cos(angle)-2.5;
            this.y += this.speed * Math.sin(angle)-2.5;
          }         
        }


        for (const idx in global_obstacles) {
          const obstacle = {
            x: global_obstacles[idx][0], 
            y: global_obstacles[idx][1],
            w: global_obstacles[idx][2],
            h: global_obstacles[idx][3]
          };

          /*
          if (
            (this.x -  this.w / 2) < (obstacle.x + obstacle.w) &&
            (this.x + this.w / 2) > obstacle.x &&
            (this.y - this.h / 2) < (obstacle.y + obstacle.h) &&
            (this.y + this.h / 2) > obstacle.y
            ) {
              console.log("fuckyou");

            // Collision detected, adjust movement
            this.x -= this.speed * Math.cos(angle);
            this.y -= this.speed * Math.sin(angle);
          }*/
        } 
       } else if (++this.currentWaypointIndex < this.points.length) {
        this.autopilotTarget = this.points[this.currentWaypointIndex];
        console.log("hello");
      } 
      else {
        console.log("stop");
        this.disableAutopilot();
      }
    }
  }

}

