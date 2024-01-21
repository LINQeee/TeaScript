let speed = 4;
let isJumping = false;
let jumpHeight = 150;
let jumpSpeed = 27;
const groundLevel = () => WW.layers["background"].canvas.height - 450;
document.addEventListener("DOMContentLoaded", () => {
    WW.startEngine(onEngineStart);
    WW.onUpdate = update;
});

const onEngineStart = () => {
    WW.layers["background"].settings.background = "#dceeff";
    WW.initPointLight(new Vector2(100, 1100), 500, {r: 255, g: 220, b:0}, 2);
    WW.loadScene(MainScene());
}

const update = () => {
    const player = WW.getObject("player");

    if (WW.getKey(Key.KeyD)) {
        playerPositionPlus(speed, 0);
        WW.layers["player"].settings.reversed = false;
    }
    if (WW.getKey(Key.KeyA)) {
        playerPositionPlus(-speed, 0);
        WW.layers["player"].settings.reversed = true;
    }
    if ((WW.getKey(Key.KeyW) || WW.getKey(Key.Space)) && !isJumping && player.position.y === groundLevel()) {
        isJumping = true;
        player.stopAnimation("walkSpriteAnimation");
        player.playSpriteAnimation(jumpSpriteAnimation);
    }
    handleAnimations(player);
    handleJumping(player);
}

const handleJumping = (player) => {
    //if (isJumping && player.position.y <= groundLevel() - jumpHeight) isJumping = false;
    //if (!player.isGrounded && !isJumping) playerPositionPlus(0, jumpSpeed / 4);
}

const handleAnimations = (player) => {
    if ((WW.getKey(Key.KeyA) || WW.getKey(Key.KeyD)) && player.isGrounded) {
        if (!player.isPlaying("walkSpriteAnimation")) player.playSpriteAnimation(walkSpriteAnimation);
    } else player.stopAnimation("walkSpriteAnimation");
}

const playerPositionPlus = (x, y) => {
    WW.getObject("player").position.plus(new Vector2(x, y));
    WW.cameraPosition.plus(new Vector2(x, y));
}

const resetPlayerY = () => {
    WW.getObject("player").position.y = groundLevel();
    WW.cameraPosition.y = 0;
}