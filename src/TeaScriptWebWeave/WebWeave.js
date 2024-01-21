class WW {

    static #defaultSettings = {
        fpsCount: 120,
        gradientStep: 100,
        gravity: 9.8
    };

    static settings = this.#defaultSettings;
    static layers = [];
    static sceneObjects = [];
    static currentAnimations = [];
    static cameraPosition;
    static T = {
        RECTANGLE: "rectangle",
        CIRCLE: "circle"
    }
    static AnimT = {
        PROP_ANIM: "prop_anim",
        SPRITE_ANIM: "sprite_anim"
    }

    static startEngine = (onEngineStart = () => {
    }) => {
        this.layers["background"] = new Layer("background", 0);
        this.layers["player"] = new Layer("player", 1);
        this.layers["FX"] = new Layer("FX", 2);
        this.cameraPosition = new Vector2(0, 0);
        this.#updateSceneSize();
        window.addEventListener('resize', this.#updateSceneSize);
        WWCore.setupKeyboard();
        onEngineStart();
        setInterval(this.#update, 1000 / this.settings.fpsCount);
    }

    static #update = () => {
        WWCore.clearLayers();
        this.sceneObjects.forEach(object => this.#updateObject(object));
        this.#updateAnimations();
        this.onUpdate();
    }

    static loadScene = (scene) => {
        this.settings = {...this.#defaultSettings, ...scene.settings};
        if (scene.layers && scene.layers.length)
            scene.layers.forEach(layer => {
                this.layers[layer.name] = layer;
            });
        if (scene.objects && scene.objects.length) scene.objects.forEach(obj => this.initObject(obj))
    }

    static onUpdate = () => {
    };

    static #updateAnimations = () => {
        this.currentAnimations.forEach(animObj => {
            switch (animObj[1].type) {
                case WW.AnimT.PROP_ANIM:
                    WWCore.playAnimation(animObj);
                    break;
                case WW.AnimT.SPRITE_ANIM:
                    WWCore.playSpriteAnimation(animObj);
                    break;
            }
        });
    }

    static #updateObject = (object) => {
        if (object.settings.isCollider) this.#checkIfCollides(object);
        if (object.settings.hasCollision && object.settings.shouldMove && object.triggers && object.triggers.length) WWCore.calculateCollision(object);
        if (object.settings.useGravity) WWCore.calculateGravity(object);
        this.initObject(object);
    }

    static #checkIfCollides = (object) => {
        let objectsToCollide = [];
        for (let trigger of this.sceneObjects) {
            let areRectanglesCollide = object.type === WW.T.RECTANGLE && trigger.type === WW.T.RECTANGLE && WWCore.areRectanglesCollide(object, trigger);
            let areCirclesCollide = object.type === WW.T.CIRCLE && trigger.type === WW.T.CIRCLE && WWCore.areCirclesColliding(object, trigger);
            let areCircleAndRectCollide = object.type === WW.T.CIRCLE && trigger.type === WW.T.RECTANGLE && WWCore.areCircleAndRectColliding(object, trigger);
            let areRectAndCircleCollide = object.type === WW.T.RECTANGLE && trigger.type === WW.T.CIRCLE && WWCore.areCircleAndRectColliding(trigger, object);
            if (trigger !== object && (areCirclesCollide || areRectanglesCollide || areCircleAndRectCollide || areRectAndCircleCollide)) objectsToCollide.push(trigger);
        }
        let newTriggers = objectsToCollide.filter(el => !object.triggers.includes(el));
        let stoppedTriggers = object.triggers.filter(el => !objectsToCollide.includes(el));
        if (newTriggers.length) object.onStartCollide.forEach(listener => listener(object, newTriggers));
        if (stoppedTriggers.length) object.onStopCollide.forEach(listener => listener(object, stoppedTriggers));
        object.triggers = [...object.triggers, ...newTriggers].filter(el => !stoppedTriggers.includes(el));
        if (object.triggers) object.whileCollide.forEach(listener => listener(object, objectsToCollide));
    }

    static initPointLight = (position, radius, color, intensity, settings = {}) => {
        let gradient = generateGradientFunc(radius, color, intensity, this.settings.gradientStep, "FX");
        let light = new SceneObject(position, undefined, gradient, "mainLight", undefined, {
            ...settings,
            radius
        }, WW.T.CIRCLE, "FX");
        return this.initObject(light)
    }

    static initObject = (sceneObject) => {
        WWCore.startDrawing(sceneObject);

        let objectPos = WWCore.generateObjectPosition(sceneObject);
        let objectSize = WWCore.generateObjectSize(sceneObject);

        WWCore.generateShape(sceneObject, sceneObject.type, objectPos, objectSize);
        WWCore.fillColor(sceneObject, objectPos);
        WWCore.drawImage(sceneObject, objectPos, objectSize);

        WWCore.stopDrawing(sceneObject);

        if (!this.sceneObjects.length || !this.sceneObjects.some(obj => obj.id === sceneObject.id))
            this.sceneObjects.push(sceneObject);

        return sceneObject;
    }

    static #updateSceneSize = () => Object.values(this.layers).forEach(layer => {
        layer.canvas.setAttribute("width", window.innerWidth.toString());
        layer.canvas.setAttribute("height", window.innerHeight.toString());
    });

    static getObject = (id) => {
        const sceneObj = this.sceneObjects.find(obj => obj.id === id);
        if (!sceneObj) throw new Error("unknown object");
        return sceneObj;
    }

    static getKey = (keyCode) => WWCore.pressedKeys.some(key => key === keyCode)
}