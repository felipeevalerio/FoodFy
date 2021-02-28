if(window.location.href.includes("recipes")){
    const ingredients = document.querySelector('.ingredientsP')
    const prepare = document.querySelector('.prepareP')
    const info = document.querySelector('.infoP')
    
    // Parágrafos
    
    const paragraphIngredients = document.querySelector('#pIngredients')
    const paragraphPrepare = document.querySelector('#pPrepare')
    const paragraphInfo = document.querySelector('#pInformation')
    
    //Ingredientes Botão
    if(paragraphIngredients)
        paragraphIngredients.addEventListener('click',()=>{
            ingredients.classList.toggle('hidden')
            verifyIngredients()
    })
    
    //Prepare Botão
    if(paragraphPrepare)
        paragraphPrepare.addEventListener('click',()=>{
            prepare.classList.toggle('hidden')
            verifyPrepare()
            
        })
    
    //Info Botão
    if(paragraphInfo)
        paragraphInfo.addEventListener('click',()=>{
            info.classList.toggle('hidden')
            verifyInfo()
            
        })
    
    
    //FUNÇÕES
    
    function verifyIngredients(){
        if(ingredients.classList.contains('hidden')){
    
            paragraphIngredients.innerHTML = `<p>MOSTRAR</p>`
        }
        else{
    
            paragraphIngredients.innerHTML = `<p>ESCONDER</p>`
        }
    }
    
    function verifyPrepare(){
        if(prepare.classList.contains('hidden')){
            
            paragraphPrepare.innerHTML = `<p>MOSTRAR</p>`
        }
        else{
    
            paragraphPrepare.innerHTML = `<p>ESCONDER</p>`
        }
    }
    function verifyInfo(){
        if(info.classList.contains('hidden')){
    
            paragraphInfo.innerHTML = `<p id="pInformation" class="mostrar">MOSTRAR</p>`
        }
        else{
    
            paragraphInfo.innerHTML = `<p id="pInformation" class="mostrar">ESCONDER</p>`
        }
    }
}


