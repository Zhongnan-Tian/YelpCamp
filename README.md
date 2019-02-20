# YelpCamp
Full stack web app where users can create campgrounds and make comments. 
[View online](https://fathomless-fortress-33869.herokuapp.com/)

## Tech Used
HTML5, CSS3, JavaScript, Bootstrap 4, EJS, Node, Express JS, MongoDB, Mongoose, Authentication, Git, Heroku

## Features
-	User authentication via passport (local strategy) 
-	Image upload with multer and cloudinary
-	Password reset with nodemailer
-	Fuzzy search, image animation on landing page, flash messages with connect-flash, time since created with moment JS, etc

## Screenshots
Image animation on landing page:
![alt text](screenshots/firstpage.JPG)

Home page: 
![alt text](screenshots/index.JPG)

Campground show page: 
![alt text](screenshots/camp_show.JPG)

Campground new page:
![alt text](screenshots/camp_new.JPG)

Comment new page: 
![alt text](screenshots/comment_new.JPG)

Search bar: 
![alt text](screenshots/search.JPG)

Sin up: 
![alt text](screenshots/signup.JPG)

Log in: 
![alt text](screenshots/login.JPG)

Password reset: 
![alt text](screenshots/forgot.JPG)

User dashboard: 
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
