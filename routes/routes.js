const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/users');
const fs = require('fs');
const users = require('../models/users');

//img upload
var storage = multer.diskStorage({
    destination: function(req,  file, cb){
        cb(null, './uploads');
    },
    filename: function(req,  file,  cb){
        cb(null,  file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");


//insert a product to db route
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            Category: req.body.Category,
            price: req.body.price,
            Image: req.file.filename,
        });
        await user.save();
        req.session.message = {
            type: 'success',
            message: 'Product Added Successfully!'
        };
        res.redirect("/home");
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


//get products display
router.get("/home", async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('home', {
            title: 'Home Page',
            users: users
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.get("/add", (req, res) => {
    res.render("add_products", {title: "Add Products"});
});


// Edit a product
router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).exec();

        if (!user) {
            res.redirect("/home");
        } else {
            res.render("edit_products", {
                title: "Edit User",
                user: user,
            });
        }
    } catch (err) {
        res.json({ message: err.message });
    }
});


//update user route for upload image in edit function (Imagge Edit)
router.post('/update/:id', upload, async (req, res) => {
    try {
        const id = req.params.id;
        let new_image = '';

        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync("./uploads/" + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            new_image = req.body.old_image;
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            Image: new_image,
        });

        if (!updatedUser) {
            return res.json({ message: 'User not found', type: 'danger' });
        }

        req.session.message = {
            type: 'success',
            message: 'User Updated successfully!',
        };
        res.redirect("/home");
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});




// Delete a user
router.get('/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const user = await User.findById(id);

        if (!user) {
            res.redirect("/home");
        } else {
            if (user.Image != '') {
                try {
                    fs.unlinkSync('./uploads/' + user.Image);
                } catch (err) {
                    console.log(err);
                }
            }

            await User.findOneAndDelete({ _id: id });

            req.session.message = {
                type: 'success',
                message: 'User deleted successfully!'
            };
            res.redirect("/home");
        }
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Route to redirect to Home page
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        users: users
    });
  });

// Route to redirect to shop page
router.get('/store', (req, res) => {
    res.render('store', {
        title: 'Store',
        users: users
    });
  });

//get products display in store
router.get("/store", async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('store', {
            title: 'Store',
            users: users
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Route to redirect to about page
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        users: users
    });
  });


module.exports = router;