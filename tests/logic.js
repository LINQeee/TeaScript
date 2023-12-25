const MyNavigator = new TSNavigator({
   main: "MainPage",
   shop: "ShopPage"
});

document.addEventListener("DOMContentLoaded",  async () => {
    const { result, error, request } = await TSQuery.request("https://jsonplaceholder.typicode.com/todos/1", TSQuery.METHOD.GET);

    console.log(result);
    console.log(error);
    console.log(request);
})
