const menuItems = [
  {
    id: "set-classic",
    name: "Сет Классик",
    description: "24 ролла: калифорния, филадельфия, маки с лососем.",
    category: "Сеты",
    ingredients: ["рис", "лосось", "огурец", "нори", "сыр"],
    price: 980,
    emoji: "🍣",
    image: "images/set-classic.jpg",
  },
  {
    id: "roll-philadelphia",
    name: "Филадельфия люкс",
    description: "Ролл с лососем, сливочным сыром и огурцом.",
    category: "Классические роллы",
    ingredients: ["лосось", "сливочный сыр", "огурец", "рис", "нори"],
    price: 420,
    emoji: "🐟",
    image: "images/roll-philadelphia.jpg",
  },
  {
    id: "roll-spicy",
    name: "Спайси тунец",
    description: "Острый ролл с тунцом и соусом спайси.",
    category: "Жаренные роллы",
    ingredients: ["тунец", "соус спайси", "рис", "нори"],
    price: 360,
    emoji: "🌶️",
    image: "images/roll-spicy.jpg",
  },
  {
    id: "wok-chicken",
    name: "Вок с курицей",
    description: "Лапша удон, курица терияки, овощи и кунжут.",
    category: "Вок",
    ingredients: ["лапша удон", "курица", "овощи", "кунжут", "соус терияки"],
    price: 390,
    emoji: "🍜",
    image: "images/wok-chicken.jpg",
  },
  {
    id: "sushi-salmon",
    name: "Суши с лососем",
    description: "Нежный лосось на рисе, 2 шт.",
    category: "Суши",
    ingredients: ["лосось", "рис"],
    price: 180,
    emoji: "🍙",
    image: "images/sushi-salmon.jpg",
  },
  {
    id: "dessert-mochi",
    name: "Моти манго",
    description: "Японский десерт с кремом и кусочками манго.",
    category: "Десерты",
    ingredients: ["рисовое тесто", "крем", "манго"],
    price: 220,
    emoji: "🥭",
    image: "images/dessert-mochi.jpg",
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
const cartPageTemplate = document.getElementById("cart-page-item-template");
const cartFab = document.getElementById("cart-fab");
const cartBadge = document.getElementById("cart-badge");
const cartPage = document.getElementById("cart-page");
const cartPageBackdrop = document.getElementById("cart-page-backdrop");
const cartPageClose = document.getElementById("cart-page-close");
const cartPageList = document.getElementById("cart-page-list");
const cartPageTotal = document.getElementById("cart-page-total");
const cartPageCheckout = document.getElementById("cart-page-checkout");
const checkoutPage = document.getElementById("checkout-page");
const checkoutPageBackdrop = document.getElementById("checkout-page-backdrop");
const checkoutPageClose = document.getElementById("checkout-page-close");
const checkoutPageList = document.getElementById("checkout-page-list");
const checkoutPageTotal = document.getElementById("checkout-page-total");
const checkoutPageSubmit = document.getElementById("checkout-page-submit");

const formatPrice = (value) => `${value} ₽`;

const pulseCard = (id) => {
  const card = document.querySelector(`[data-item-id="${id}"]`);
  if (!card) return;
  card.classList.remove("is-added");
  void card.offsetWidth;
  card.classList.add("is-added");
  card.addEventListener(
    "animationend",
    () => {
      card.classList.remove("is-added");
    },
    { once: true }
  );
};

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
  if (!searchQuery) return true;
  const query = searchQuery.toLowerCase();
  const haystack = [item.name, item.description, item.ingredients.join(" ")].join(" ").toLowerCase();
  return haystack.includes(query);
};

const filteredMenuItems = () =>
  menuItems.filter((item) => {
    const categoryMatch = activeCategory === "Все" || item.category === activeCategory;
    return categoryMatch && matchesSearch(item);
  });

const updateMenuCardState = (card, id) => {
  const count = cart.get(id) ?? 0;
  const addButton = card.querySelector(".add");
  const control = card.querySelector(".quantity-control");
  const countNode = card.querySelector(".quantity-count");
  if (!addButton || !control || !countNode) return;
  if (count > 0) {
    addButton.hidden = true;
    control.hidden = false;
    countNode.textContent = count;
  } else {
    addButton.hidden = false;
    control.hidden = true;
    countNode.textContent = "0";
  }
};

const updateMenuCardById = (id) => {
  const card = document.querySelector(`[data-item-id="${id}"]`);
  if (card) updateMenuCardState(card, id);
};

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
    const emojiNode = card.querySelector(".emoji");
    const imgNode = card.querySelector(".menu-card__photo");
    emojiNode.textContent = item.emoji;
    if (item.image) {
      imgNode.src = item.image;
      imgNode.alt = item.name;
      imgNode.hidden = false;
      emojiNode.hidden = true;
    } else {
      imgNode.hidden = true;
      emojiNode.hidden = false;
    }
    card.querySelector("h3").textContent = item.name;
    card.querySelector(".description").textContent = item.description;
    card.querySelector(".price").textContent = formatPrice(item.price);

    const addButton = card.querySelector(".add");
    addButton.addEventListener("click", () => addToCart(item.id));

    const decreaseButton = card.querySelector(".quantity-control .decrease");
    const increaseButton = card.querySelector(".quantity-control .increase");
    decreaseButton.addEventListener("click", () => updateCount(item.id, -1));
    increaseButton.addEventListener("click", () => updateCount(item.id, 1));

    updateMenuCardState(article, item.id);

    menuNode.appendChild(card);
  });
};

const addToCart = (id) => {
  const currentCount = cart.get(id) ?? 0;
  cart.set(id, currentCount + 1);
  renderCartViews();
  updateMenuCardById(id);
  pulseCard(id);
};

const updateCount = (id, delta) => {
  const currentCount = cart.get(id) ?? 0;
  const nextCount = currentCount + delta;
  if (nextCount <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, nextCount);
  }
  renderCartViews();
  updateMenuCardById(id);
  if (delta !== 0) pulseCard(id);
};

const renderCartMain = () => {
  cartNode.innerHTML = "";
  if (cart.size === 0) {
    const empty = document.createElement("div");
    empty.className = "cart__empty";
    empty.textContent = "Корзина пока пуста.";
    cartNode.appendChild(empty);
  } else {
    Array.from(cart.entries()).forEach(([id, count]) => {
      const item = menuItems.find((menuItem) => menuItem.id === id);
      if (!item) return;
      const row = cartTemplate.content.cloneNode(true);
      row.querySelector(".name").textContent = item.name;
      row.querySelector(".details").textContent = `${formatPrice(item.price)} · ${count} шт`;
      row.querySelector(".count").textContent = count;
      row.querySelector(".decrease").addEventListener("click", () => updateCount(id, -1));
      row.querySelector(".increase").addEventListener("click", () => updateCount(id, 1));
      cartNode.appendChild(row);
    });
  }
};

const renderCartPage = () => {
  cartPageList.innerHTML = "";
  if (cart.size === 0) {
    const empty = document.createElement("div");
    empty.className = "cart__empty";
    empty.textContent = "Корзина пока пуста.";
    cartPageList.appendChild(empty);
    cartPageTotal.textContent = formatPrice(0);
    return;
  }
  Array.from(cart.entries()).forEach(([id, count]) => {
    const item = menuItems.find((menuItem) => menuItem.id === id);
    if (!item) return;
    const row = cartPageTemplate.content.cloneNode(true);
    row.querySelector(".name").textContent = item.name;
    row.querySelector(".details").textContent = `${formatPrice(item.price)} · ${count} шт`;
    row.querySelector(".count").textContent = count;
    const thumb = row.querySelector(".cart-page__thumb");
    if (item.image) {
      thumb.src = item.image;
      thumb.alt = item.name;
    }
    row.querySelector(".decrease").addEventListener("click", () => updateCount(id, -1));
    row.querySelector(".increase").addEventListener("click", () => updateCount(id, 1));
    cartPageList.appendChild(row);
  });
  const total = Array.from(cart.entries()).reduce((sum, [id, count]) => {
    const item = menuItems.find((menuItem) => menuItem.id === id);
    return sum + (item ? item.price * count : 0);
  }, 0);
  cartPageTotal.textContent = formatPrice(total);
};

const renderCheckoutPage = () => {
  checkoutPageList.innerHTML = "";
  if (cart.size === 0) {
    const empty = document.createElement("div");
    empty.className = "cart__empty";
    empty.textContent = "Корзина пока пуста.";
    checkoutPageList.appendChild(empty);
    checkoutPageTotal.textContent = formatPrice(0);
    return;
  }
  Array.from(cart.entries()).forEach(([id, count]) => {
    const item = menuItems.find((menuItem) => menuItem.id === id);
    if (!item) return;
    const row = cartPageTemplate.content.cloneNode(true);
    row.querySelector(".name").textContent = item.name;
    row.querySelector(".details").textContent = `${formatPrice(item.price)} · ${count} шт`;
    row.querySelector(".count").textContent = count;
    const thumb = row.querySelector(".cart-page__thumb");
    if (item.image) {
      thumb.src = item.image;
      thumb.alt = item.name;
    }
    row.querySelector(".decrease").addEventListener("click", () => updateCount(id, -1));
    row.querySelector(".increase").addEventListener("click", () => updateCount(id, 1));
    checkoutPageList.appendChild(row);
  });
  const total = Array.from(cart.entries()).reduce((sum, [id, count]) => {
    const item = menuItems.find((menuItem) => menuItem.id === id);
    return sum + (item ? item.price * count : 0);
  }, 0);
  checkoutPageTotal.textContent = formatPrice(total);
};

const renderBadge = () => {
  const totalCount = Array.from(cart.values()).reduce((a, b) => a + b, 0);
  if (totalCount > 0) {
    cartBadge.hidden = false;
    cartBadge.textContent = totalCount;
    cartFab.classList.add("cart-fab--bump");
    cartFab.addEventListener(
      "animationend",
      () => cartFab.classList.remove("cart-fab--bump"),
      { once: true }
    );
  } else {
    cartBadge.hidden = true;
  }
};

const renderCartViews = () => {
  renderCartMain();
  renderCartPage();
  renderCheckoutPage();
  const total = Array.from(cart.entries()).reduce((sum, [id, count]) => {
    const item = menuItems.find((menuItem) => menuItem.id === id);
    return sum + (item ? item.price * count : 0);
  }, 0);
  cartTotalNode.textContent = formatPrice(total);
  renderBadge();
};

const openCartPage = () => {
  cartPage.classList.add("is-open");
  cartPage.setAttribute("aria-hidden", "false");
};

const closeCartPage = () => {
  cartPage.classList.remove("is-open");
  cartPage.setAttribute("aria-hidden", "true");
};

const openCheckoutPage = () => {
  if (cart.size === 0) {
    alert("Добавьте позиции в корзину перед оформлением.");
    return;
  }
  checkoutPage.classList.add("is-open");
  checkoutPage.setAttribute("aria-hidden", "false");
  closeCartPage();
};

const closeCheckoutPage = () => {
  checkoutPage.classList.remove("is-open");
  checkoutPage.setAttribute("aria-hidden", "true");
};

cartFab.addEventListener("click", openCartPage);
cartPageBackdrop.addEventListener("click", closeCartPage);
cartPageClose.addEventListener("click", closeCartPage);
cartPageCheckout.addEventListener("click", openCheckoutPage);
checkoutButton.addEventListener("click", openCheckoutPage);
checkoutPageBackdrop.addEventListener("click", closeCheckoutPage);
checkoutPageClose.addEventListener("click", closeCheckoutPage);
checkoutPageSubmit.addEventListener("click", () => {
  if (cart.size === 0) {
    alert("Корзина пуста.");
    return;
  }
  alert("Заказ отправлен! Мы свяжемся для подтверждения.");
  closeCheckoutPage();
});

checkoutButton.addEventListener("click", () => {
  if (cart.size === 0) {
    alert("Добавьте позиции в корзину перед оформлением.");
    return;
  }
});

searchInput.addEventListener("input", (event) => {
  searchQuery = event.target.value.trim();
  renderMenu();
});

renderCategories();
renderMenu();
renderCartViews();
