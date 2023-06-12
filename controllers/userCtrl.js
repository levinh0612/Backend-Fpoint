const Users = require("../models/user");
const Orders = require("../models/order");
const { default: mongoose } = require("mongoose");


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
      const inputDate = req.body.date;

      let user = await Users.findOne({ name });
      if (!user) return res.status(400).json({ msg: `[ ${name} ] không tồn tại!` });

      await Orders.aggregate([
        {
          $match: {
            date: {
              $lte: new Date(inputDate),
            },
          },
        },
        {
          $group: {
            _id: '$user',
            points: { $sum: '$point' },
          },
        },
        {
          $lookup: {
            from: 'users', // Replace with the actual name of the User collection
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
      ]).then(listUser => {
        let rank = 0;
        let pointUser = 0;

        if(listUser.length > 0 ) {
          listUser.sort((a, b) => b.points - a.points);
          listUser.forEach((u, index) => {
            if (u._id.toString() === user._id.toString()) {
              rank = index + 1;
            }
          });
          const filterUser = listUser.find(userItem => userItem._id.toString() === user._id.toString());
          if(typeof filterUser !== 'undefined') {
            pointUser =filterUser['points'];
          } else {
            pointUser = 0;
            rank = listUser.length + 1;
          }
        }
        const response = { id: user['_id'], name: user['name'], point: pointUser, rank }
        res.status(200).json({ user: response })
      }).catch(error => {
        res.status(400).json({msg: error})
      })

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
      const price = req.body.price;
      const startDate = req.body.startDate;

      let user = await Users.findById(id);
      if (!user) return res.status(400).json({ msg: `Người dùng [ ${id} ] không tồn tại!` });

      const newOrder = new Orders({
        price,
        point,
        user: new mongoose.Types.ObjectId(id),
        date: new Date(startDate)
      });

      newOrder.save()
        .then(async () => {
            res.status(200).json({ msg: 'Cập nhật thành công!' });
            }
          )
          .catch(err => res.status(400).json({msg: 'Có lỗi: ' + err}));


    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }
};


module.exports = userCtrl;
