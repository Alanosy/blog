const config = {
  baseUrl: 'https://sukoshi.xyz',
  title: '我在这里',
  hitokoto: '学海无涯苦作舟',
  keywords: ['blog', 'sukoshi', '博客', '个人小站', '鹿岛', '鹿角'],
  description: '网络海洋中的一座小岛',
  bannerUrl: '/banner.jpg',
  author: {
    name: 'Sukoshi',
    avatar: 'https://avatars0.githubusercontent.com/u/81866?s=460&v=4',
    email: 'guanquanhong@163.com',
  },
  nav: [
    { text: '首页', link: '/' },
    { text: '归档', link: '/posts' },
    { text: '标签', link: '/tags' },
    { text: '关于', link: '/about' },
    { text: '友链', link: '/links' },
  ],
  lastPostsCount: 6,
  beian: '',
  analytics: {
    baidu: '77cce6624f1114785af5e77d00cbf93c',
    google: 'G-GS74WZSLFF'
  },
  twitter: {
    creator: '@guanquanhong',
    site: 'https://twitter.com/guanquanhong',
    card: 'summary_large_image',
  }
};

export default config;
