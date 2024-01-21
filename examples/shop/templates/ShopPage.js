new Template("ShopPage", async (category) => {
    let {result} = await new TSQuery().send("https://fakestoreapi.com/products", TSQuery.METHOD.GET, {cacheEnabled: true});
    if (category) result = result.filter(product => product.category === category);
    return `<div class="shopPage page">
                ${TS.initializeHTMLTemplate('Header')}
                ${result.map(product => TS.initializeHTMLTemplate("Card", product)).join("")}
            </div>`;
});