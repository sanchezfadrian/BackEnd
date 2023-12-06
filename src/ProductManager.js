import fs from "fs";

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.updateProductIdCounter();
        } catch (error) {
            this.products = [];
        }
    }

    updateProductIdCounter() {
        if (this.products.length > 0) {
            const lastProduct = this.products[this.products.length - 1];
            this.productIdCounter = lastProduct.id + 1;
        } else {
            this.productIdCounter = 1;
        }
    }

    async saveProducts() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    addProduct(product) {
        if (Object.values(product).some(value => value === "")) {
            console.log("Debe completar todos los campos");
            return;
        }

        const existingProduct = this.products.find((existingProduct) => existingProduct.code === product.code);
        if (existingProduct) {
            console.log("Producto duplicado");
        } else {
            const newProduct = { id: this.productIdCounter, ...product };
            this.products.push(newProduct);
            this.productIdCounter++;
            this.saveProducts();
            console.log("Producto agregado correctamente");
        }
    }

    getProduct() {
        try {
            if (fs.existsSync(this.path)) {
                let productsRead = fs.readFileSync(this.path, 'utf-8');
                this.products = JSON.parse(productsRead);
                return this.products;
            } else {
                console.log('El archivo no existe');
            }
        } catch (error) {
            console.error('Error leyendo el archivo', error);
            return [];
        }
    }

    getProductByID(id) {
        try {
            let products = this.getProduct();
            const productFound = products.find(product => product.id === id);
            if (productFound) {
                console.log(`El producto encontrado es: ${productFound.title}`);
                return productFound;
            } else {
                console.error("Not Found");
                return;
            }
        } catch (error) {
            console.error('Error buscando el producto', error);
        }
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
            this.saveProducts();
            console.log("Producto actualizado correctamente");
        } else {
            console.log("Producto no encontrado");
        }
    }

    deleteProduct(id) {
        const newProducts = this.products.filter((product) => product.id !== id);
        if (newProducts.length < this.products.length) {
            this.products = newProducts;
            this.saveProducts();
            console.log("Producto eliminado correctamente");
        } else {
            console.log("Producto no encontrado");
        }
    }
}

export default ProductManager;