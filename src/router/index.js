import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView        from '@/views/HomeView.vue'
import MenuView        from '@/views/MenuView.vue'
import CartView        from '@/views/CartView.vue'
import ContactView     from '@/views/ContactView.vue'
import AboutView       from '@/views/AboutView.vue'
import LoginView       from '@/views/LoginView.vue'
import OrderSuccessView from '@/views/OrderSuccessView.vue'
import DealsView       from '@/views/DealsView.vue'
import AdminView       from '@/views/AdminView.vue'

const routes = [
  { path: '/',        name: 'home',          component: HomeView },
  { path: '/menu',    name: 'menu',          component: MenuView },
  { path: '/cart',    name: 'cart',          component: CartView },
  { path: '/contact', name: 'contact',       component: ContactView },
  { path: '/about',   name: 'about',         component: AboutView },
  { path: '/login',   name: 'login',         component: LoginView },
  { path: '/deals',   name: 'deals',         component: DealsView },
  { path: '/admin',   name: 'admin',         component: AdminView },
  { path: '/order-success', name: 'order-success', component: OrderSuccessView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

export default router

