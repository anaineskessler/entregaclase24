import express from "express";
import { manager } from "../DAO/manager/db/productManager.js";
import { manager as cManager } from "../DAO/manager/db/cartsManager.js";
import userModel from "../DAO/model/user.model.js";
import { passportCall } from "../utils.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const query = req.query.query;
  const sort = req.query.sort;

  if (!req.user)
    return res.render("errors/base", {
      error: "No tienes los permisos para acceder a esta seccion.",
    });

  const mail = req.user.user.email;
  const nombre = req.user.user.first_name;
  const apellido = req.user.user.last_name;
  let rol = req.user.user.role;

  let limite = "",
    consulta = "",
    orden = "";
  if (limit) limite = `&limit=${limit}`;
  if (query) consulta = `&query=${query}`;
  if (sort) orden = `&sort=${sort}`;

  manager.getProductosView(limit, page, query, sort).then((data) => {
    if (data) {
      let prevLink = "";
      let nextLink = "";

      data.hasPrevPage
        ? (prevLink = `/products?page=${data.prevPage}${limite}${consulta}${orden}`)
        : (prevLink = "");
      data.hasNextPage
        ? (nextLink = `/products?page=${data.nextPage}${limite}${consulta}${orden}`)
        : (nextLink = "");

      const front_pagination = [];
      for (let index = 1; index <= data.totalPages; index++) {
        front_pagination.push({
          page: index,
          active: index == data.page,
        });
      }

      res.render("products", {
        data,
        prevLink,
        nextLink,
        front_pagination,
        mail,
        nombre,
        apellido,
        rol,
      });
    }
  });
});

export default router;
