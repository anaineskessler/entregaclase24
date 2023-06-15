import { manager as cManager } from "../manager/db/cartsManager.js";
import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  cManager.addCart().then((data) => {
    if (data) {
      res.send({ result: "succes", payload: data });
    }
  });
});

router.get("/", async (req, res) => {
  cManager.getCarts().then((data) => {
    if (data) {
      res.send({ result: "succes", payload: data });
    }
  });
});

router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  cManager.getCartById(cid).then((data) => {
    if (data == "406") {
      res.send({ result: "error", payload: "Carrito no encontrado." });
    } else {
      res.send({ result: "succes", payload: data });
    }
  });
});

router.post("/:cid/product/:pid", (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  cManager.addProductToCart(cid, pid).then((data) => {
    if (data == "406") {
      res.send({
        result: "error",
        payload: "No se pudo agregar el producto al carrito.",
      });
    } else {
      res.send({ result: "succes", payload: data });
    }
  });
});

router.delete("/:cid/product/:pid", (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  cManager.deleteProductToCart(cid, pid).then((data) => {
    if (data == "406") {
      res.send({
        result: "error",
        payload: "No se pudo eliminar el producto al carrito.",
      });
    } else {
      res.send({ result: "succes", payload: data });
    }
  });
});

router.delete("/:cid", (req, res) => {
  const cid = req.params.cid;
  cManager.resetCart(cid).then((data) => {
    if (data == "406") {
      res.send({
        result: "error",
        payload: "No se pudo eliminar el producto al carrito.",
      });
    } else {
      res.send({ result: "succes", payload: data });
    }
  });
});

router.put("/:cid", (req, res) => {
  const cid = req.params.cid;
  const arrayBody = req.body;
  // if (arrayBody.hasOwnProperty("product") && arrayBody.hasOwnProperty("qty")) {
  if (arrayBody.length > 0) {
    let format = true;
    for (let i = 0; i < arrayBody.length; i++) {
      if (
        !arrayBody[i].hasOwnProperty("product") ||
        !arrayBody[i].hasOwnProperty("qty")
      ) {
        format = false;
        break;
      }
    }
    if (!format) {
      res.send({
        result: "error",
        payload: "No se pudo actualizar el producto al carrito.",
      });
    } else {
      cManager.updateAllCart(cid, arrayBody).then((data) => {
        if (data == "406") {
          res.send({
            result: "error",
            payload: "No se pudo actualizar el producto al carrito.",
          });
        } else {
          res.send({ result: "succes", payload: data });
        }
      });
    }
  } else {
    res.send({
      result: "error",
      payload: "No se pudo actualizar el producto al carrito.",
    });
  }
});

router.put("/:cid/product/:pid", (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const body = req.body;
  if (!body.hasOwnProperty("qty")) {
    res.send({
      result: "error",
      payload: "No se pudo actualizar el producto al carrito.",
    });
  } else {
    if(body.qty < 1){
      res.send({
        result: "error",
        payload: "No se pudo actualizar el producto al carrito.",
      });
    } else {
      cManager.updateOneItemCart(cid, pid, body).then((data) => {
        if(data == 406){
          res.send({
            result: "error",
            payload: "No se pudo actualizar el producto al carrito.",
          });
        } else {
          res.send({ result: "succes", payload: data });
        }
      });
    }
  }
});

export default router;
