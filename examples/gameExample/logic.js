let speed = 4;
let isJumping = false;
let jumpHeight = 200;
let jumpSpeed = 12;
let jumpPosY;
let canMove = true;
const padControls = {
    jump: false,
    left: false,
    right: false,
    attack: false,
};
const groundLevel = () => WW.layers["background"].canvas.height - 450;
document.addEventListener("DOMContentLoaded", () => {
    WW.startEngine(onEngineStart);
    WW.addUpdateListener("main", update);
});

const onEngineStart = () => {
    WW.layers["background"].settings.background = "#dceeff";
    WW.initPointLight(new Vector2(0, 0), 1500, {r: 255, g: 220, b: 0}, 1);
    WW.loadScene(MainScene());
    WW.startFollowCamera(WW.getObject("player"), new Vector2(-70, 200));
    if(window.mobileCheck()) setupUI();
    window.addEventListener("mousemove", event => console.log(`x: ${event.clientX} y: ${event.clientY}`))
};

const setupUI = () => {
    const responsiveButtonWidth = new ResponsiveVector2(7, 10, undefined, ResponsiveVector2.Mode.PERCENT).x;
    const padButtonStyle = new buttonStyle(
        new Vector2(responsiveButtonWidth, responsiveButtonWidth),
        {r: 0, g: 0, b: 0, a: 0.3},
        "https://www.freeiconspng.com/uploads/arrow-icon--myiconfinder-23.png"
    );
    const attackButtonStyle = Object.assign({}, padButtonStyle);
    attackButtonStyle.imagePath =
        "https://static.thenounproject.com/png/1032118-200.png";
    WWUI.createPadButton(
        new ResponsiveVector2(15, 15, ResponsiveVector2.T.VALUES_FROM_END, ResponsiveVector2.Mode.PERCENT),
        attackButtonStyle,
        -90,
        padControls,
        "attack"
    );
    WWUI.createPadButton(
        new ResponsiveVector2(15, 28, ResponsiveVector2.T.VALUES_FROM_END, ResponsiveVector2.Mode.PERCENT),
        padButtonStyle,
        -90,
        padControls,
        "jump"
    );
    WWUI.createPadButton(
        new ResponsiveVector2(18, 20, ResponsiveVector2.T.Y_FROM_END, ResponsiveVector2.Mode.PERCENT),
        padButtonStyle,
        0,
        padControls,
        "right"
    );
    WWUI.createPadButton(
        new ResponsiveVector2(10, 20, ResponsiveVector2.T.Y_FROM_END, ResponsiveVector2.Mode.PERCENT),
        padButtonStyle,
        -180,
        padControls,
        "left"
    );
};

const update = () => {
    const player = WW.getObject("player");
    if (
        (WW.getKey(Key.Space) || padControls.attack) &&
        !player.isPlaying("hitSpriteAnimation") &&
        player.isGrounded
    ) {
        canMove = false;
        player.playSpriteAnimation(hitSpriteAnimation);
        const onEnd = () => {
            canMove = true;
            player.onAnimationEnd = player.onAnimationEnd.filter(
                (event) => event !== onEnd
            );
        };
        player.onAnimationEnd.push(onEnd);
    }
    if ((WW.getKey(Key.KeyD) || padControls.right) && canMove) {
        playerPositionPlus(speed, 0);
        WW.layers["player"].settings.reversed = false;
    }
    if ((WW.getKey(Key.KeyA) || padControls.left) && canMove) {
        playerPositionPlus(-speed, 0);
        WW.layers["player"].settings.reversed = true;
    }
    if (
        (WW.getKey(Key.KeyW) || padControls.jump) &&
        !isJumping &&
        player.isGrounded &&
        canMove
    ) {
        isJumping = true;
        jumpPosY = player.position.y;
        player.stopAnimation("walkSpriteAnimation");
        player.playSpriteAnimation(jumpSpriteAnimation);
    }
    handleAnimations(player);
    handleJumping(player);
};

const handleJumping = (player) => {
    if (isJumping && player.position.y < jumpPosY - jumpHeight) isJumping = false;
    else if (isJumping) playerPositionPlus(0, -jumpSpeed);
};

const handleAnimations = (player) => {
    if (
        (WW.getKey(Key.KeyA) ||
            WW.getKey(Key.KeyD) ||
            padControls.left ||
            padControls.right) &&
        player.isGrounded &&
        canMove
    ) {
        if (!player.isPlaying("walkSpriteAnimation"))
            player.playSpriteAnimation(walkSpriteAnimation);
    } else player.stopAnimation("walkSpriteAnimation");
};

const playerPositionPlus = (x, y) => {
    WW.getObject("player").position.plus(new Vector2(x, y));
};
