class Product {
  constructor(title, description, price, thumbnail, code, stock, id) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = id;
  }
}


class ProductManager {
  constructor() {
    this.products = [];
    this.currentId = 1;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title) {
      throw new Error('Title is required.');
    }
    if (!description) {
      throw new Error('Description is required.');
    }
    if (!thumbnail) {
      throw new Error('Thumbnail is required.');
    }
    if (typeof price !== 'number' || price <= 0) {
      throw new Error('Price must be a positive number.');
    }
    if (typeof stock !== 'number' || stock <= 0) {
      throw new Error('Stock must be a positive number.');
    }
    if (this.getProductByCode(code)) {
      throw new Error(`Product with code ${code} already exists.`);
    }
    const newProduct = new Product(title, description, price, thumbnail, code, stock, this.currentId++);
    this.products.push(newProduct);
    return newProduct;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found.`);
    }
    return product;
  }

  getProductByCode(code) {
    return this.products.find((product) => product.code === code);
  }

  updateProduct(id, title, description, price, thumbnail, code, stock) {
    const product = this.getProductById(id);
    if (product.code !== code && this.getProductByCode(code)) {
      throw new Error(`Product with code ${code} already exists.`);
    }
    product.title = title;
    product.description = description;
    product.price = price;
    product.thumbnail = thumbnail;
    product.code = code;
    product.stock = stock;
    return product;
  }
  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found.`);
    }
    const [deletedProduct] = this.products.splice(productIndex, 1);
    return deletedProduct;
  }

  getAllProducts() {
    return this.products;
  }
}


const productManager = new ProductManager();

// Agregamos un nuevo producto
const newProduct = {
  title: 'Nuevo producto',
  description: 'Descripción del nuevo producto',
  price: 100,
  thumbnail: 'imagen_del_nuevo_producto.jpg',
  code: '123456',
  stock: 10
};

productManager.addProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock);

console.log(productManager.getAllProducts());