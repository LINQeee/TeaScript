const MainNavigator = new TSNavigator({
  main: "MainPage",
  shop: "ShopPage"
});

const MainTSQuery = new TSQuery();

document.addEventListener("click", async () => {
  const newPost = {title: 'foo', body: 'bar', asd: 1}
  const {result, error, status} = await MainTSQuery.send('https://jsonplaceholder.typicode.com/poss', TSQuery.METHOD.POST, {}, newPost);
  console.log(result)
  console.log(error);
  console.log(status)
});