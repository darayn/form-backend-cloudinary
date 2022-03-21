const express = require('express')
const app = express();
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    // cloud_name: process.env.CLOUD_NAME
    cloud_name: "lco-pro-backend",
    api_key : "287992533756971",
    api_secret: "ZcBmhUYNXO4x-uLrTVbVlZseMwM"

})
app.set('view engine', 'ejs');

//middleware

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))

app.get("/myget", (req, res) =>{
    console.log(req.body);

    res.send(req.body)
})

app.post("/mypost", async (req, res) =>{
    console.log(req.body);
    console.log(req.files);

    let results = [];
    let imageArray = []
    // ## case for multiple img

    if(req.files){
        for (let index = 0; index < req.files.samplefile.length; index++) {
           let result = await cloudinary.uploader.upload(req.files.samplefile[index].tempFilePath, {
               folder: "users"
           })
           imageArray.push({
               public_id: result.public_id,
               secure_url : result.secure_url
           })
           results.push(result)
        }
    }

    // ## case for single img usecase
    // let file = req.files.samplefile

    // result = await cloudinary.uploader.upload(file.tempFilePath, {
    //     folder: 'users'
    // })
    console.log(results);

    details = {
        firstname: req.body.firstname,
        lastname: req.body.lastname, 
        results,
        imageArray
    }
    console.log(details);
    res.send(details)
})


app.get("/mygetform", (req, res)=>{
    res.render("getForm")
})
app.get("/mypostForm", (req, res)=>{
    res.render("postForm")
})



app.listen(4000, () => console.log(`server is running on 4000`))


