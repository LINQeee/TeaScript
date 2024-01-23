const MainScene = () => {
  return {
    settings: {
      fpsCount: 120,
      gradientStep: 100,
    },
    layers: [],
    objects: [
      new SceneObject(
        new Vector2(WW.layers["background"].canvas.width / 2, groundLevel()),
        new Vector2(150, 150),
        Color.TRANSPARENT,
        "player",
        undefined,
        {
          cropSize: new Vector2(27, 27),
          cropPos: new Vector2(5, 36),
          isCollider: true,
          spriteUrl: "./assets/character.png",
          isStatic: true,
          hasCollision: true,
          shouldMove: true,
          useGravity: true,
          mass: 35,
        },
        WW.T.RECTANGLE,
        "player"
      ),
      ...generateGrounds(),
      new SceneObject(
        WWCore.getScreenCenter(WW.layers["background"]).plus(
          new Vector2(100, 1300)
        ),
        new Vector2(150, 150),
        Color.BLACK,
        "collision",
        undefined,
        {
          hasCollision: true,
        },
        WW.T.RECTANGLE,
        "background"
      ),
    ],
  };
};

const generateGrounds = () => {
  let ground = [];
  let groundOffset = 0;
  for (let i = 0; i < 10; i++) {
    ground.push(
      new SceneObject(
        new Vector2(
          -100 + groundOffset,
          WW.layers["background"].canvas.height - 130
        ),
        new Vector2(586, 384),
        undefined,
        `ground${i}`,
        undefined,
        {
          spriteUrl: "./assets/ground.png",
          hasCollision: true,
          imagePosOffset: new Vector2(-60, -100),
          imageSizeOffset: new Vector2(180, 0),
        },
        WW.T.RECTANGLE,
        "background"
      )
    );
    groundOffset += 600;
  }
  return ground;
};
