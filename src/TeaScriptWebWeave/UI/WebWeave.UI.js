class WWUI {
  static createPadButton = (position, buttonStyle, rotation) => {
    let isButtonActive = false;
    const button = document.createElement("button");
    button.classList.add("padButton");
    button.style.rotate = `${rotation}deg`;
    button.style.left = `${position.x}px`;
    button.style.top = `${position.y}px`;
    button.style.width = `${buttonStyle.size.x}px`;
    button.style.height = `${buttonStyle.size.y}px`;
    button.addEventListener("touchstart", () => (isButtonActive = true));
    button.addEventListener("touchend", () => (isButtonActive = false));
    button.addEventListener("touchstart", () => (button.style.opacity = 0.5));
    button.addEventListener("touchend", () => (button.style.opacity = 1));
    button.style.backgroundColor = colorToString(buttonStyle.backgroundColor);
    if (buttonStyle.imagePath) {
      const image = document.createElement("img");
      image.src = buttonStyle.imagePath;
      button.appendChild(image);
    }
    document.body.appendChild(button);
    return isButtonActive;
  };
}

class buttonStyle {
  constructor(size, backgroundColor, imagePath) {
    this.size = size;
    this.backgroundColor = backgroundColor;
    this.imagePath = imagePath;
  }
}
