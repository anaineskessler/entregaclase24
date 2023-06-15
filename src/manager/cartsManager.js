import fs from "fs";

const filename = "./data/carts.json";

class CartsManger {
  #path;
  #carts;
  constructor() {
    this.#carts = [];
    this.#path = "./src/data/carts.json";
  }
  addCart = async () => {
    let codigo = 0;
    let id = this.#generateId();
    let cart = { id, products: [] };
    codigo = this.#saveFile(cart);
    return codigo;
  };

  #saveFile = async (cart) => {
    let code = 0;
    if (!fs.existsSync(this.#path)) {
      fs.writeFileSync(this.#path, JSON.stringify([], null, "\t"));
    }
    const data = await this.getCarritos();
    data.push(cart);
    fs.writeFileSync(this.#path, JSON.stringify(data, null, "\t"));
    code = 201;
    return code;
  };

  #generateId = () => {
    if (!fs.existsSync(this.#path)) return 1;
    this.#carts = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
    let id = this.#carts[this.#carts.length - 1].id + 1;
    return id;
  };

  getCarts = async () => {
    if (!fs.existsSync(this.#path)) {
      return [];
    } else {
      const data = await fs.promises.readFile(this.#path, "utf-8");
      if (data) {
        const carts = JSON.parse(data);
        return await carts;
      }
    }
  };

  getCarritos = async () => {
    const carts = await this.getCarts();
    return await carts;
  };

  getCartById = async (id) => {
    let code = 0;
    if (!fs.existsSync(this.#path)) {
      code = "406a";
      return code;
    }
    const carts = await this.getCarritos();
    let resultadoBusqueda = carts.filter((item) => item.id === id);
    if (resultadoBusqueda.length === 0) {
      code = "406b";
      return code;
    }
    return await resultadoBusqueda[0];
  };

  getCarritoById = async (id) => {
    const product = await this.getCartById(id);
    return await product;
  };

  addProduct = async (cid, pid) => {
    let code = 0;
    const product = { id: pid, quantity: 1 };
    const carts = await this.getCarritos();
    carts.forEach((element) => {
      if (element.id === cid) {
        console.log(element);
        if (element.products.find((item) => item.id === pid)) {
          element.products.forEach((item) => {
            if (item.id === pid) {
              item.quantity += 1;
              fs.writeFileSync(this.#path, JSON.stringify(carts, null, "\t"));
            }
          });
        } else {
          element.products = [...element.products, { id: pid, quantity: 1 }];
          fs.writeFileSync(this.#path, JSON.stringify(carts, null, "\t"));
        }
      }
    });
  };
}

const manager = new CartsManger();

export { manager, CartsManger };
