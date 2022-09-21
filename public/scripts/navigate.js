// static/scripts/navigate.js

class Navigate{
    constructor(){
        this.nav = {
            "Latest": 0,
            "Women": 0,
            "Men": 0,
            "Children": 0,
            "Shoes": 0,
        }
    }

    async getItems(page, ele){
        $(`.${ele}-nav .home`).attr('src','/images/loading.gif')

        if(page !== 0){
            this.nav[ele] += page
            if(this.nav[ele] < 0){
                this.nav[ele] = 0
            }
        }else{
            this.nav[ele] = page
        }

        const body = { page: this.nav[ele] }
        
        $.post(`/navigate/${ele}`, body, function(data, status){
            if(data.items.length === 0){
                navigate.nav[ele] -= 1
                $(`.${ele}-nav .home`).attr('src','/images/home.png')
            }else{
                navigate.generateHmtl(data.items, ele)
            }
        })
    }

    async generateHmtl(items, ele){
        let html = ''

        for(let post of items){
            html += `<div class="thumb">`
            html += `<p class="title"><a href="/post/${post.key}">${post.title}</a></p>`
            html += `<a class="wrapper" href="/post/${post.key}">`
            html += `<img src="${post.thumb}" />`
            if(post.videos){
                if((post.videos !== "")&&(post.videos !== "[]")){
                    html += `<img class="play-icon" src="/images/play.png" />`
                }
            }
            html += `</a>`
            html += `<p class="price">${"$"+post.price}</p>`
            html += `</div>`
        }
        $(`.${ele}`).html(html)
        $(`.${ele}-nav .home`).attr('src','/images/home.png')
    }
}

const navigate = new Navigate()