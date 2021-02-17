import { Light } from "./light.js";

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
    // 2021 Porsche 911 Turbo S
    this.image.src = "2021_porsche_911_turbo.jpg";
    this.image.onload = () => {
      this.isLoaded = true;
      this.drawImage();
    };

    this.contrastPercent = 15;
    this.contrast = this.contrastPercent / 100 + 1;
    this.intercept = 128 * (1 - this.contrast);
    this.isDown = false;
    this.moveX = 0;
    this.moveY = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    document.addEventListener("pointerdown", this.onDown.bind(this), false);
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
        this.data[i] - this.data[i + 1] > 25 &&
        this.data[i] - this.data[i + 2] > 25
      ) {
        // get x, y coordinates
        let x = (i / 4) % this.stageWidth;
        let y = (i / 4 - x) / this.stageWidth;

        this.pixels.push(
          new Light(x, y, this.data[i], this.data[i + 1], this.data[i + 2])
        );
        this.data[i] = this.data[i] * this.contrast + this.intercept;
        this.data[i + 1] = this.data[i + 1];
        this.data[i + 2] = this.data[i + 2];
      }

      this.data[i] = this.data[i] * this.contrast + this.intercept;
      this.data[i + 1] = this.data[i + 1] * this.contrast + this.intercept;
      this.data[i + 2] = this.data[i + 2] * this.contrast + this.intercept;
      const avg = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
      this.data[i] = avg; // red
      this.data[i + 1] = avg; // green
      this.data[i + 2] = avg; // blue
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    if (this.isLoaded) {
      this.ctx.putImageData(this.imgData, 0, 0);
    }
    for (let i = 0; i < this.pixels.length; i++) {
      const pixel = this.pixels[i];
      pixel.animate(this.ctx, this.isDown);
    }
  }

  onDown(e) {
    this.isDown = true;
    this.moveX = 0;
    this.moveY = 0;
    this.offsetX = e.clientX;
    this.offsetY = e.clientY;
  }

  onUp(e) {
    this.isDown = false;
  }
}

window.onload = () => {
  new App();
};
