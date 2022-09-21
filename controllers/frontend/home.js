// controllers/frontend/home.js

const postdb = require("../../models/post")


class Home{
    async shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async generateVideos(posts){
        const videos = []
        for(let post of posts){
            var playlist = post.videos
            await videos.push((JSON.parse(playlist))[0].id)
        }
        return videos
    }

    async getPage(req, res){
        const setup = await req.mysetup()
        setup.pageTitle = "Home"
        setup.route = "/"
        setup.type = "post"

        const query = {"categories?not_contains": "Shoes"}
        const queryWomen = {"categories?contains": "Women"}
        const queryMen = {"categories?contains": "Men"}
        const queryChildren = {"categories?contains": "Children"}
        const queryShoes = {"categories?contains": "Shoes"}

        const {posts, length} = await postdb.getPosts(req, setup.fpostLimit, query)
        setup.latestClothes = posts
        setup.count = length

        const womenObj = await postdb.getPosts(req, setup.fpostLimit, queryWomen)
        setup.womenClothes = womenObj.posts

        const menObj = await postdb.getPosts(req, setup.fpostLimit, queryMen)
        setup.menClothes = menObj.posts 

        const childrenObj = await postdb.getPosts(req, setup.fpostLimit, queryChildren)
        setup.childrenClothes = childrenObj.posts 

        const shoesObj = await postdb.getPosts(req, setup.fpostLimit, queryShoes)
        setup.shoes = shoesObj.posts 
        
        res.render("base", { data: setup })
    }

    async paginate(req, res){
        const setup = await req.mysetup()
        const { posts, length } = await postdb.paginate(req, setup.fpostLimit)
        setup.count = length
        setup.items = posts
        setup.page = parseInt(req.body.page) + 1
        
        res.json(setup)
    }

    async navigate(req, res){
        const setup = await req.mysetup()
        
        const query = {
            "Latest": {"categories?not_contains": "Shoes"},
            "Women": {"categories?contains": "Women"},
            "Men": {"categories?contains": "Men"},
            "Children": {"categories?contains": "Children"},
            "Shoes": {"categories?contains": "Shoes"},
        }

        const label = req.params.label

        const {posts, length} = await postdb.navigate(req, setup.fpostLimit, query[label])
        
        setup.count = length
        setup.items = posts
        res.json(setup)
    }

    async getRandomItems(req, res){
        const setup = await req.mysetup()

        const query = {"bookCover?ne": null, "bookCover?ne": ""}
        setup.randomBooks = await bookdb.getRandomBooks(req, setup.fpostLimit, query)
        res.json(setup)
    }
}


module.exports = new Home()