const express = require('express')
const hbs = require('hbs')
const path = require('path')
const postModel = require('./model/postModel')
require('./db/mongoose')

const app = express()

const publicDirectoryPath = path.join(__dirname, "./public");
const viewPath = path.join(__dirname, "./templates/views");
const partialPath = path.join(__dirname, "./templates/partials")


app.set('view engine', 'hbs')
app.set('views', viewPath);
hbs.registerPartials(partialPath);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(express.urlencoded({ extended : true }))


app.get('/', async (req,res)=>{
    try{
        const Posts = await postModel.find()

        const posts = Posts.map((post)=> {
            let P = post.toObject()
            P.createdAt = post.createdAt.toLocaleDateString() + " " + post.createdAt.toLocaleTimeString()
            return P
        })

        console.log(posts[0])
     
        res.render('home',{
            'title' : 'Home',
            'homeStartingContent' : homeStartingContent,
            'posts' : posts,
        })
    }catch(e){
        console.log(e)
    }
    
})

app.get('/about', (req,res)=>{
    res.render('about',{
        'title' : 'About',
        'aboutContent' : aboutContent
    })
})

app.get('/contact',(req,res)=>{
    res.render('contact',{
        'title' : 'Contact',
        'contactContent' : contactContent
    })
})

app.get('/compose',(req,res)=>{

    res.render('compose', {
        'title' : 'Compose',
    })
})

app.post('/compose', async (req,res)=>{

    try{
        const post = new postModel({
            'title' : req.body.postTitle,
            'content' : req.body.postBody
        })
        await post.save()
        res.redirect('/')
    }catch(e){
        console.log(e)
    }

    
})

app.get('/posts/:query', async (req,res)=>{
    const query = req.params.query.toLowerCase().replace(' ','-')

    try{
        const posts = await postModel.find()

        const isMatch = posts.find((post) => post.title.toLowerCase().replace(' ','-') === query)

        if(!isMatch){
            res.send("No record found")
        }
    
        res.render('post',{
            'title' : isMatch.title,
            'body'  : isMatch.content 
        })

    }catch(e){
        console.log(e)
    }


    
})

app.get('/posts/api/:query', async(req,res)=>{

    const query = req.params.query
    await postModel.findOneAndDelete({ 'title' : query })
    res.redirect('/')

})

app.listen(3000,()=>{
    console.log("Server running on port 3000")
})