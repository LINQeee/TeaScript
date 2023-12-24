function Card(title, imgUrl) {
    return `
    <div class="card">
            <h3>${title}</h3>
            <img src="${imgUrl}" alt="product image">
            ${TS.initializeHTMLTemplate("Button", "Buy")}
    </div>`;
}

TS.addTemplate(Card);