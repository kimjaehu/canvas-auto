import { Light } from "./light.js";
import { toHsv } from "./utils.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    this.pixels = [];

    this.isLoaded = false;
    this.imgPos = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    this.image = new Image();
    this.image.src = "2021_porsche_911_turbo.jpg";
    this.image.onload = () => {
      this.isLoaded = true;
      this.drawImage();
    };

    this.isDown = false;
    this.moveX = 0;
    this.moveY = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    document.addEventListener("pointerdown", this.onDown.bind(this), false);
    document.addEventListener("pointermove", this.onMove.bind(this), false);
    document.addEventListener("pointerup", this.onUp.bind(this), false);
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;

    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    if (this.isLoaded) {
      this.drawImage();
    }

    window.requestAnimationFrame(this.animate.bind(this));
  }

  drawImage() {
    this.pixels = [];

    const stageRatio = this.stageWidth / this.stageHeight;
    const imgRatio = this.image.width / this.image.height;

    this.imgPos.width = this.stageWidth;
    this.imgPos.height = this.stageHeight;

    if (imgRatio > stageRatio) {
      this.imgPos.width = Math.round(
        this.image.width * (this.stageHeight / this.image.height)
      );
      this.imgPos.x = Math.round((this.stageWidth - this.imgPos.width) / 2);
    } else {
      this.imgPos.height = Math.round(
        this.image.height * (this.stageWidth / this.image.width)
      );

      this.imgPos.y = Math.round((this.stageHeight - this.imgPos.height) / 2);
    }

    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,

      this.imgPos.x,
      this.imgPos.y,
      this.imgPos.width,
      this.imgPos.height
    );

    this.imgData = this.ctx.getImageData(
      0,
      0,
      this.stageWidth,
      this.stageHeight
    );

    this.data = this.imgData.data;
    for (let i = 0; i < this.data.length; i += 4) {
      if (
        this.data[i] - this.data[i + 1] > 50 &&
        this.data[i] - this.data[i + 2] > 50
      ) {
        let x = (i / 4) % this.stageWidth;
        let y = (i / 4 - x) / this.stageWidth;

        this.ctx.fillRect(x, y, 10, 10);

        this.pixels.push(
          new Light(x, y, this.data[i], this.data[i + 1], this.data[i + 2])
        );
        // this.data[i] = this.data[i];
        // this.data[i + 1] = this.data[i + 1];
        // this.data[i + 2] = this.data[i + 2];
      }

      const avg = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
      this.data[i] = avg; // red
      this.data[i + 1] = avg; // green
      this.data[i + 2] = avg; // blue
    }
    this.ctx.putImageData(this.imgData, 0, 0);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    for (let i = 0; i < this.pixels.length; i++) {
      const pixel = this.pixels[i];

      pixel.animate(this.ctx);
    }
  }

  onDown(e) {
    this.isDown = true;
    this.moveX = 0;
    this.moveY = 0;
    this.offsetX = e.clientX;
    this.offsetY = e.clientY;
  }

  onMove(e) {
    if (this.isDown) {
      this.moveX = e.clientX - this.offsetX;
      this.moveY = e.clientY - this.offsetY;
      this.offsetX = e.clientX;
      this.offsetY = e.clientY;
    }
  }

  onUp(e) {
    this.isDown = false;
  }
}

window.onload = () => {
  new App();
};
