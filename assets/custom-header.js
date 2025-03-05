// getting ref for mobile menu, open icon and close icon 
const openIcon = document.querySelector('.open-icon');
const closeIcon = document.querySelector('.close-icon');
const mobileMenu = document.querySelector('.mobile-menu');

if(openIcon){
    openIcon.addEventListener('click',function(e){
       e.stopPropagation();
       this.style.display='none';   // hide hamburger icon
       closeIcon?closeIcon.style.display='block':''; // show close icon
       mobileMenu?mobileMenu.classList.add('active'):''; // show menu
       document.body.style.overflow='hidden'; //prevent scrolling when menu is open
    });
}
if(closeIcon){
    closeIcon.addEventListener('click',function(e){
       e.stopPropagation();
       this.style.display='none';   // hide hamburger icon
       openIcon?openIcon.style.display='block':''; // show close icon
       mobileMenu?mobileMenu.classList.remove('active'):''; // show menu
       document.body.style.overflow='auto'; //prevent scrolling when menu is open
    });
}