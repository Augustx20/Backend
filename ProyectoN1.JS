const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.getProductsFromJSON(); // Agregamos la variable "products" como caché
  }

  addProduct(product) {
    // Validación de campos incompletos
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      throw new Error("Todos los campos son obligatorios");
    }

    // Validación de código duplicado
    const duplicateProduct = this.products.find((p) => p.code === product.code);
    if (duplicateProduct) {
      throw new Error("Ya existe un producto con el mismo código");
    }

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
      // Validamos que el campo 'id' no cambie
      if ('id' in updatedFields && updatedFields.id !== id) {
        throw new Error("No se puede cambiar el ID del producto");
      }
      this.products[productIndex] = updatedProduct;
      this.saveProductsToJSON();
      return updatedProduct;
    }
    throw new Error("No se encontró el producto");
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      const deletedProduct = this.products.splice(productIndex, 1)[0];
      this.saveProductsToJSON();
      return deletedProduct;
    }
    throw new Error("No se encontró el producto");
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

try {
  productManager.addProduct(newProduct);
  console.log("Producto agregado exitosamente");
} catch (error) {
  console.log("Error al agregar el producto:", error.message);
}

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
  console.log("Error al actualizar el producto:", error.message);
}

try {
  const deletedProduct = productManager.deleteProduct(productId);
  console.log("Producto eliminado exitosamente:", deletedProduct);
} catch (error) {
  console.log("Error al eliminar el producto:", error.message);
}
