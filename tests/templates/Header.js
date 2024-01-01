new Template("Header", () => {
    return `<div class="pageHeader">
                <button onclick="MainNavigator.goToPage('shop')"><i class="fa-regular fa-house"></i></button>
                <button onclick="MainNavigator.goToPage('shop', true, ${TS.str(CATEGORIES.JEWELERY)})">jewelery</button>
                <button onclick="MainNavigator.goToPage('shop', true, ${TS.str(CATEGORIES.ELECTRONICS)})">electronics</button>
                <button onclick="MainNavigator.goToPage('shop', true, ${TS.str(CATEGORIES.MEN_CLOTHES)})">men's clothing</button>
                <button onclick="MainNavigator.goToPage('shop', true, ${TS.str(CATEGORIES.WOMEN_CLOTHES)})">women's clothing</button>
            </div>`;
});