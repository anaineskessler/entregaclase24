import fs from "fs";

const filename = "./data/products.json";

class ProductManager {
  #path;
  #products;
  constructor() {
    this.#products = [];
    this.#path = "./src/data/products.json";
  }

  addProduct = async (product) => {
    let codigo = 0;
    let { title, description, price, thumbnail, code, stock } = product;
    if (!title || !description || !price || !code || !stock) {
      codigo = "406a";
      return codigo;
    }
    let id = this.#generateId();
    let producto = { id, ...product, status: true };
    if(!thumbnail){
    producto = { ...producto, thumbnail: [] };
    }
    codigo = this.#saveFile(producto);
    return codigo;
  };

  #saveFile = async (product) => {
    let code = 0;
    if (!fs.existsSync(this.#path)) {
      fs.writeFileSync(this.#path, JSON.stringify([], null, "\t"));
    }
    const data = await this.getProductos();
    if (data.find((item) => item.code === product.code)) {
      code = "406b";
      return code;
    }
    data.push(product);
    fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
    code = 201;
    return code;
  };

  #generateId = () => {
    if (!fs.existsSync(this.#path)) return 1;
    this.#products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
    let id = this.#products[this.#products.length - 1].id + 1;
    return id;
  };

  getProducts = async () => {
    if (!fs.existsSync(this.#path)) {
      return [];
    } else {
      const data = await fs.promises.readFile(this.#path, "utf-8");
      if (data) {
        const products = JSON.parse(data);
        return await products;
      }
    }
  };

  getProductos = async () => {
    const products = await this.getProducts();
    return await products;
  };

  getProductById = async (id) => {
    let code = 0;
    if (!fs.existsSync(this.#path)) {
      code = "406a";
      return code;
    }
    const products = await this.getProductos();
    let resultadoBusqueda = products.filter((item) => item.id === id);
    if (resultadoBusqueda.length === 0) {
      code = "406b";
      return code;
    }
    return await resultadoBusqueda[0];
  };

  getProductoById = async (id) => {
    const product = await this.getProductById(id);
    return await product;
  };

  updateProducto = async (id, mods) => {
    let code = 0;
    const data = await this.getProductos();
    if (!data.find((item) => item.id === id)) {
      code = 406;
      return code;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data[i] = { ...data[i], ...mods };
        fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
      }
    }
  };

  deleteProducto = async (id) => {
    let code = 0;
    const data = await this.getProductos();
    if (!data.find((item) => item.id === id)) {
      code = 406;
      return code;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data.splice(i, 1);
      }
    }
    fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
  };
}

const manager = new ProductManager();

// module.exports.fs = fs;
// module.exports.filename = filename;
// module.exports.manager = manager;

export { manager, ProductManager}



