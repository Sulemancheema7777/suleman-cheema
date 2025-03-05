// getting refs for modal
const circle = document.querySelectorAll('.circle');
const modalOverlay = document.querySelector('.my-modal-overlay');
const modalContainer = document.querySelector('.my-modal-content');
const modalCloseButton = document.querySelector('.modal-close svg');

// getting select and radio buttons to handle onchange
let option1,option2,selectMain,option1Value,option2Value,form,productId,variantId;



// binding click event and opening the modal
if(circle){
    circle.forEach((plus)=>{
         plus.addEventListener('click',function(e){

            // getting data from the modal-content by passing the section poduct handle
            const productHandle = this.getAttribute('data-product-handle');
            productId = this.getAttribute('data-product-id');
            getData(productHandle);
      });
    });   
}
// function to handle fetch request and setting modal content
function getData(proHandle){
    fetch(`/products/${proHandle}?section_id=modal-content`)
    .then((response)=>{
        return response.text();
    })
    .then((data)=>{
      let parser = new DOMParser();
      let doc = parser.parseFromString(data,'text/html');
      let contentForModal = doc.querySelector('#shopify-section-modal-content')?
      doc.querySelector('#shopify-section-modal-content').innerHTML:'';
      modalContainer?modalContainer.innerHTML = contentForModal:'';
      //  open the modal
      openModal();
      bindingOptions();
    });
}
function bindingOptions(){
  // getting option1 and option here after the content is loaded
    option1 = document.querySelectorAll('.mc-color');
    option2 =  document.querySelectorAll('.mc-select');
    selectMain = document.querySelectorAll("select[name='id'] option");
    // on first load get the selected or checked value and also bind the onchange for future
    if(option1){
         option1.forEach((option1Item)=>{
            if(option1Item.checked){
                option1Value = option1Item.value;
            }
            option1Item.addEventListener('change',option1Handler);
         });
    }
    if(option2){
      option2.forEach((option2Item)=>{            
            option2Value = option2Item.value;
            option2Item.addEventListener('change',option2Handler);
         });
    }
    //adding submit event on form
    form = document.querySelector(`#product-form-${productId}`);
    form.addEventListener('submit',formSubmitHandler);
}
//update price on varaint change 
function updatePrice(){
    attributeSetter();
    let varPrice = document.querySelector("select[name='id'] option[selected='selected']").getAttribute('data-price');
    const regularPrice = document.querySelector('.mc-regular-price');
    regularPrice.innerHTML = varPrice;
}

//handler for form submit
function formSubmitHandler(e){
  e.preventDefault();
  attributeSetter();
  //get form data as we have changed the selected attribute
  let formData = new FormData(form);
  variantId = formData.get('id');
  // now we can add to cart as we have the variant id
  addToCart();
}
//add to cart
function addToCart(){
  let prodObject = {
    "items":[
        {
            "id":variantId,
            "quantity":1
        }
    ],
    sections: "cart-drawer,cart-icon-bubble"
  }
  if( (option1Value == 'black' || option1Value == 'Black') && (option2Value == 'm' || option2Value == 'M')){
    prodObject.items.push({"id":42018349908056,quantity:1});
  }

  fetch('/cart/add.js',{
   method:'POST',
   headers:{
    'Content-type':'application/json',
    'Accept':'application/json'
   },
   body:JSON.stringify(prodObject)
  }).then((response)=>{
    return response.json();
  }).then((data)=>{
     console.log(data);
     hideModal();
     cartRender(data);
  }).catch((error)=>{
    console.log('Error adding to cart', error);
  });
}

// sections ids and selectors that we need to re-render when adding to cart
function getSectionsToShow() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }


// function to re-render cart drawer
function cartRender(data){
  const sectionData = data.sections;
  getSectionsToShow().forEach((item)=>{
    if(item.selector){
        document.querySelector(item.selector).innerHTML = new DOMParser().parseFromString(sectionData[item.id],'text/html')
        .querySelector(item.selector).innerHTML;
    }
    else{
        document.getElementById(item.id).innerHTML = new DOMParser().parseFromString(sectionData[item.id],'text/html')
        .getElementById(`shopify-section-${item.id}`).innerHTML;
    }
  });
  document.querySelector('cart-drawer').classList.contains('is-empty') &&
  document.querySelector('cart-drawer').classList.remove('is-empty');
  const cartLink = document.querySelector('#cart-icon-bubble');
  cartLink.click();
}

// function will use option1Value and option2Value and compare it with the select
// that is hidden but contains the variant data
function attributeSetter(){
    selectMain.forEach((item)=>{
     if(item.text.includes(`${option1Value} / ${option2Value}`)){
        item.setAttribute('selected','selected');
     }
     else{
        item.removeAttribute('selected');
     }
    });
}


// handler for option1
function option1Handler(e){
  option1Value = e.target.value;
  updatePrice();
}

// handler for option2
function option2Handler(e){
    option2Value = e.target.value;
    updatePrice();
}

// binding click event and closing the modal
if(modalCloseButton){
    modalCloseButton.addEventListener('click',function(){
     hideModal();
    });
}
// open the modal
function openModal(){
  modalOverlay?modalOverlay.classList.add('active'):'';
  document.body.style.overflow='hidden';
}
// close the modal
function hideModal(){
    modalOverlay?modalOverlay.classList.remove('active'):'';
    document.body.style.overflow='auto';
}