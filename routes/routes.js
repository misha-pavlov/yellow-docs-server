const express = require("express");
const UserModel = require("../models/userModel/userModel");
const router = express.Router();

router.post("/post", async (req, res) => {
  const data = new UserModel({
    name: req.body.name,
    age: req.body.age,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const data = await UserModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getOne/:id", async (req, res) => {
  try {
    const data = await UserModel.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await UserModel.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await UserModel.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

// tips
// router.post("/post", async (req, res) => {
//     const data = new UserModel({
//       name: req.body.name,
//       age: req.body.age,
//     });

//     try {
//       const dataToSave = await data.save();
//       res.status(200).json(dataToSave);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });

//   router.get("/getAll", async (req, res) => {
//     try {
//       const data = await UserModel.find();
//       res.json(data);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

//   router.get("/getOne/:id", async (req, res) => {
//     try {
//       const data = await UserModel.findById(req.params.id);
//       res.json(data);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

//   router.patch("/update/:id", async (req, res) => {
//     try {
//       const id = req.params.id;
//       const updatedData = req.body;
//       const options = { new: true };

//       const result = await UserModel.findByIdAndUpdate(id, updatedData, options);

//       res.send(result);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });

//   router.delete("/delete/:id", async (req, res) => {
//     try {
//       const id = req.params.id;
//       const data = await UserModel.findByIdAndDelete(id);
//       res.send(`Document with ${data.name} has been deleted..`);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });
