"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const jsonwebtoken = require("jsonwebtoken");
//create a variable and store the users information  and books path inside.
const usersDataPath = path_1.default.join(__dirname, "../../database/users.json");
let usersData;
let booksData;
let booksDataPath = path_1.default.join(__dirname, "../../database/books.json");
// let booksDataPath = "/Users/decagon/Documents/GitHub/week-6-task-devgirl-esther/database/books.json";
//try--catch to account for if the users path doesnt exist already,so it can be created by the read write.
try {
    usersData = JSON.parse(fs_1.default.readFileSync(usersDataPath, "utf-8"));
}
catch (error) {
    fs_1.default.writeFile(usersDataPath, JSON.stringify([]), () => {
        usersData = JSON.parse(fs_1.default.readFileSync(usersDataPath, "utf-8"));
    });
}
//TRY--catch to account for if the books path doesnt exist already,so it can be created by the read write.
try {
    booksData = JSON.parse(fs_1.default.readFileSync(booksDataPath, "utf-8"));
}
catch (error) {
    fs_1.default.writeFile(booksDataPath, JSON.stringify([]), () => {
        booksData = JSON.parse(fs_1.default.readFileSync(booksDataPath, "utf-8"));
    });
}
// {
//   firstname:"esther"
//   email:"starexedoho@gmail.com"
//   password:"qwertyyy"
//   id:1
// }
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Library Resource Manager' });
    // res.json( "Hello World!")
});
/* GET login page. */
router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Library Resource Manager' });
    // res.json( "Hello World!")
});
router.post('/login', function (req, res, next) {
    //verify if email and password exists in database and is valid
    const verifyEmail = usersData.find((value) => value.email === req.body.email);
    // console.log(verifyEmail);
    //id email exists and is valid,please take to the dashboard
    if (verifyEmail) {
        if (req.body.password === verifyEmail.password) {
            res.render("dashboard", {
                title: "Library Resource Manager",
                firstname: verifyEmail.firstname,
                displayBooks: booksData
            });
        }
        else {
            res.render('login', { title: "Library Resource Manager", err: "Please input correct password." });
        }
    }
    else {
        res.render('dashboard', { title: "Library Resource", err: "email or password does not exist", displayBooks: booksData });
    }
});
router.get('/signup', function (req, res) {
    res.render('registration', {
        title: "Library Resource Manager"
    });
});
router.post('/dashboard', function (req, res) {
    //if the user has signed up already return already a user
    //req.body
    if (req.body.firstname == "" || req.body.email == "" || req.body.password == "") {
        res.render("registration", { title: "Library Resource Manager", err: "Fill in all fields" });
    }
    else {
        //check if the users exist alrady in the database based on email address
        const checkDataBase = usersData.find((value) => value.email === req.body.email);
        if (checkDataBase) {
            //record exists
            res.render("login", { title: "Library Resource Manager" });
        }
        else {
            //register the user and grant them access to dashboard
            let IdPresent = usersData.map((value) => value.id);
            let IdPresentinData = Math.max(...IdPresent);
            if (!IdPresentinData) {
                IdPresentinData = 0;
            }
            const dataInput = {
                firstname: req.body.firstname,
                email: req.body.email,
                password: req.body.password,
                id: IdPresentinData + 1
            };
            // add to database
            usersData.push(dataInput);
            //write to the file
            fs_1.default.writeFileSync(usersDataPath, JSON.stringify(usersData), "utf-8");
            res.render("dashboard", { title: "Library Resource Manager", firstname: dataInput.firstname, displayBooks: booksData });
        }
    }
    //if the email is invalid,return enter a valid email
    //if signup is successful,go to the dashboard page
    res.render('dashboard', {
        title: "Library Resource Manager"
    });
});
router.get('/dashboard', function (req, res) {
    // res.render('dashboard', { title: "Library Resource Manager" })
    // res.send({
    //   cool: "COOL"
    // })
    res.render('dashboard', {
        title: "Library Resource Manager",
        displayBooks: booksData
    });
});
router.get('/registration', function (req, res) {
    res.render('registration', {
        title: "Library Resource Manager"
    });
});
router.post('/booksdisplay', function (req, res) {
    // res.render('booksdisplay', {
    //   title:"Library Resource Manager"
    // })
    //add new books to the book display
    //check if book already exists aleady and is it same title/same author
    //if book already exists,throw err and say book already exists
    //if book doesnt exist,add based on the form input
    //check if the book exist alrady in the database based on email address
    const checkDataBaseBook = booksData.find((value) => value.title === req.body.title);
    if (checkDataBaseBook) {
        //record exists
        res.render('login', { title: "Library Resource", err: "this book already exist" });
    }
    else {
        let IdPresentBook = booksData.map((value) => value.bookId);
        let IdPresentinDataBooks = Math.max(...IdPresentBook);
        if (!IdPresentinDataBooks) {
            IdPresentinDataBooks = 0;
        }
        const booksInput = {
            title: req.body.title,
            author: req.body.author,
            datePublished: req.body.datepublished,
            description: req.body.description,
            pageCount: req.body.pagecount,
            genre: req.body.bookgenre,
            bookId: IdPresentinDataBooks + 1,
            publisher: req.body.publishername,
        };
        booksData.push(booksInput);
        //write to the file
        fs_1.default.writeFileSync(booksDataPath, JSON.stringify(booksData), "utf-8");
        res.render("successpage", { title: "Library Resource Manager", bookTitle: req.body.title, message: "added successfully" });
    }
});
router.get('/successpage', (req, res) => {
    res.render('successpage');
});
//attach the content to the link
//update the content of the books
router.post("/updatebook", function (req, res) {
    //write ur steps here
    //get the particular content from the database using req.body.id
    const id = Number(req.body.id); //this is ur id
    //fetch the book using the id,loop through
    let record = booksData.find((each) => each.bookId === id);
    if (record) {
        const bookDetails = {
            title: req.body.title || (record === null || record === void 0 ? void 0 : record.title),
            author: req.body.author || (record === null || record === void 0 ? void 0 : record.author),
            datePublished: req.body.Date || (record === null || record === void 0 ? void 0 : record.datePublished),
            description: req.body.description || (record === null || record === void 0 ? void 0 : record.description),
            pageCount: req.body.pageCount || (record === null || record === void 0 ? void 0 : record.pageCount),
            genre: req.body.genre || (record === null || record === void 0 ? void 0 : record.genre),
            bookId: req.body.bookId || (record === null || record === void 0 ? void 0 : record.bookId),
            publisher: req.body.publisher || (record === null || record === void 0 ? void 0 : record.publisher)
        };
        const index = booksData.indexOf(record);
        booksData[index] = bookDetails;
    }
    fs_1.default.writeFileSync(booksDataPath, JSON.stringify(booksData), { encoding: "utf8", flag: "w" });
    res.render('dashboard', {
        title: "Library Resource Manager", displayBooks: booksData
    });
});
//
router.get("/updatebook", function (req, res) {
    res.render('login');
});
//view the content of the books
router.get("/book/:id", function (req, res) {
    //write ur steps here
    //get the particular content from the database using req.body.id
    const id = Number(req.params.id); //this is ur id
    //fetch the book using the id,loop through
    let record = booksData.find((each) => each.bookId === id);
    if (record) {
        res.render('bookview', {
            title: "Library Resource Manager", displayBook: record
        });
    }
    //pass in the new input
    //use fs file write sync to write into the file
});
//delete some contents
router.get("/delete/:id", function (req, res) {
    let deleteFromData = booksData.filter((value) => value.bookId != Number(req.params.id));
    //loop through
    //delete
    //update the database
    fs_1.default.writeFileSync(booksDataPath, JSON.stringify(deleteFromData), { encoding: "utf8", flag: "w" });
    res.render("deletesuccess");
});
exports.default = router;
