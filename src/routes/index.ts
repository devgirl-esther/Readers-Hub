import express, {Response, Request, NextFunction} from  "express";
import fs from "fs";
import path from 'path';
const router = express.Router();

//create a variable and store the users information  and books path inside.
const usersDataPath = path.join(__dirname, "../../database/users.json");

interface usersDataType{
  firstname:string;
  email:string;
  password:string;
  id:number
  }

interface booksDataType{
  title:string,
  author:string,
  datePublished:Date,
  description:string,
  pageCount:number,
  genre:string,
  bookId:number,
  publisher:string
}

let usersData:usersDataType[];
let booksData:booksDataType[];
let booksDataPath = path.join(__dirname, "../../database/books.json");
// let booksDataPath = "/Users/decagon/Documents/GitHub/week-6-task-devgirl-esther/database/books.json";

//try--catch to account for if the users path doesnt exist already,so it can be created by the read write.
try {
  usersData = JSON.parse(fs.readFileSync(usersDataPath,"utf-8"))
} catch (error) {
  fs.writeFile(usersDataPath,JSON.stringify([]),()=> {
    usersData = JSON.parse(fs.readFileSync(usersDataPath,"utf-8"))
  })
}
//TRY--catch to account for if the books path doesnt exist already,so it can be created by the read write.
try {
  booksData =JSON.parse(fs.readFileSync(booksDataPath,"utf-8"))
} catch (error) {
  fs.writeFile(booksDataPath,JSON.stringify([]),()=> {
    booksData = JSON.parse(fs.readFileSync(booksDataPath,"utf-8"))
  })
}

// {
//   firstname:"esther"
//   email:"starexedoho@gmail.com"
//   password:"qwertyyy"
//   id:1
// }



/* GET home page. */
router.get('/', function(req:Request, res:Response, next:NextFunction) {
  res.render('index', { title: 'Library Resource Manager' });
  // res.json( "Hello World!")
});

/* GET login page. */
router.get('/login', function(req:Request, res:Response, next:NextFunction) {
  res.render('login', { title: 'Library Resource Manager' });
  // res.json( "Hello World!")
});

router.post('/login',function(req:Request, res:Response, next:NextFunction){
  //verify if email and password exists in database and is valid
  const verifyEmail = usersData.find((value)=> value.email === req.body.email)
  // console.log(verifyEmail);
  //id email exists and is valid,please take to the dashboard
  if (verifyEmail){
    if (req.body.password === verifyEmail.password) {
      res.render("dashboard",{
       title:"Library Resource Manager", 
        firstname:verifyEmail.firstname,
        displayBooks: booksData
      })
    }else{
      res.render('login',{title:"Library Resource Manager",err:"Please input correct password."})
    }

    
  }else{
    res.render('dashboard',{title:"Library Resource",err:"email or password does not exist", displayBooks: booksData})
  }
  
})

router.get('/signup',function(req:Request, res:Response){
  res.render('registration' ,{
    title:"Library Resource Manager"
  })

});

router.post('/dashboard',function(req:Request, res:Response){
  //if the user has signed up already return already a user
  //req.body
  
  if (req.body.firstname == "" || req.body.email == "" || req.body.password == "" ){
    res.render("registration", {title : "Library Resource Manager", err:"Fill in all fields"})
  }else{ 
   //check if the users exist alrady in the database based on email address
    const checkDataBase = usersData.find((value) => value.email === req.body.email)
    if (checkDataBase){
        //record exists
        res.render("login",{title:"Library Resource Manager"})
    }else{
      //register the user and grant them access to dashboard
      let IdPresent = usersData.map((value) => value.id)
      let IdPresentinData = Math.max(...IdPresent)
      if (!IdPresentinData){
        IdPresentinData = 0
      }
      const dataInput = {
        firstname:req.body.firstname,
        email:req.body.email,
        password:req.body.password,
        id:IdPresentinData + 1


      }
      // add to database
      usersData.push(dataInput)
      //write to the file
      fs.writeFileSync(usersDataPath,JSON.stringify(usersData), "utf-8")
      res.render("dashboard", {title:"Library Resource Manager", firstname:dataInput.firstname, displayBooks: booksData})
    }
  }
  

  //if the email is invalid,return enter a valid email
  //if signup is successful,go to the dashboard page
  res.render('dashboard',{
   title:"Library Resource Manager" 
  })
})



router.get('/dashboard',function(req:Request, res:Response){
  // res.render('dashboard', { title: "Library Resource Manager" })
  // res.send({
  //   cool: "COOL"
  // })
  res.render('dashboard' ,{
    title:"Library Resource Manager",
    displayBooks: booksData
  })
})

router.get('/registration',function(req:Request, res:Response){
  res.render('registration',{
    title:"Library Resource Manager"
  })
})

router.post('/booksdisplay', function(req:Request, res:Response){

  // res.render('booksdisplay', {
  //   title:"Library Resource Manager"
  // })



//add new books to the book display

 //check if book already exists aleady and is it same title/same author

 //if book already exists,throw err and say book already exists

//if book doesnt exist,add based on the form input
 //check if the book exist alrady in the database based on email address
  const checkDataBaseBook = booksData.find((value) => value.title === req.body.title)
  
  if (checkDataBaseBook){
      //record exists
      res.render('login',{title:"Library Resource",err:"this book already exist"})
  }else{
    
    let IdPresentBook = booksData.map((value) => value.bookId)
    let IdPresentinDataBooks = Math.max(...IdPresentBook)
    if (!IdPresentinDataBooks){
      IdPresentinDataBooks = 0
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

      }



    booksData.push(booksInput) 
    //write to the file
    fs.writeFileSync(booksDataPath,JSON.stringify(booksData), "utf-8")
    res.render("successpage", {title:"Library Resource Manager", bookTitle: req.body.title, message: "added successfully" }) 
  }

  })

  router.get('/successpage', (req:Request, res:Response)=>{
    res.render('successpage');
  })

//attach the content to the link

//update the content of the books
  router.post("/updatebook", function(req:Request,res:Response){
    //write ur steps here
    //get the particular content from the database using req.body.id
    const id:number = Number(req.body.id) //this is ur id
    //fetch the book using the id,loop through
    let record  = booksData.find((each:booksDataType) => each.bookId === id)
    if(record){
      const bookDetails = {
        title: req.body.title || record?.title,
        author: req.body.author || record?.author,
        datePublished: req.body.Date || record?.datePublished,
        description: req.body.description || record?.description,
        pageCount: req.body.pageCount || record?.pageCount,
        genre: req.body.genre || record?.genre,
        bookId: req.body.bookId || record?.bookId,
        publisher: req.body.publisher || record?.publisher
    }
      const index = booksData.indexOf(record);
      booksData[index] = bookDetails
    }
    fs.writeFileSync(booksDataPath, JSON.stringify(booksData),{encoding: "utf8", flag: "w"});
    res.render('dashboard',{
      title:"Library Resource Manager",displayBooks:booksData
    })
  })
  //
  router.get("/updatebook",function(req:Request,res:Response){
    res.render('login')
  })
   
  
//view the content of the books
  router.get("/book/:id", function(req:Request,res:Response){
    //write ur steps here
    //get the particular content from the database using req.body.id
    const id:number = Number(req.params.id) //this is ur id
    //fetch the book using the id,loop through
    let record  = booksData.find((each:booksDataType) => each.bookId === id)
    if(record){
      res.render('bookview',{
        title: "Library Resource Manager", displayBook: record
      })
    }


    //pass in the new input
    //use fs file write sync to write into the file
  })
//delete some contents
  router.get("/delete/:id",function(req:Request,res:Response){
    let deleteFromData = booksData.filter((value) => value.bookId != Number(req.params.id ))
  
    //loop through
    //delete
    //update the database

    fs.writeFileSync(booksDataPath, JSON.stringify(deleteFromData),{encoding: "utf8", flag: "w"});
    res.render("dashboard")
  })
  
  
  
export default router;
