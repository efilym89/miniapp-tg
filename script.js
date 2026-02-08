const menuItems = [
  {
    id: "set-classic",
    name: "Сет Классик",
    description: "24 ролла: калифорния, филадельфия, маки с лососем.",
    price: 980,
    emoji: "🍣",
  },
  {
    id: "roll-philadelphia",
    name: "Филадельфия люкс",
    description: "Ролл с лососем, сливочным сыром и огурцом.",
    price: 420,
    emoji: "🐟",
  },
  {
    id: "roll-spicy",
    name: "Спайси тунец",
    description: "Острый ролл с тунцом и соусом спайси.",
    price: 360,
    emoji: "🌶️",
  },
  {
    id: "wok-chicken",
    name: "Вок с курицей",
    description: "Лапша удон, курица терияки, овощи и кунжут.",
    price: 390,
    emoji: "🍜",
  },
  {
    id: "sushi-salmon",
    name: "Суши с лососем",
    description: "Нежный лосось на рисе, 2 шт.",
    price: 180,
    emoji: "🍙",
  },
  {
    id: "dessert-mochi",
    name: "Моти манго",
    description: "Японский десерт с кремом и кусочками манго.",
    price: 220,
    emoji: "🥭",
  },
];

const cart = new Map();

const menuNode = document.getElementById("menu");
const cartNode = document.getElementById("cart");
const cartTotalNode = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout");

const menuTemplate = document.getElementById("menu-item-template");
const cartTemplate = document.getElementById("cart-item-template");

const formatPrice = (value) => `${value} c`;

const renderMenu = () => {
  menuNode.innerHTML = "";

  menuItems.forEach((item) => {
    const card = menuTemplate.content.cloneNode(true);
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

renderMenu();
renderCart();
