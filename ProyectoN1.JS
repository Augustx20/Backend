const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.getProductsFromJSON(); // Agregamos la variable "products" como caché
  }

  addProduct(product) {
    const newProduct = {
      id: this.generateId(this.products),
      ...product
    };
    this.products.push(newProduct);
    this.saveProductsToJSON();
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    return product || null; // Retornamos null si no se encuentra el producto
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      const updatedProduct = {
        ...this.products[productIndex],
        ...updatedFields
      };
      // Validamos que no se puedan agregar campos nuevos ni cambiar el id
      if (Object.keys(updatedFields).length !== Object.keys(this.products[productIndex]).length || updatedFields.id !== id) {
        throw new Error("No se pueden modificar ni agregar campos");
      }
      this.products[productIndex] = updatedProduct;
      this.saveProductsToJSON();
      return updatedProduct;
    }
    return null;
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      const deletedProduct = this.products.splice(productIndex, 1)[0];
      this.saveProductsToJSON();
      return deletedProduct;
    }
    return null;
  }

  generateId(products) {
    if (products.length === 0) {
      return 1;
    }
    const lastProduct = products[products.length - 1];
    return lastProduct.id + 1;
  }

  getProductsFromJSON() {
    try {
      const fileData = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(fileData);
    } catch (error) {
      // Si el archivo no existe, retornamos un array vacío
      return [];
    }
  }

  saveProductsToJSON() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf-8');
  }
}

// Ejemplo de uso:

const productManager = new ProductManager('products.json');

const newProduct = {
  title: 'Nuevo producto',
  description: 'Descripción del nuevo producto',
  price: 100,
  thumbnail: 'imagen_del_nuevo_producto.jpg',
  code: '123456',
  stock: 10
};

productManager.addProduct(newProduct);

const allProducts = productManager.getProducts();
console.log(allProducts);

const productId = 1;
const product = productManager.getProductById(productId);
console.log(product);

const updatedFields = {
  id: productId, // Agregamos el id para no cambiarlo
  title: 'Producto actualizado',
  price: 200
};

try {
  const updatedProduct = productManager.updateProduct(productId, updatedFields);
  console.log(updatedProduct);
} catch (error) {
  console.log(error.message);
}

const deletedProduct = productManager.deleteProduct(productId);
console.log(deletedProduct);