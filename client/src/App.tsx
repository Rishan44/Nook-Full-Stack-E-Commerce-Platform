import { useState, useEffect } from "react";
import "./App.css";


type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  emoji: string;
  color: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};



const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CART_STORAGE_KEY = "Nook-cart";

function readSavedCart(): CartItem[] {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!savedCart) {
    return [];
  }

  try {
    return JSON.parse(savedCart) as CartItem[];
  } catch {
    return [];
  }
}

function App() {
  const [ cartItems, setCartItems ] = useState <CartItem[]>(readSavedCart)

  const [ products, setProducts ] = useState<Product[]>([]);
  const [ productsLoading, setProductsLoading ] = useState(true);
  const [ productsError, setProductsError ] = useState<String | null>(null);


//Fetching the products when the page loads

  useEffect(() => {
  async function loadProducts() {
    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = (await response.json()) as Product[];
      setProducts(data);
    } catch {
      setProductsError("Could not load products. Is the API server running?");
    } finally {
      setProductsLoading(false);
    }
  }

  void loadProducts();
}, []);

//---


  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product: Product) {
  setCartItems((currentItems) => {
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      return currentItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    }

    return [...currentItems, { product, quantity: 1 }];
  });
}

  function removeFromCart(productId: number) {
    setCartItems((currentItems) =>
    currentItems.filter((item) => item.product.id !== productId),
  );
}

  function updateQuantity(productId: number, change: -1 | 1) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? {
           ...item, quantity: item.quantity + change 
          }:item,
      ),
    );
  }

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );


  return (
    <main>
      <header>
        <a href="/">Nook</a>
        <nav>
          <a href="/">Shop</a>
          <a href="/">About</a>
          <a href="#cart">Bag ({cartCount})</a>
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

        {productsLoading && <p>Loading products...</p>}

        {productsError && <p role="alert">{productsError}</p>}

        {!productsLoading && !productsError && (
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
                  onClick={() => addToCart(product)}
                >
                  Add to bag
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="cart-section" id="cart">
        <p className="eyebrow">Your selection</p>
        <h2>Your bag</h2>

        {cartItems.length === 0 ? (
          <p>Your bag is empty. Add a favorite above to get started.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item) => (
                <li key={item.product.id}>
                  <div className="cart-product-info">
                    <span>{item.product.name}</span>
                    <div
                      className="quantity-control"
                      aria-label={`Quantity for ${item.product.name}`}
                    >
                      {item.quantity === 1 ? (
                        <button
                          type="button"
                          aria-label={`Remove ${item.product.name} from bag`}
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3 7h18" />
                            <path d="M5 7l1 14h12l1-14" />
                            <path d="M9 7V4h6v3" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.product.name}`}
                          onClick={() => updateQuantity(item.product.id, -1)}
                        >
                          −
                        </button>
                      )}

                      <span aria-live="polite">{item.quantity}</span>

                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.product.name}`}
                        onClick={() => updateQuantity(item.product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-row-actions">
                    <span>
                      {priceFormatter.format(
                        item.product.price * item.quantity,
                      )}
                    </span>

                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <p className="cart-total">
              <span>Subtotal</span>
              <strong>{priceFormatter.format(cartTotal)}</strong>
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default App;