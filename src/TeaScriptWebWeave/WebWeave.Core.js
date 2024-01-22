class WWCore {

    static pressedKeys = [];

    static calculateGravity = (sceneObject) => {
        let triggers = sceneObject.triggers.filter(trigger => trigger.settings.hasCollision);
        if (!triggers.length) {
            sceneObject.position.y += WW.settings.gravity * (sceneObject.settings.mass / 100);
            sceneObject.isGrounded = false;
        } else if (!triggers.some(trigger => sceneObject.position.y + sceneObject.size.y < trigger.position.y + trigger.size.y)) {
            sceneObject.position.y += WW.settings.gravity * (sceneObject.settings.mass / 100);
            sceneObject.isGrounded = false;
        } else sceneObject.isGrounded = true;
    }

    static calculateCollision = (sceneObject) => sceneObject.triggers.filter(trigger => trigger.settings.hasCollision).forEach(trigger => {
        console.log(trigger)
        // const dx = (sceneObject.position.x + sceneObject.size.x / 2) - (trigger.position.x + trigger.size.x / 2);
        // const width = (sceneObject.size.x + trigger.size.x) / 2;
        // if (Math.abs(dx) <= width && (sceneObject.position.x > trigger.position.x + trigger.size.x || sceneObject.position.x + sceneObject.size.x < trigger.position.x)d) {
        //     if (sceneObject.position.x > trigger.position.x - 50) {
        //         console.log("left")
        //         // Collision on the right side of the player
        //         sceneObject.position.x = trigger.position.x - (sceneObject.size.x * 0);
        //     } else {
        //         // Collision on the left side of the player
        //         sceneObject.position.x = trigger.position.x - sceneObject.size.x;
        //     }
        // }
    });

    static areCircleAndRectColliding = (circle, rect) => {
        const circlePos = this.generateObjectPosition(circle);
        const circleRadius = circle.settings.radius;

        const rectPos = this.generateObjectPosition(rect);
        const rectSize = this.generateObjectSize(rect);

        let closestX = Math.max(rectPos.x, Math.min(circlePos.x, rectPos.x + rectSize.x));
        let closestY = Math.max(rectPos.y, Math.min(circlePos.y, rectPos.y + rectSize.y));

        let distanceX = circlePos.x - closestX;
        let distanceY = circlePos.y - closestY;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        return distance <= circleRadius;
    }

    static areRectanglesCollide = (rect1, rect2) => {
        let rect1Pos = this.generateObjectPosition(rect1);
        let rect1Size = this.generateObjectSize(rect1);
        let rect2Pos = this.generateObjectPosition(rect2);
        let rect2Size = this.generateObjectSize(rect2);
        return (
            rect1Pos.x < rect2Pos.x + rect2Size.x &&
            rect1Pos.x + rect1Size.x > rect2Pos.x &&
            rect1Pos.y < rect2Pos.y + rect2Size.y &&
            rect1Pos.y + rect1Size.y > rect2Pos.y
        );
    }

    static areCirclesColliding(circle1, circle2) {
        const circle1Pos = this.generateObjectPosition(circle1);
        const circle2Pos = this.generateObjectPosition(circle2);
        const dx = circle1Pos.x - circle2Pos.x;
        const dy = circle1Pos.y - circle2Pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance <= circle1.settings.radius + circle2.settings.radius;
    }

    static getScreenCenter = (layer) => new Vector2(layer.canvas.width / 2, layer.canvas.height / 2);

    static setupKeyboard = () => {
        window.addEventListener("keydown", e => {
            if (!this.pressedKeys.some(key => key === e.code)) this.pressedKeys.push(e.code);
        });
        window.addEventListener("keyup", e => this.pressedKeys = this.pressedKeys.filter(key => key !== e.code));
    }

    static generateObjectPosition = (sceneObject) => {
        let objectPos = new Vector2(
            sceneObject.position.x - sceneObject.scale.x / 2 - WW.camera.cameraPosition.x + WW.camera.initialPosition.x,
            sceneObject.position.y - sceneObject.scale.y / 2 - WW.camera.cameraPosition.y + WW.camera.initialPosition.y
        );
        if (!sceneObject.settings.isStatic) {
            objectPos.minus(WW.camera.cameraPosition);
            objectPos.plus(WW.camera.initialPosition)
        }
        return objectPos;
    }

    static generateObjectSize = (sceneObject) => {
        let objectSize;
        switch (sceneObject.type) {
            case WW.T.RECTANGLE:
                objectSize = new Vector2(sceneObject.size.x + sceneObject.scale.x, sceneObject.size.y + sceneObject.scale.y);
                break;
            case WW.T.CIRCLE:
                objectSize = new Vector2(sceneObject.size.x, sceneObject.size.y);
                break;
        }
        return objectSize;
    }

    static generateShape = (sceneObject, type, objectPos, objectSize) => {
        switch (type) {
            case WW.T.RECTANGLE:
                sceneObject.getLayer().ctx.rect(objectPos.x, objectPos.y, objectSize.x, objectSize.y);
                break;
            case WW.T.CIRCLE:
                sceneObject.getLayer().ctx.arc(objectPos.x, objectPos.y, Math.abs(sceneObject.settings.radius), 0, 2 * Math.PI);
                break;
        }
    }

    static drawImage = (sceneObject, objectPos, objectSize) => {
        sceneObject.getLayer().ctx.save();
        if (sceneObject.getLayer().settings.reversed) sceneObject.getLayer().ctx.scale(-1, 1);

        if (sceneObject.settings.spriteUrl) {
            sceneObject.getLayer().ctx.imageSmoothingEnabled = false;
            const image = new Image();
            image.src = sceneObject.settings.spriteUrl;
            let imagePos = new Vector2(objectPos.x + sceneObject.settings.imagePosOffset.x, objectPos.y + sceneObject.settings.imagePosOffset.y);
            let imageSize = new Vector2(objectSize.x + sceneObject.settings.imageSizeOffset.x, objectSize.y + sceneObject.settings.imageSizeOffset.y);
            sceneObject.settings.cropSize && sceneObject.settings.cropPos ?
                sceneObject.getLayer().ctx.drawImage(
                    image,
                    sceneObject.settings.cropPos.x,
                    sceneObject.settings.cropPos.y,
                    sceneObject.settings.cropSize.x,
                    sceneObject.settings.cropSize.x,
                    sceneObject.getLayer().settings.reversed ? -imagePos.x : imagePos.x, imagePos.y, sceneObject.getLayer().settings.reversed ? -imageSize.x : imageSize.x, imageSize.y
                ) :
                sceneObject.getLayer().ctx.drawImage(image,
                    imagePos.x,
                    imagePos.y,
                    imageSize.x,
                    imageSize.y)
        }
        sceneObject.getLayer().ctx.restore();
    }

    static startDrawing = (sceneObject) => {
        sceneObject.getLayer().ctx.beginPath();
    }

    static stopDrawing = (sceneObject) => {
        sceneObject.getLayer().ctx.fill();
        sceneObject.getLayer().ctx.closePath();
    }

    static playAnimation = (animObj) => {
        const [sceneObject, anim] = animObj;
        let finished = true;
        for (let fromProp of Object.entries(anim.from)) {
            let propertyValue = getNestedProp(sceneObject, fromProp[0]);
            let toPropValue = animObj[1].to[fromProp[0]];
            let propertyStep = (toPropValue - fromProp[1]) / anim.duration;
            if ((propertyStep >= 0 && propertyValue >= toPropValue) || (propertyStep < 0 && propertyValue <= toPropValue)) continue;
            finished = false;
            setNestedProp(sceneObject, fromProp[0], propertyValue + propertyStep);
        }
        if (finished) {
            WW.currentAnimations = WW.currentAnimations.filter(animation => animation !== animObj);
            sceneObject.onAnimationEnd.forEach(listener => listener(animObj));
        }
    }

    static playSpriteAnimation = (animObj) => {
        const [sceneObject, anim] = animObj;
        if (anim.progress % (anim.duration / anim.spriteFramesCount) === 0 && sceneObject.settings.cropPos.x < anim.cropPosStep.x * anim.spriteFramesCount) {
            sceneObject.settings.cropPos.y = anim.yCropOffset;
            sceneObject.settings.cropPos.plus(anim.cropPosStep);
        }
        anim.progress++;
        if (anim.progress >= anim.duration) {
            WW.currentAnimations = WW.currentAnimations.filter(anim => anim !== animObj);
            sceneObject.settings.cropPos.set(anim.initialCropPos);
            sceneObject.onAnimationEnd.forEach(listener => listener());
        }
    }

    static fillColor = (sceneObject, objectPos) => {
        if (typeof sceneObject.color === "function") sceneObject.getLayer().ctx.fillStyle = sceneObject.color(objectPos);
        else if (typeof sceneObject.color === "string") sceneObject.getLayer().ctx.fillStyle = sceneObject.color;
        else sceneObject.getLayer().ctx.fillStyle = colorToString(sceneObject.color);
    }

    static clearLayers = () => Object.values(WW.layers).forEach(layer => {
        layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        layer.ctx.fillStyle = layer.settings.background;
        layer.ctx.fillRect(0, 0, layer.canvas.width, layer.canvas.height);
    });
}