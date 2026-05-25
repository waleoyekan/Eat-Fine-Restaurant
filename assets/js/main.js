/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

if(navToggle){
   navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
}
if(navClose){
   navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
   link.addEventListener('click', () => navMenu.classList.remove('show-menu'));
});

/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
   const header = document.getElementById('header');
   window.scrollY >= 50 ? header.classList.add('shadow-header') : header.classList.remove('shadow-header');
};
window.addEventListener('scroll', shadowHeader);

/*=============== SWIPER REVIEWS ===============*/
const swiperReviews = new Swiper('.reviews-swiper', {
   loop: true,
   spaceBetween: 30,
   grabCursor: true,
   pagination: {
      el: '.swiper-pagination',
      clickable: true,
   },
   autoplay: {
      delay: 4000,
      disableOnInteraction: false,
   },
});

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
   const scrollUpEl = document.getElementById('scroll-up');
   window.scrollY >= 350 ? scrollUpEl.classList.add('show-scroll') : scrollUpEl.classList.remove('show-scroll');
};
window.addEventListener('scroll', scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');
const scrollActive = () => {
   const scrollDown = window.scrollY;
   sections.forEach(section => {
      const sectionHeight = section.offsetHeight,
            sectionTop = section.offsetTop - 58,
            sectionId = section.getAttribute('id'),
            link = document.querySelector('.nav__link[href*=' + sectionId + ']');
      if(link){
         if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            link.classList.add('active-link');
         } else {
            link.classList.remove('active-link');
         }
      }
   });
};
window.addEventListener('scroll', scrollActive);

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-line';

const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

if(selectedTheme){
   document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
   themeButton.classList[selectedIcon === 'ri-sun-line' ? 'add' : 'remove'](iconTheme);
}

themeButton.addEventListener('click', () => {
   document.body.classList.toggle(darkTheme);
   themeButton.classList.toggle(iconTheme);
   localStorage.setItem('selected-theme', getCurrentTheme());
   localStorage.setItem('selected-icon', getCurrentIcon());
});

/*=============== MENU FILTER ===============*/
const filterBtns = document.querySelectorAll('.menu__filter');
const menuCards = document.querySelectorAll('.menu__card');

filterBtns.forEach(btn => {
   btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      menuCards.forEach(card => {
         if(filter === 'all' || card.dataset.category === filter){
            card.classList.remove('hidden');
         } else {
            card.classList.add('hidden');
         }
      });
   });
});

/*=============== CART SYSTEM ===============*/
let cart = [];

const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartIcon = document.getElementById('cart-icon');
const cartClose = document.getElementById('cart-close');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const cartFooter = document.getElementById('cart-footer');
const checkoutBtn = document.getElementById('checkout-btn');

// Open/close cart
cartIcon.addEventListener('click', () => {
   cartSidebar.classList.add('show-cart');
   cartOverlay.classList.add('show-cart');
});
const closeCart = () => {
   cartSidebar.classList.remove('show-cart');
   cartOverlay.classList.remove('show-cart');
};
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Add to cart buttons
document.querySelectorAll('.menu__add').forEach(btn => {
   btn.addEventListener('click', (e) => {
      const card = e.target.closest('.menu__card');
      const name = card.dataset.name;
      const price = parseInt(card.dataset.price);
      const existing = cart.find(item => item.name === name);
      if(existing){
         existing.qty++;
      } else {
         cart.push({ name, price, qty: 1 });
      }
      updateCart();
      showToast(`${name} added to cart!`);
   });
});

function updateCart(){
   const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
   cartCountEl.textContent = totalItems;

   if(cart.length === 0){
      cartItemsEl.innerHTML = '<p class="cart__empty">Your cart is empty</p>';
      cartFooter.style.display = 'none';
      return;
   }

   cartFooter.style.display = 'block';
   let html = '';
   let total = 0;
   cart.forEach((item, index) => {
      total += item.price * item.qty;
      html += `
         <div class="cart-item">
            <div>
               <p class="cart-item__name">${item.name}</p>
               <p class="cart-item__price">₦${(item.price * item.qty).toLocaleString()}</p>
            </div>
            <div class="cart-item__controls">
               <button class="cart-item__btn" onclick="changeQty(${index}, -1)">-</button>
               <span class="cart-item__qty">${item.qty}</span>
               <button class="cart-item__btn" onclick="changeQty(${index}, 1)">+</button>
               <button class="cart-item__remove" onclick="removeItem(${index})"><i class="ri-delete-bin-line"></i></button>
            </div>
         </div>
      `;
   });
   cartItemsEl.innerHTML = html;
   cartTotalEl.textContent = '₦' + total.toLocaleString();
}

function changeQty(index, delta){
   cart[index].qty += delta;
   if(cart[index].qty <= 0) cart.splice(index, 1);
   updateCart();
}

function removeItem(index){
   cart.splice(index, 1);
   updateCart();
}

// WhatsApp checkout
checkoutBtn.addEventListener('click', () => {
   if(cart.length === 0) return;
   let message = '🍲 *New Order from Eat Fine*\n\n';
   let total = 0;
   cart.forEach(item => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      message += `• ${item.name} x${item.qty} — ₦${subtotal.toLocaleString()}\n`;
   });
   message += `\n💰 *Total: ₦${total.toLocaleString()}*`;
   message += '\n\n📍 Please share your delivery address.';
   const encoded = encodeURIComponent(message);
   window.open(`https://api.whatsapp.com/send?phone=2348064494713&text=${encoded}`, '_blank');
});

/*=============== TOAST NOTIFICATION ===============*/
function showToast(msg){
   let toast = document.querySelector('.toast');
   if(!toast){
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
   }
   toast.innerHTML = `<i class="ri-check-line"></i> ${msg}`;
   toast.classList.add('show');
   setTimeout(() => toast.classList.remove('show'), 2500);
}

/*=============== NEWSLETTER ===============*/
const newsletterForm = document.getElementById('newsletter-form');
if(newsletterForm){
   newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing! 🎉');
      newsletterForm.reset();
   });
}

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
   origin: 'top',
   distance: '60px',
   duration: 2000,
   delay: 300,
   reset: false,
});

sr.reveal('.home__data', { origin: 'left' });
sr.reveal('.home__image', { origin: 'right' });
sr.reveal('.home__info', { origin: 'bottom', delay: 500 });
sr.reveal('.section__subtitle', {});
sr.reveal('.section__title', { delay: 100 });
sr.reveal('.service__card', { interval: 200 });
sr.reveal('.menu__filters', {});
sr.reveal('.menu__card', { interval: 150, origin: 'bottom' });
sr.reveal('.reviews__container', { origin: 'bottom' });
sr.reveal('.app__data', { origin: 'left' });
sr.reveal('.app__image', { origin: 'right' });
sr.reveal('.map__content', { origin: 'left' });
sr.reveal('.map__info-container', { origin: 'right' });
sr.reveal('.footer__brand', { origin: 'left' });
sr.reveal('.footer__links-group', { origin: 'right' });
