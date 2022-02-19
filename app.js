const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
var multer=require("multer");
const path=require("path");
const fs = require("fs");

const {exec} = require('child_process')
const websiteUrl = 'http://localhost:3000/portfolio';

const app=express();

const client={};

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

var multipleUpload=upload.fields([{name: 'profile-file'},{name: 'resume'},{name: 'projectImg1'},{name: 'projectImg2'},{name: 'projectImg3'}]);

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/test",(req,res)=>{
    res.render("test.ejs");
});

app.get("/compose",(req,res)=>{
    res.render("compose.ejs");
});

app.get("/portfolio",(req,res)=>{
    res.render("portfolio.ejs",{clientProjectTitle2: client.projectTitle2,clientProjectTitle1: client.projectTitle1,clientProjectImg2: client.projectImage2,clientProjectImg1: client.projectImage1,clientProject2:client.project2,clientProject1:client.project1,clientGithub:client.github,clientResume:client.resumeFile ,clientName:client.name, clientDeveloper:client.developer, clientInfo:client.intro, clientSkill1:client.skill1, clientSkill2:client.skill2, clientSkill3:client.skill3, clientSkill4:client.skill4, clientCallInfo:client.callInfo, clientAddress:client.address, clientEmail:client.mail, clientCountry:client.country, clientLinkedin:client.linkedin, clientImage: client.profileImage});
});

app.post("/compose", multipleUpload,(req,res)=>{
    client.name=req.body.name;
    client.developer=req.body.developer;
    client.country=req.body.country;
    client.intro=req.body.intro;
    client.skill1=req.body.skill1;
    client.skill2=req.body.skill2;
    client.skill3=req.body.skill3;
    client.skill4=req.body.skill4;
    client.address=req.body.address;
    client.callInfo=req.body.callInfo;
    client.mail=req.body.mail;
    client.linkedin=req.body.linkedin;
    client.github=req.body.github;
    client.project1=req.body.project1;
    client.project2=req.body.project2;
    client.projectTitle1=req.body.projectTitle1;
    client.projectTitle2=req.body.projectTitle2;
    if(req.files){
        console.log("Files Uploaded");
        const x=Object.values(req.files);
        client.profileImage=x[0][0].path;
        client.projectImage1=x[1][0].path;
        client.projectImage2=x[2][0].path;
        client.resumeFile=x[3][0].path;
    }
    res.redirect("/portfolio");
});

app.get("/download",(req,res)=>{
    exec(`node-site-downloader download -s ${websiteUrl} -d ${websiteUrl} -v --include-images -o websiteStaticFile`,(err,stdout,stderr) =>{
        if(err){
        console.log(err);
        }
    });
    
    res.redirect("/portfolio");
});

app.listen(3000,()=>console.log("Server started at 3000"));