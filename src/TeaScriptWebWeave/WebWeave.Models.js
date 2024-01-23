class SceneObject {
    constructor(position, size = new Vector2(0, 0), color = Color.TRANSPARENT, id, scale = new Vector2(1, 1), settings = {}, type, layer) {
        this.size = size;
        this.color = color;
        this.type = type;
        this.id = id;
        this.settings = settings;
        this.scale = scale;
        this.getLayer = () => WW.layers[layer];
        if (this.settings.isCollider) this.triggers = [];
        if (!this.settings.imagePosOffset) this.settings.imagePosOffset = new Vector2(0, 0);
        if (!this.settings.imageSizeOffset) this.settings.imageSizeOffset = new Vector2(0, 0);
        this.position = position || WWCore.getScreenCenter(this.getLayer());
    }

    playAnimation = (anim) => {
        let animation = Object.assign({}, anim);
        animation.progress = 0;
        animation.type = WW.AnimT.PROP_ANIM;
        WW.currentAnimations.push([this, animation]);
    }

    playSpriteAnimation = (anim) => {
        let animation = Object.assign({}, anim);
        animation.progress = 0;
        animation.type = WW.AnimT.SPRITE_ANIM;
        WW.currentAnimations.push([this, animation]);
    }

    stopAnimation = (animName) => {
        WW.currentAnimations = WW.currentAnimations.filter(animation => {
            if (animation[1].name === animName) {
                if (animation[1].type === WW.AnimT.SPRITE_ANIM) this.settings.cropPos.set(animation[1].initialCropPos);
                return false;
            }
            return true;
        });
    }

    isPlaying = (animName) => WW.currentAnimations.filter(anim => anim[0] === this).some(anim => anim[1].name === animName);

    onAnimationEnd = []

    onStartCollide = []

    onStopCollide = []

    whileCollide = []

    destroy = () => WW.sceneObjects = WW.sceneObjects.filter(obj => obj.id !== this.id);
}

class Layer {
    constructor(name, index) {
        const canvas = document.createElement("canvas");
        canvas.style.zIndex = index;
        document.body.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.settings = {
            background: "transparent",
        };
        this.name = name;
    }
}

class ResponsiveVector2 {

    static T = {
        DEFAULT: "default",
        VALUES_FROM_END: "values_from_end",
        Y_FROM_END: "y_from_end",
        X_FROM_END: "x_from_end"
    }

    static Mode = {
        PERCENT: "percent",
        DEFAULT: "default"
    }

    constructor(responsiveX, responsiveY, type = ResponsiveVector2.T.DEFAULT, mode = ResponsiveVector2.Mode.DEFAULT) {
        this.mode = mode;
        this.type = type;
        this.responsiveX = responsiveX;
        this.responsiveY = responsiveY;
        this.x = this.#calculateVector().x;
        this.y = this.#calculateVector().y;
    }

    #calculateVector = () => {
        const screenWidth = WW.layers["background"].canvas.width;
        const screenHeight = WW.layers["background"].canvas.height;
        const x = this.mode === ResponsiveVector2.Mode.DEFAULT ? this.responsiveX : this.responsiveX / 100 * screenWidth;
        const y = this.mode === ResponsiveVector2.Mode.DEFAULT ? this.responsiveY : this.responsiveY / 100 * screenHeight;
        switch (this.type) {
            case ResponsiveVector2.T.DEFAULT:
                return new Vector2(x, y);
            break;
            case ResponsiveVector2.T.VALUES_FROM_END:
                return new Vector2(screenWidth - x, screenHeight - y);
                break;
            case ResponsiveVector2.T.X_FROM_END:
                return new Vector2(screenWidth - x, y);
                break;
            case ResponsiveVector2.T.Y_FROM_END:
                return new Vector2(x, screenHeight - y);
                break;
        }

    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    minus = (vector) => {
        this.x -= vector.x;
        this.y -= vector.y;
    }
    plus = (vector) => {
        this.x += vector.x;
        this.y += vector.y;
    }

    multiply = (vector) => {
        this.x *= vector.x;
        this.y *= vector.y;
    }

    set = (vector) => {
        this.x = vector.x;
        this.y = vector.y;
    }
}