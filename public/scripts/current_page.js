const currentPage = location.pathname
const links = document.querySelectorAll("header #links a")
for(let link of links){
    if(currentPage.includes(link.getAttribute('href'))){
        if(currentPage.includes("admin")){
            link.classList.add('actived_admin')
            
        }else{
            
            link.classList.add('actived')
        }
    }
}

