function MainPage() {
    return `
<div class="mainPage">
<h1 class="mainTitle">My Shop</h1>
<button onClick="MyNavigator.gotoPage('shop')">let's shop</button>
</div>`
}

TS.addTemplate(MainPage);