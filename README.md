# YelpCamp

## Intro
Full stack web app where users can create campgrounds and make comments. 
[View online](https://fathomless-fortress-33869.herokuapp.com/)

## Tech Used
HTML5, CSS3, JavaScript, Bootstrap 4, EJS, Node, Express JS, MongoDB, Mongoose, Authentication, Git, Heroku

## Features
-	User authentication via passport (local strategy) 
-	Image upload with multer and cloudinary
-	Password reset with nodemailer
-	Fuzzy search, flash messages with connect-flash, time since created with moment JS, etc

## Screenshots
![alt text](screenshots/index.JPG)
![alt text](screenshots/camp_show.JPG)
![alt text](screenshots/camp_new.JPG)
![alt text](screenshots/comment_new.JPG)
![alt text](screenshots/search.JPG)
![alt text](screenshots/signup.JPG)
![alt text](screenshots/login.JPG)
![alt text](screenshots/forgot.JPG)
![alt text](screenshots/dashboard.JPG)

## How to Use?
process.env to set:
 - CLOUDINARY_API_KEY, which is cloudinary API key
 - CLOUDINARY_API_SECRET, which is cloudinary API secret
 - GMAILPW, which is the gmail account password 
 - DBURL, which is the database URL 

Nodemailer will require your gmail address and password. Code in routes/index.js: 

```
var smtpTransport = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'theyelpcamp.dev@gmail.com',  //please change to your email address
      pass: process.env.GMAILPW
    }
});
```


(If you like it, don't be shy to click the ★ Star button ;o)
