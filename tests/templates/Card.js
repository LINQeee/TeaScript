new Template("Card", (product) => {
   return `<div class="card">
            <span>id: ${product.id}</span>
            <img src="${product.image}" alt="product card"/>
            <div class="info">
                <span>${product.title.split(" ")[0]}</span>
                <div>${Array.apply(null, {length: Math.round(product.rating.rate)}).map(() => `<i class="fa-solid fa-star"></i>`).join("")}</div>
            </div>
            <div class="action">
                <span>${product.price}$</span>
                <button onclick="MainNavigator.goToPage('product',true,${TS.obj(product)})"><i class="fa-regular fa-cart-shopping"></i></button>
            </div>
            </div>`;
});