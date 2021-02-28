function validate(el){
  if(el == null) return
}
const link = window.location.href
if (link.includes("recipes")) {

  function addIngredient() {
    const ingredients = document.querySelector("#ingredients");

    const fieldContainer = document.querySelectorAll(".ingredient");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
  }

  function addPrepare() {
    const prepare = document.querySelector("#prepare");

    const fieldContainer = document.querySelectorAll(".preparation");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    prepare.appendChild(newField);
  }




  const addingredient = document.querySelector(".add-ingredient")
  let verify = validate(addIngredient)
  if(verify != undefined)
    addingredient.addEventListener("click", addIngredient);
    

  const buttonPrepare = document.querySelector('#button_prepare')
  verify = validate(buttonPrepare)
  if(verify != undefined)
    buttonPrepare.addEventListener('click', addPrepare)
    

}


