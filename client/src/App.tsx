import { useState } from "react";
import "./App.css";


type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  emoji: string;
  color: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Everyday Mug",
    category: "Home",
    price: 18,
    emoji: "☕",
    color: "#e9ddd0",
  },
  {
    id: 2,
    name: "Soft Knit Throw",
    category: "Living",
    price: 64,
    emoji: "🧶",
    color: "#dfe5d8",
  },
  {
    id: 3,
    name: "Desk Companion",
    category: "Workspace",
    price: 32,
    emoji: "✏️",
    color: "#e8e2ef",
  },
];

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});


function App() {
  const [ cartItems, setCartItems ] = useState <Product[]>([])

  function addToCart(product:Product){
    setCartItems((currentItems) => [...currentItems,product]);
  }
  return (
    <main>
      <header>
        <a href="/">Nook</a>
        <nav>
          <a href="/">Shop</a>
          <a href="/">About</a>
          <a href="#products">Bag ({cartItems.length})</a>
        </nav>
      </header>

      <section className="hero">
        <h1>Find something you'll love.</h1>
        <p>Thoughtful picks for your everyday life.</p>
        <a className="button" href="#products">
          Explore the collection
        </a>
      </section>

      <section className="product-section" id="products">
        <p className="eyebrow">A few good things</p>
        <h2>Our favorites</h2>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div
                className="product-art"
                style={{ backgroundColor: product.color }}
                aria-hidden="true"
              >
                <span>{product.emoji}</span>
              </div>

              <p className="product-category">{product.category}</p>

              <div className="product-details">
                <h3>{product.name}</h3>
                <p>{priceFormatter.format(product.price)}</p>
              </div>
              <button
                type="button"
                className="add-button"
                onClick={() => addToCart(product)}>
                Add to bag
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;