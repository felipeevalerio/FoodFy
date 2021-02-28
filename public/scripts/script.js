const PhotosUpload = {
    input:"",
    uploadLimit: 5,
    preview:document.querySelector('#photos_preview'),
    files:[],
    handleFileInput(event){
        const {files:fileList} = event.target //input
        PhotosUpload.input = event.target
        
        if(PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            const reader = new FileReader()

            PhotosUpload.files.push(file)

            reader.onload = ()=>{
                const image = new Image()
                image.src = String(reader.result)

                const container = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(container)
            }

            reader.readAsDataURL(file)
        })
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    getContainer(image){
        const container = document.createElement('div')
        container.classList.add('photo')
        container.onclick = PhotosUpload.removePhoto

        container.appendChild(image)
        container.appendChild(PhotosUpload.getRemoveButton())

        return container
    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        
        return dataTransfer.files
    },
    hasLimit(event){
        const {uploadLimit,input,preview} = PhotosUpload
        const {files:fileList} = input 

        if (fileList.length > uploadLimit){
            alert(`Envie No Máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item =>{
            if(item.classList && item.classList.value == "photo") {
                photosDiv.push(item)
            }
        })

        const totalPhotos = photosDiv.length + fileList.length
        if(totalPhotos > uploadLimit){
            alert(`Você atingiu o limite máximo de ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }
    

        return false
    },
    getRemoveButton(){
        const button = document.createElement("i")
        button.classList.add("material-icons")
        button.innerHTML = "close"
        return button
    },
    removePhoto(event){
        const photoDiv = event.target.parentNode // <div class="photo">
        const photoArray = Array.from(PhotosUpload.preview.children)
        const index = photoArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index,1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()

    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode

        if(photoDiv.id){
            const removed_files = document.querySelector("input[name='removed_files']")
            if(removed_files){
                console.log(photoDiv.id)
                removed_files.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}
const PhotosUploadChefs = {
    input:"",
    uploadLimit: 1,
    preview:document.querySelector('#photos_preview'),
    files:[],
    handleFileInput(event){
        const {files:fileList} = event.target //input
        PhotosUploadChefs.input = event.target

        if(PhotosUploadChefs.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            const reader = new FileReader()

            PhotosUploadChefs.files.push(file)

            reader.onload = ()=>{
                const image = new Image()
                image.src = String(reader.result)

                const container = PhotosUploadChefs.getContainer(image)
                PhotosUploadChefs.preview.appendChild(container)
            }

            reader.readAsDataURL(file)
        })
        PhotosUploadChefs.input.files = PhotosUploadChefs.getAllFiles()
    },
    getContainer(image){
        const container = document.createElement('div')
        container.classList.add('photo')
        container.onclick = PhotosUploadChefs.removePhoto

        container.appendChild(image)
        container.appendChild(PhotosUploadChefs.getRemoveButton())

        return container
    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        PhotosUploadChefs.files.forEach(file => dataTransfer.items.add(file))
        
        return dataTransfer.files
    },
    hasLimit(event){
        const {uploadLimit,input,preview} = PhotosUploadChefs
        const {files:fileList} = input 

        if (fileList.length > uploadLimit){
            alert(`Envie No Máximo ${uploadLimit} foto`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item =>{
            if(item.classList && item.classList.value == "photo") {
                photosDiv.push(item)
            }
        })

        const totalPhotos = photosDiv.length + fileList.length
        if(totalPhotos > uploadLimit){
            alert(`Você atingiu o limite máximo de ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }
    

        return false
    },
    getRemoveButton(){
        const button = document.createElement("i")
        button.classList.add("material-icons")
        button.innerHTML = "close"
        return button
    },
    removePhoto(event){
        const photoDiv = event.target.parentNode // <div class="photo">
        const photoArray = Array.from(PhotosUploadChefs.preview.children) //
        const index = photoArray.indexOf(photoDiv)

        PhotosUploadChefs.files.splice(index,1)
        PhotosUploadChefs.input.files = PhotosUploadChefs.getAllFiles()

        photoDiv.remove()

    },
    removeOldPhoto(event){
        const photoDiv = document.querySelector(".photo")
        photoDiv.addEventListener("click",()=>{
            if(photoDiv.id){
                const removed_files = document.querySelector("input[name='removed_files']")
                if(removed_files){
                    removed_files.value += `${photoDiv.id}`
                }
            }
        })
        photoDiv.remove()

    }
}
function alertDelete(){
    const formDelete = document.querySelector('.form_delete')
    formDelete.addEventListener('submit',(event)=>{
        const confirmation = confirm("Deseja Deletar?")
        if(!confirmation){
            event.preventDefault()
        }
    })
}
const ImageGallery = {
    highlight:document.querySelector(".image > img"),
    previews:document.querySelectorAll(".gallery_preview img"),
    setImage(event){
        const {target} = event

        ImageGallery.previews.forEach(image => image.classList.remove("active"))

        ImageGallery.highlight.src = target.src

        target.classList.add("active")
    }
}

const Mask = {
    apply(input,func){
        setTimeout(()=>{
            input.value = Mask[func](input.value)
        },1)
    }
}

const Validate = {
    apply(input,func){
        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if(results.error){
            Validate.displayError(input,results.error)
        }
    },
    displayError(input,error){
        const div = document.createElement("div")
        div.classList.add("error")
        div.innerHTML = error
        input.parentNode.appendChild(div) // .item 

        input.focus()
    },
    clearErrors(input){
        const errorDiv = input.parentNode.querySelector(".error")
        if(errorDiv)
            errorDiv.remove()
    },
    isEmail(value){
        let error = null

        const mailFormat = /^\w+([\. -]?\w+)*@\w+([\. -]?\w+)*(\.\w{2,3})+$/

        if(!value.match(mailFormat))
            error ="Email Inválido"

        return {
            error,
            value
        }
    }
}

window.onbeforeunload = ()=>{
    window.scrollTo(0,0)
}

let show = true

const menuSection = document.querySelector(".menu-section")
const menuToggle = document.querySelector(".menu-toggle")

menuToggle.addEventListener("click",()=>{
    document.body.style.overflowY = show ? "hidden" : "visible"
    menuSection.classList.toggle("on",show)
    show = !show

})
