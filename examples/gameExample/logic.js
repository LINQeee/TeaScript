let speed = 4;
let isJumping = false;
let jumpHeight = 200;
let jumpSpeed = 12;
let jumpPosY;
const groundLevel = () => WW.layers["background"].canvas.height - 450;
document.addEventListener("DOMContentLoaded", () => {
    WW.startEngine(onEngineStart);
    WW.addUpdateListener("main", update);
});

const onEngineStart = () => {
    WW.layers["background"].settings.background = "#dceeff";
    WW.initPointLight(new Vector2(100, 1100), 500, {r: 255, g: 220, b:0}, 2);
    WW.loadScene(MainScene());
    WW.startFollowCamera(WW.getObject("player"), new Vector2(0, 200));
}

const update = () => {
    const player = WW.getObject("player");
    WW.camera.cameraPosition.set(player.position);
    if (WW.getKey(Key.KeyD)) {
        playerPositionPlus(speed, 0);
        WW.layers["player"].settings.reversed = false;
    }
    if (WW.getKey(Key.KeyA)) {
        playerPositionPlus(-speed, 0);
        WW.layers["player"].settings.reversed = true;
    }
    if ((WW.getKey(Key.KeyW) || WW.getKey(Key.Space)) && !isJumping && player.isGrounded) {
        isJumping = true;
        jumpPosY = player.position.y;
        player.stopAnimation("walkSpriteAnimation");
        player.playSpriteAnimation(jumpSpriteAnimation);
    }
    handleAnimations(player);
    handleJumping(player);
}

const handleJumping = (player) => {
    if (isJumping && player.position.y < jumpPosY - jumpHeight) isJumping = false;
    else if (isJumping) playerPositionPlus(0, -jumpSpeed);
}

const handleAnimations = (player) => {
    if ((WW.getKey(Key.KeyA) || WW.getKey(Key.KeyD)) && player.isGrounded) {
        if (!player.isPlaying("walkSpriteAnimation")) player.playSpriteAnimation(walkSpriteAnimation);
    } else player.stopAnimation("walkSpriteAnimation");
}

const playerPositionPlus = (x, y) => {
    WW.getObject("player").position.plus(new Vector2(x, y));
}