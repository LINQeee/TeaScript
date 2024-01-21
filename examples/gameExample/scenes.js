const MainScene = () => {
    return {
        settings: {
            fpsCount: 120,
            gradientStep: 100
        },
        layers: [],
        objects: [
            new SceneObject(
                new Vector2(WW.layers["background"].canvas.width / 2, groundLevel()),
                new Vector2(150, 150),
                undefined,
                "player",
                undefined,
                {
                    cropSize: new Vector2(27, 27),
                    cropPos: new Vector2(0, 36),
                    isCollider: true,
                    spriteUrl: "./assets/character.png",
                    isStatic: true,
                    hasCollision: true,
                    shouldMove: true,
                    useGravity: true
                },
                WW.T.RECTANGLE,
                "player"
            ),
            ...generateGrounds()

        ]
    }
}

const generateGrounds = () => {
    let ground = [];
    let groundOffset = 0;
    for (let i = 0; i < 10; i++) {
        ground.push(new SceneObject(
            new Vector2(-100 + groundOffset, WW.layers["background"].canvas.height - 200),
            new Vector2(786, 384),
            undefined,
            `ground${Math.random()}`,
            undefined,
            {
                spriteUrl: "./assets/ground.png",
                hasCollision: true
            },
            WW.T.RECTANGLE,
            "background"
        ));
        groundOffset += 600;
    }
    return ground;
}