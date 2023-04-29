class ProductManager {
    constructor() {
      this.products = [];
    }
  
    getProducts() {
      return this.products;
    }
  
    addProduct({title, description, price, thumbnail, code, stock}) {
      if (this.products.find(product => product.code === code)) {
        throw new Error("El código de producto ya existe");
      }
      const product = {
        id: this.generateId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };
      this.products.push(product);
      return product;
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    }
  
    generateId() {
      const ids = this.products.map(product => product.id);
      let newId;
      do {
        newId = Math.floor(Math.random() * 100000);
      } while (ids.includes(newId));
      return newId;
    }
  }
  
 
  const productManager = new ProductManager();
  
 
  const products = productManager.getProducts();
  console.log(products); // []
  

  try {
    const newProduct = productManager.addProduct({
      title: "producto prueba",
      description: "Este es un producto prueba",
      price: 200,
      thumbnail: "Sin imagen",
      code: "abc123",
      stock: 25
    });
    console.log(newProduct);
  } catch (error) {
    console.log(error.message); 
  }
  
  const products2 = productManager.getProducts();
  console.log(products2);
  
  try {
    const newProduct2 = productManager.addProduct({
      title: "producto prueba 2",
      description: "Este es otro producto prueba",
      price: 300,
      thumbnail: "Sin imagen",
      code: "abc123",
      stock: 10
    });
    console.log(newProduct2); 
  } catch (error) {
    console.log(error.message); 
  }
  
  try {
    const product = productManager.getProductById(products[0].id);
    console.log(product); 
  } catch (error) {
    console.log(error.message); 
  }
  
  try {
    const product = productManager.getProductById(99999);
    console.log(product); 
  } catch (error) {
  }