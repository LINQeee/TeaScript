new Template("ProductPage", async (product) => {
   return `<div class="productPage page">
            ${TS.initializeHTMLTemplate('Header')}
            <ul>
                <button onclick="MainNavigator.goToPage('shop')">HOME</button>
                <button onclick="MainNavigator.goToPage('shop', true, ${TS.str(product.category)})">${product.category}</button>
                <button onclick="MainNavigator.goToPage('product',true, ${TS.obj(product)})">${product.title.split(" ")[0]}</button>
            </ul>
            <img src="${product.image}" alt="product image"/>
            <div class="description">
                <span>${product.title}</span>
                <span>${product.description}</span>
                <button>Add to Cart</button>
            </div>
            </div>`;
});