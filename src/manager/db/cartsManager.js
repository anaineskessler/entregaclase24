import cartModel from "../../model/carts.model.js";
import productModel from "../../model/products.model.js";

class CartsManger {
  #path;
  #carts;
  constructor() {
    this.#carts = [];
  }
  addCart = async () => {
    let products = [];
    let result = cartModel.create({
      products,
    });
    return result;
  };

  getCarts = async () => {
    try {
      let carts = await cartModel.find();
      return carts;
    } catch (err) {
      console.log("Cannot get carts with mongoose: " + err);
    }
  };

  getCartById = async (id) => {
    try {
      // let cart = await cartModel.findOne({_id: id}).populate("products.product");
      let cart = await cartModel.findOne({ _id: id });
      return cart;
    } catch (err) {
      return "406";
    }
  };

  getCartByIdView = async (id) => {
    try {
      // let cart = await cartModel.findOne({_id: id}).populate("products.product");
      let cart = await cartModel.findOne({ _id: id }).lean();
      return cart;
    } catch (err) {
      return "406";
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      let product = await productModel.findOne({ _id: pid });
      let cart = await cartModel.findOne({ _id: cid });

      if (cart.products.length == 0) {
        cart.products.push({ product: pid });
        const result = await cartModel.updateOne({ _id: cid }, cart);
      } else {
        let found = false;
        for (let i = 0; i < cart.products.length; i++) {
          if (cart.products[i].product._id.toString() == pid) {
            cart.products[i].qty++;
            found = true;
            break;
          }
        }
        if (!found) {
          cart.products.push({ product: pid });
        }
        const result = await cartModel.updateOne({ _id: cid }, cart);
        return result;
      }
    } catch (err) {
      console.log("Cannot get carts with mongoose: " + err);
      return "406";
    }
  };

  deleteProductToCart = async (cid, pid) => {
    try {
      let product = await productModel.findOne({ _id: pid });
      let cart = await cartModel.findOne({ _id: cid });

      let pIndex = cart.products.findIndex(
        (item) => item.product._id.toString() == pid
      );
      cart.products.splice(pIndex, 1);

      const result = await cartModel.updateOne({ _id: cid }, cart);
      return result;
    } catch (err) {
      console.log("Cannot get carts with mongoose: " + err);
      return "406";
    }
  };

  resetCart = async (cid) => {
    try {
      let cart = await cartModel.findOne({ _id: cid });

      cart.products.splice(0, cart.products.length);

      const result = await cartModel.updateOne({ _id: cid }, cart);
      return result;
    } catch (err) {
      console.log("Cannot get carts with mongoose: " + err);
      return "406";
    }
  };

  updateAllCart = async (cid, arrayBody) => {
    try {
      let cart = await cartModel.findOne({ _id: cid });
      let products = await productModel.find();

      let control = true;

      // Valido que existan los productos
      // Caso que uno no exista, retorno 406 y corta ejecucion

      for (let i = 0; i < arrayBody.length; i++) {
        if (
          !products.find((item) => item._id.toString() == arrayBody[i].product)
        ) {
          control = false;
          break;
        }
      }

      // Valido cantidad de productos
      // Caso <=0, retorno 406 y corta ejecucion

      arrayBody.forEach((item) => {
        if (item.qty < 1) {
          control = false;
        }
      });

      // Actualizo el carrito
      cart.products.splice(0, cart.products.length);
      arrayBody.forEach((item) => {
        cart.products.push({ product: item.product, qty: item.qty });
      });

      if (control) {
        let result = await cartModel.updateOne({ _id: cid }, cart);
        return result;
      } else {
        return "406";
      }
    } catch (err) {
      console.log("Cannot get carts with mongoose: " + err);
      return "406";
    }
  };

  updateOneItemCart = async (cid, pid, body) => {
    try {
      let cart = await cartModel.findOne({ _id: cid });
      let products = await productModel.findOne({ _id: pid });

      for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].product._id.toString() == pid) {
          cart.products[i].qty = body.qty;
          break;
        }
      }
      let result = await cartModel.updateOne({ _id: cid }, cart);
      return result;
    } catch (err) {
      console.log("Cannot get carts with mongoose: " + err);
      return "406";
    }
  };
}

const manager = new CartsManger();

export { manager, CartsManger };
