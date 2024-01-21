class WWCore {

    static pressedKeys = [];

    static calculateGravity = (sceneObject) => {
        let triggers = sceneObject.triggers.filter(trigger => trigger.settings.hasCollision);
        if (!triggers.length) {
            sceneObject.position.y += WW.settings.gravity * 0.1;
            sceneObject.isGrounded = false;
        }
        else if(!triggers.some(trigger => sceneObject.position.y + sceneObject.size.y < trigger.position.y + trigger.size.y)) {
            sceneObject.position.y += WW.settings.gravity * 0.1;
            sceneObject.isGrounded = false;
        }
        else sceneObject.isGrounded = true;
    }

    static calculateCollision = (sceneObject) => {
        let triggers = sceneObject.triggers.filter(trigger => trigger.settings.hasCollision);
        if (!triggers.length) return;

        // let trigger = this.findClosestObject(sceneObject, triggers);
        //
        // let sceneObjectCenterX = sceneObject.position.x + sceneObject.size.x / 2;
        // let sceneObjectCenterY = sceneObject.position.y + sceneObject.size.y / 2;
        //
        // let objectCenterX = trigger.position.x + trigger.size.x / 2;
        // let objectCenterY = trigger.position.y + trigger.size.y / 2;
        //
        // let deltaX = sceneObjectCenterX - objectCenterX;
        // let deltaY = sceneObjectCenterY - objectCenterY;
        //
        // let combinedHalfWidths = (sceneObject.size.x + trigger.size.x) / 2;
        // let combinedHalfHeights = (sceneObject.size.y + trigger.size.y) / 2;
        //
        // let overlapX = combinedHalfWidths - Math.abs(deltaX);
        // let overlapY = combinedHalfHeights - Math.abs(deltaY);
        //
        // if (overlapX > 0 && overlapY > 0) {
        //     if (overlapX >= overlapY) {
        //         // Определение направления выталкивания по горизонтали
        //         let directionX = deltaX > 0 ? 1 : -1;
        //         // Новая позиция после выталкивания
        //         let newX = trigger.position.x + (combinedHalfWidths + sceneObject.size.x / 2) * directionX;
        //         sceneObject.position.x = newX;
        //     } else {
        //         // Определение направления выталкивания по вертикали
        //         let directionY = deltaY > 0 ? 1 : -1;
        //         // Новая позиция после выталкивания
        //         let newY = trigger.position.y + (combinedHalfHeights + sceneObject.size.y / 2) * directionY;
        //         sceneObject.position.y = newY;
        //     }
        // }
    }

    static calculateDistance(obj1, obj2) {
        let deltaX = obj1.position.x - obj2.position.x;
        let deltaY = obj1.position.y - obj2.position.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    static findClosestObject(player, objectsArray) {
        let closestObject;
        let closestDistance = Infinity;

        objectsArray.forEach(obj => {
            let distance = this.calculateDistance(player, obj);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestObject = obj;
            }
        });

        return closestObject;
    }

    static areCircleAndRectColliding = (circle, rect) => {
        const circleX = circle.position.x;
        const circleY = circle.position.y;
        const circleRadius = circle.settings.radius;

        const rectX = rect.position.x;
        const rectY = rect.position.y;
        const rectWidth = rect.size.x;
        const rectHeight = rect.size.y;

        let closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
        let closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));

        let distanceX = circleX - closestX;
        let distanceY = circleY - closestY;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        return distance <= circleRadius;
    }

    static areRectanglesCollide = (rect1, rect2) => {
        return (
            rect1.position.x < rect2.position.x + rect2.size.x &&
            rect1.position.x + rect1.size.x > rect2.position.x &&
            rect1.position.y < rect2.position.y + rect2.size.y &&
            rect1.position.y + rect1.size.y > rect2.position.y
        );
    }

    static areCirclesColliding(circle1, circle2) {
        const dx = circle1.position.x - circle2.position.x;
        const dy = circle1.position.y - circle2.position.y;
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
            sceneObject.position.x - sceneObject.scale.x / 2 - WW.cameraPosition.x,
            sceneObject.position.y - sceneObject.scale.y / 2 - WW.cameraPosition.y
        );
        if (!sceneObject.settings.isStatic) objectPos.minus(WW.cameraPosition);
        return objectPos;
    }

    static generateObjectSize = (sceneObject) => {
        switch (sceneObject.type) {
            case WW.T.RECTANGLE:
                return new Vector2(sceneObject.size.x + sceneObject.scale.x, sceneObject.size.y + sceneObject.scale.y);
            case WW.T.CIRCLE:
                return new Vector2(sceneObject.size.x, sceneObject.size.y);
        }
    }

    static generateShape = (sceneObject, type, objectPos, objectSize) => {
        switch (type) {
            case WW.T.RECTANGLE:
                objectSize = new Vector2(sceneObject.size.x + sceneObject.scale.x, sceneObject.size.y + sceneObject.scale.y);
                sceneObject.getLayer().ctx.rect(objectPos.x, objectPos.y, objectSize.x, objectSize.y);
                break;
            case WW.T.CIRCLE:
                objectSize = new Vector2(sceneObject.size.x, sceneObject.size.y);
                sceneObject.getLayer().ctx.arc(objectPos.x, objectPos.y, Math.abs(sceneObject.settings.radius), 0, 2 * Math.PI);
                break;
        }
    }

    static drawImage = (sceneObject, objectPos, objectSize) => {
        if (sceneObject.settings.spriteUrl) {
            sceneObject.getLayer().ctx.imageSmoothingEnabled = false;
            const image = new Image();
            image.src = sceneObject.settings.spriteUrl;
            sceneObject.settings.cropSize && sceneObject.settings.cropPos ?
                sceneObject.getLayer().ctx.drawImage(
                    image,
                    sceneObject.settings.cropPos.x,
                    sceneObject.settings.cropPos.y,
                    sceneObject.settings.cropSize.x,
                    sceneObject.settings.cropSize.x,
                    sceneObject.getLayer().settings.reversed ? -objectPos.x : objectPos.x, objectPos.y, sceneObject.getLayer().settings.reversed ? -objectSize.x : objectSize.x, objectSize.y
                ) :
                sceneObject.getLayer().ctx.drawImage(image,
                    objectPos.x,
                    objectPos.y,
                    objectSize.x,
                    objectSize.y)
        }
    }

    static startDrawing = (sceneObject) => {
        sceneObject.getLayer().ctx.beginPath();
        if (sceneObject.getLayer().settings.reversed) {
            sceneObject.getLayer().ctx.save();
            sceneObject.getLayer().ctx.scale(-1, 1);
        }
    }

    static stopDrawing = (sceneObject) => {
        if (sceneObject.getLayer().settings.reversed) sceneObject.getLayer().ctx.restore();
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