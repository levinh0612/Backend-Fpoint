const router = require("express").Router();
const userApi = require("../controllers/userCtrl");

router.get("/users", userApi.getAll);

router.post("/users/add", userApi.addUser);

router.post("/users/findByName", userApi.findByName);

router.post("/users/buyProduct", userApi.buyProduct);


module.exports = router;
