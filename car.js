class Car {
  constructor(x, y, whichCar, angle=0) {
    this.x = x;
    this.y = y;
    this.w = 3 * 16;
    this.h = 24;
    this.speed = 1.5;
    this.whichCar = whichCar;
    this.angle = angle * Math.PI/180;
    this.points = [];
    this.pointsidx = 0;
    this.currentWaypointIndex = 0;
    this.optimizedPath;
    this.MulFactor = {x: 0, y: 0};
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
      ctx.moveTo(this.w , this.h/2);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }

  draw(canvasContext, camera) {

    // Save the current state of the canvas context
    canvasContext.save();

    canvasContext.translate(Math.round((this.x - camera.x)), Math.round((this.y - camera.y)));
    canvasContext.rotate(this.angle);
    canvasContext.drawImage(images[1], this.w * this.whichCar, 0, this.w, this.h, 0, 0,
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

  obstacles.forEach(element => {
    for (let i = 0; i < PathLister.length; i++) {
      if (element.x > PathLister[i].x && element.y > PathLister[i].y &&
        (element.x+element.w) < (PathLister[i].x+PathLister[i].w) && 
        (element.y+element.h) < (PathLister[i].y+PathLister[i].h)) {
          PathLister[i].weight += 5;
        }
    }
  });

  let minweightidx = undefined, minweight = Infinity;
  // select min weight
  for (let i = 0; i < paths.length; i++) {
    let weight = 0
    for(let j = 0; j < paths[i].length; j++) {
      weight += PathLister[paths[i][j]].weight;
    }
    if (weight < minweight)
    {
      minweight = weight;
      minweightidx = i;
    }
  }

  this.optimizedPath = paths[minweightidx];
  this.currentWaypointIndex = 1;
  this.getNextPath();
  this.autopilotTarget = {x: this.points[0].x,y: this.points[0].y};
  this.x = PathLister[src].x + PathLister[src].w / 2 - this.w/2;
  this.y = PathLister[src].y + PathLister[src].h / 2 - this.h/2;
    //this.points.push(point);
    /*
  let trackside = Math.sin(PathLister[this.optimizedPath[this.currentWaypointIndex]].angle * Math.PI / 180);
  if (trackside == 0) {
    this.MulFactor = { x: 0, y: -1}
  } else {
    this.MulFactor = { x: -1, y: -1}
  }
  */
  this.getCollisionFactor(0);
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
          if ((
            (this.x ) < (obstacle.x + obstacle.w) &&
            (this.x +  this.w) > obstacle.x &&
            (this.y) < (obstacle.y + obstacle.h) &&
            (this.y +  this.h ) > obstacle.y
            ) ) {
            // Collision detected, adjust movement
            this.x -= this.speed * Math.cos(angle)+ 3 * this.MulFactor.x;
            this.y -= this.speed * Math.sin(angle) + 3 * this.MulFactor.y;
          }         
        }

        /*
        let trackside = Math.sin(PathLister[this.optimizedPath[this.currentWaypointIndex]].angle * Math.PI / 180);
        if ( trackside == 0 )
        {
          if (this.x < PathLister[this.optimizedPath[this.currentWaypointIndex]].x) 
          {
            this.x += this.speed * Math.cos(angle) +1
          }
          else if (this.x > (PathLister[this.optimizedPath[this.currentWaypointIndex]].x + PathLister[this.optimizedPath[this.currentWaypointIndex]].w))
            this.x -= this.speed * Math.cos(angle)-1 //(PathLister[this.optimizedPath[this.currentWaypointIndex]].x + PathLister[this.optimizedPath[this.currentWaypointIndex]].w);
        } else {

        }
        */


        for (const idx in global_obstacles) {
          const obstacle = {
            x: global_obstacles[idx][0], 
            y: global_obstacles[idx][1],
            w: global_obstacles[idx][2],
            h: global_obstacles[idx][3]
          };
          /*

          if (
            /*
            (this.x -  this.w / 2) < (obstacle.x + obstacle.w) &&
            (this.x + 3 * this.w / 2) > obstacle.x &&
            (this.y - this.h / 2) < (obstacle.y + obstacle.h) &&
            (this.y + 3 * this.h / 2) > obstacle.y
           checkCollision(this, obstacle) === true
            ) {

            // Collision detected, adjust movement
            this.x -= this.speed * Math.cos(angle)+ 1 * this.MulFactor.x;
            this.y -= this.speed * Math.sin(angle)+ 1 * this.MulFactor.y;
          }
            */
        } 

      } else if (this.pointsidx < this.points.length) {
        this.autopilotTarget = this.points[this.pointsidx++];
        //this.pointsidx++;
      } else if (++this.currentWaypointIndex < this.optimizedPath.length) {
        this.getNextPath();

      this.getCollisionFactor(this.currentWaypointIndex);
      if (this.currentWaypointIndex == this.optimizedPath.length-1)
        this.points.push({x: PathLister[this.optimizedPath[this.optimizedPath.length-1]].x+PathLister[this.optimizedPath[this.optimizedPath.length-1]].w/2 ,y:PathLister[this.optimizedPath[this.optimizedPath.length-1]].y+PathLister[this.optimizedPath[this.optimizedPath.length-1]].h/2+this.h})
      } 
        else {
          this.disableAutopilot();
        }

    }
  }
  getNextPath(){
        for (let j = 0; j < Graph.length; j++)
        {
          if ((this.optimizedPath[this.currentWaypointIndex-1] === Graph[j][0]) && (this.optimizedPath[this.currentWaypointIndex] === Graph[j][1]))
          {
            for (let k = 0; k < Graph[j][2].length; k++)
            {
              let point = {x: Graph[j][2][k][0], y: Graph[j][2][k][1]};
              this.points.push(point);
            }
          }
          else if ((this.optimizedPath[this.currentWaypointIndex-1] === Graph[j][1]) && (this.optimizedPath[this.currentWaypointIndex] === Graph[j][0]))
          {
            for (let k = Graph[j][2].length-1; k >= 0; k--)
            {
              let point = {x: Graph[j][2][k][0], y: Graph[j][2][k][1]};
              this.points.push(point);
            }
          }
        }

      }

      getCollisionFactor(ipath) {
        let trackside = Math.sin(PathLister[this.optimizedPath[ipath]].angle * Math.PI / 180);
        if ( trackside == 0 )
        {
          this.MulFactor.x = 0;
          if (this.y < PathLister[this.optimizedPath[ipath]].y) 
            this.MulFactor.y = +1;
          else if (this.y > (PathLister[this.optimizedPath[ipath]].y + PathLister[this.optimizedPath[ipath]].h))
            //this.x -= this.speed * Math.cos(angle)-1 //(PathLister[this.optimizedPath[this.currentWaypointIndex]].x + PathLister[this.optimizedPath[this.currentWaypointIndex]].w);
            this.MulFactor.y = -1;
          else {
            this.MulFactor.y = +1;
          }
        } else {
          this.MulFactor.y = 0;
          if (this.x < PathLister[this.optimizedPath[ipath]].x) 
            this.MulFactor.x = -1;
          else if (this.x > (PathLister[this.optimizedPath[ipath]].x + PathLister[this.optimizedPath[ipath]].w))
            this.MulFactor.x = +1;//this.x -= this.speed * Math.cos(angle)-1 //(PathLister[this.optimizedPath[this.currentWaypointIndex]].x + PathLister[this.optimizedPath[this.currentWaypointIndex]].w);
          else {
            this.MulFactor.x = Math.random() % 2 == 0 ? -1 : 1;
          }
        }

      }


    }