import { manager } from "../manager/db/productManager.js";
import { Router } from "express";

const router = Router();

/*

router.get("/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  manager.getProductoById(id).then((data) => {
    if (data == "406a") {
      res.status(406).send({ status: "error", paiload: "No hay productos" });
    } else if (data == "406b") {
      res.status(406).send({ status: "error", paiload: "No existe el producto" });
    } else {
      res.send({ status: "success", paiload: data });
    }
  });
});

router.put("/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  const mods = req.body;
  if ("id" in mods) {
    delete mods.id;
  }
  manager.updateProducto(id, mods).then((data) => {
    if (data == 406) {
      res.status(406).send({ status: "error", paiload: "El producto no existe" });
    } else {
      res.status(201).send({ status: "success", paiload: "Producto modificado" });
    }
  });
});

router.delete("/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  manager.deleteProducto(id).then((data) => {
    if (data == 406) {
      res.status(406).send({ status: "error", paiload: "El producto no existe" });
    } else {
      res.status(201).send({ status: "success", paiload: "Producto eliminado" });
    }
  });
});
*/

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const query = req.query.query;
  const filter = req.query.filter;
  const sort = req.query.sort;
  manager.getProducts(limit, page, query, filter, sort).then((data) => {
    if (data) {
      res.send({ status: "success", paiload: data });
    } else {
      res.status(406).send({ status: "error", paiload: "No hay productos" });
    }
  });
});

router.post("/", async (req, res) => {
  const product = req.body;
  manager.addProduct(product).then((data) => {
    if (data == "406b") {
      res
        .status(406)
        .send({ status: "error", paiload: "El producto ya existe" });
    } else if (data == "406a") {
      res
        .status(406)
        .send({ status: "error", paiload: "Complete todos los campos" });
    } else {
      res.send({ result: "succes", payload: data });
    }
  });
});

// router.delete

export default router;
