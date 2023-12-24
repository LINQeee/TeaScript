
function MyFirstDiv(bg, height) {
    return `<div style="background-color: ${bg}; height: ${height}px"></div>`;
}

TeaScript.addTemplate(MyFirstDiv)
document.body.appendChild(TeaScript.createTemplate("MyFirstDiv", "red", 400));

