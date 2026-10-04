import express from "express";
import { log } from "node:console";

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

const app = express();
const port = 3000;

app.get("/api/products",(request,response) =>{
    response.json(products)
});

app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
    
})