
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PageHome.vue'),
        name: 'Home'
      },
      { 
        path: '/about',
        component: () => import('pages/PageAbout.vue'),
        name: 'About'
      },
      { 
        path: '/hashtag/:hashtag',
        component: () => import('pages/PageHashtag.vue'),
        name: 'Hashtag'
      }

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
