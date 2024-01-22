const scaleUpAnimation = (object, newColor) => {
    return {
        name: "scaleUpAnimation",
        duration: 30,
        from: {
            "color.r": object.color.r,
            "color.g": object.color.g,
            "color.b": object.color.b,
        },
        to: {
            "color.r": newColor.r,
            "color.g": newColor.g,
            "color.b": newColor.g,
        }
    }
}

const scaleDownAnimation = {
    name: "scaleDownAnimation",
    frames: 30,
    from: {
        "settings.radius": 50,
        "size.x": 100,
        "size.y": 100,
    },
    to: {
        "settings.radius": 0,
        "size.x": 0,
        "size.y": 0,
    }
}

const bombExplode = (pesnya) => {
    return {
        name: "bombExplode",
        duration: 60,
        from: {
            "scale.x": pesnya.scale.x,
            "scale.y": pesnya.scale.y,
            "color.r": pesnya.color.r,
            "color.g": pesnya.color.g,
            "color.b": pesnya.color.b,
        },
        to: {
            "scale.x": -100,
            "scale.y": -100,
            "color.r": 0,
            "color.g": 0,
            "color.b": 0,
        }
    }
}

const walkSpriteAnimation = {
    initialCropPos: new Vector2(0, 36),
    yCropOffset: 36,
    name: "walkSpriteAnimation",
    spriteFramesCount: 7,
    cropPosStep: new Vector2(32, 0),
    duration: 56,
}
const jumpSpriteAnimation = {
    initialCropPos: new Vector2(0, 36),
    yCropOffset: 165,
    name: "jumpSpriteAnimation",
    spriteFramesCount: 5,
    cropPosStep: new Vector2(32, 0),
    duration: 65,
}