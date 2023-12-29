new Template("MainPage", () => {
    return `
<div class="mainPage">
<h1 class="mainTitle">My Shop</h1>
<button onClick="MainNavigator.goToPage('shop')">let's shop</button>
</div>`
});