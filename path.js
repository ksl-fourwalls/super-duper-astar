class Path {
    constructor (x, y, w, h, angle, weight=1) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.angle = angle;
        this.weight = weight;
    }
}
class Obstacle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    draw () {}
}
