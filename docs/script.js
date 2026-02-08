const menuItems = [
  {
    id: "set-classic",
    name: "Сет Классик",
    description: "24 ролла: калифорния, филадельфия, маки с лососем.",
    category: "Сеты",
    ingredients: ["рис", "лосось", "огурец", "нори", "сыр"],
    price: 980,
    emoji: "🍣",
  },
  {
    id: "roll-philadelphia",
    name: "Филадельфия люкс",
    description: "Ролл с лососем, сливочным сыром и огурцом.",
    category: "Классические роллы",
    ingredients: ["лосось", "сливочный сыр", "огурец", "рис", "нори"],
    price: 420,
    emoji: "🐟",
  },
  {
    id: "roll-spicy",
    name: "Спайси тунец",
    description: "Острый ролл с тунцом и соусом спайси.",
    category: "Жаренные роллы",
    ingredients: ["тунец", "соус спайси", "рис", "нори"],
    price: 360,
    emoji: "🌶️",
  },
  {
    id: "wok-chicken",
    name: "Вок с курицей",
    description: "Лапша удон, курица терияки, овощи и кунжут.",
    category: "Вок",
    ingredients: ["лапша удон", "курица", "овощи", "кунжут", "соус терияки"],
    price: 390,
    emoji: "🍜",
  },
  {
    id: "sushi-salmon",
    name: "Суши с лососем",
    description: "Нежный лосось на рисе, 2 шт.",
    category: "Суши",
    ingredients: ["лосось", "рис"],
    price: 180,
    emoji: "🍙",
  },
  {
    id: "dessert-mochi",
    name: "Моти манго",
    description: "Японский десерт с кремом и кусочками манго.",
    category: "Десерты",
    ingredients: ["рисовое тесто", "крем", "манго"],
    price: 220,
    emoji: "🥭",
  },
];

const cart = new Map();
let activeCategory = "Все";
let searchQuery = "";

const menuNode = document.getElementById("menu");
const cartNode = document.getElementById("cart");
const cartTotalNode = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout");
const searchInput = document.getElementById("search");
const categoryList = document.getElementById("category-list");

const menuTemplate = document.getElementById("menu-item-template");
const cartTemplate = document.getElementById("cart-item-template");

const formatPrice = (value) => `${value} ₽`;

const getCategories = () => {
  const categories = new Set(menuItems.map((item) => item.category));
  return ["Все", ...categories];
};

const renderCategories = () => {
  categoryList.innerHTML = "";
  getCategories().forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `category-chip${category === activeCategory ? " is-active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      renderMenu();
      renderCategories();
    });
    categoryList.appendChild(button);
  });
};

const matchesSearch = (item) => {
  if (!searchQuery) {
    return true;
  }
  const query = searchQuery.toLowerCase();
  const haystack = [item.name, item.description, item.ingredients.join(" ")].join(" ").toLowerCase();
  return haystack.includes(query);
};

const filteredMenuItems = () =>
  menuItems.filter((item) => {
    const categoryMatch = activeCategory === "Все" || item.category === activeCategory;
    return categoryMatch && matchesSearch(item);
  });

const renderMenu = () => {
  menuNode.innerHTML = "";

  const items = filteredMenuItems();

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "cart__empty";
    empty.textContent = "Ничего не найдено. Попробуйте изменить запрос.";
    menuNode.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const card = menuTemplate.content.cloneNode(true);
    const article = card.querySelector(".menu-card");
    article.dataset.itemId = item.id;
    card.querySelector(".emoji").textContent = item.emoji;
    card.querySelector("h3").textContent = item.name;
    card.querySelector(".description").textContent = item.description;
    card.querySelector(".price").textContent = formatPrice(item.price);

    const addButton = card.querySelector(".add");
    addButton.addEventListener("click", () => addToCart(item.id));

    menuNode.appendChild(card);
  });
};

const addToCart = (id) => {
  const currentCount = cart.get(id) ?? 0;
  cart.set(id, currentCount + 1);
  renderCart();

  const card = document.querySelector(`[data-item-id="${id}"]`);
  if (card) {
    card.classList.remove("is-added");
    void card.offsetWidth;
    card.classList.add("is-added");
  }
};

const updateCount = (id, delta) => {
  const currentCount = cart.get(id) ?? 0;
  const nextCount = currentCount + delta;

  if (nextCount <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, nextCount);
  }

  renderCart();
};

const renderCart = () => {
  cartNode.innerHTML = "";

  if (cart.size === 0) {
    const empty = document.createElement("div");
    empty.className = "cart__empty";
    empty.textContent = "Корзина пока пуста.";
    cartNode.appendChild(empty);
  } else {
    Array.from(cart.entries()).forEach(([id, count]) => {
      const item = menuItems.find((menuItem) => menuItem.id === id);
      if (!item) {
        return;
      }

      const row = cartTemplate.content.cloneNode(true);
      row.querySelector(".name").textContent = item.name;
      row.querySelector(".details").textContent = `${formatPrice(item.price)} за порцию`;
      row.querySelector(".count").textContent = count;

      row.querySelector(".decrease").addEventListener("click", () => updateCount(id, -1));
      row.querySelector(".increase").addEventListener("click", () => updateCount(id, 1));

      cartNode.appendChild(row);
    });
  }

  const total = Array.from(cart.entries()).reduce((sum, [id, count]) => {
    const item = menuItems.find((menuItem) => menuItem.id === id);
    return sum + (item ? item.price * count : 0);
  }, 0);

  cartTotalNode.textContent = formatPrice(total);
};

checkoutButton.addEventListener("click", () => {
  if (cart.size === 0) {
    alert("Добавьте позиции в корзину перед оформлением.");
    return;
  }

  alert("Спасибо за заказ! Мы свяжемся с вами для подтверждения.");
});

searchInput.addEventListener("input", (event) => {
  searchQuery = event.target.value.trim();
  renderMenu();
});

renderCategories();
renderMenu();
renderCart();
