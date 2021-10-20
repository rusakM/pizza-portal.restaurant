const MENU_LISTS = {
  templates: {
    name: "templates",
    url: "/api/pizzas/templates",
    category: "pizzas",
  },
  sauces: {
    name: "sauces",
    url: "/api/products?category=Sosy",
    category: "products",
    typeOfProduct: "Sosy",
  },
  drinks: {
    name: "drinks",
    url: "/api/products?category=Napoje",
    category: "products",
    typeOfProduct: "Napoje",
  },
  ingredients: {
    name: "ingredients",
    url: "/api/supplies",
    category: "supplies",
  },
};

export default MENU_LISTS;
