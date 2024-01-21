const commandList = [
    ["Console.WriteLine()", () => "pesnya"],
    ["Console.ReadLine()", () => "pesnya"],
    ["Console.Clear()", () => "pesnya"],
];

let mainInput;

const playAudio = () => {
    let sound  = new Audio();
    let source  = document.createElement("source");
    source.type = "audio/mp3";
    source.src  = "./files/press.wav";
    sound.appendChild(source);
    sound.play().then(() => sound.remove());
}

document.addEventListener("DOMContentLoaded", async () => {
    document.body.appendChild(await TS.initializeTemplate("MainPage"))
    mainInput = document.getElementById("mainInput");

    mainInput.addEventListener("keypress", playAudio);

    mainInput.addEventListener("input", handleInput);
});

const handleInput = async (event) => {
    const commands = commandList.filter(cmd => cmd[0].toLowerCase().includes(event.currentTarget.value));
    console.log(commands)

    if(!commands.length) return;
    mainInput.parentNode.appendChild(await TS.initializeTemplate("Tooltip", commands));
}