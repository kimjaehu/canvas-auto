export class Light {
  constructor(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 0;
    this.speed = 0.075;
  }

  animate(ctx, isDown) {
    // this.a += this.speed;
    // (this.a > 1 || this.a < 0) && (this.speed = -this.speed);

    if (isDown) {
      this.a += this.speed;
      this.a > 1 && (this.a = 1);
    } else {
      this.a -= this.speed;
      this.a < 0 && (this.a = 0);
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${this.a})`;
    ctx.arc(this.x, this.y, 0.5, 0, Math.PI * 2, false);
    ctx.fill();
  }
}
