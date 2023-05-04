const Users = require("../models/user");


const userCtrl = {
  getAll: async (req, res) => {
    try {
      const listUser = await Users.find({});

      if (listUser.length <= 0) return res.status(400).json({ msg: "Không có dữ liệu!" });
      res.status(200).json({ listUser })
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  },
  findByName: async (req, res) => {
    try {
      const name = req.body.name;
      let user = await Users.findOne({ name });
      if (!user) return res.status(400).json({ msg: `[ ${name} ] không tồn tại!` });
      let rank = 0;
      let listUser = await Users.find({});

      listUser.sort((a, b) => b.point - a.point);
      listUser.forEach((u, index) => {
        if (u['name'] === user['name']) {
          rank = index + 1;
        }
      });
      user = { ...user._doc, rank }
      res.status(200).json({ user })
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  },
  addUser: async (req, res) => {
    try {
      const name = req.body.name;
      const point = Number(req.body.point) || 0;

      const newUser = new Users({
        name,
        point
      });

      newUser.save()
        .then(() => res.status(200).json('Đã thêm thành công 1 khách hàng!'))
        .catch(err => res.status(400).json('Có lỗi: ' + err));
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  },
  buyProduct: async (req, res) => {
    try {

      const point = req.body.point;
      const id = req.body.id;

      await Users.updateOne({ _id: id }, { $inc: { point: point } })
        .then(async result => {
          let user = await Users.findOne({ _id: id });

          let rank = 0;
          let listUser = await Users.find({});

          listUser.sort((a, b) => b.point - a.point);
          listUser.forEach((u, index) => {
            if (u['name'] === user['name']) {
              rank = index + 1;
            }
          });
          user = { ...user._doc, rank }
          res.status(200).json({ msg: 'Cập nhật thành công!', newUser: user });
        })
        .catch(error => {
          return res.status(400).json({ msg: error });
        });

    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
};


module.exports = userCtrl;
