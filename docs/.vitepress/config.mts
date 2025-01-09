import { defineConfig } from "vitepress";
import timeline from "vitepress-markdown-timeline";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Alan的文档",
  description: "实用的学习笔记、项目教程",
  lang: "zh-Hans",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/avatar.jpeg",
    nav: [
      { text: "首页", link: "/" },
      {
        text: "文档",
        items: [{ text: "Go学习笔记", link: "/go-learn/入门指南.html" }],
      },
      {
        text: "大学笔记",
        items: [
          { text: "计算机图形学", link: "/university/计算机图形学.html" },
        ],
      },
      { text: "生活感悟", link: "/life.html" },
    ],

    sidebar: {
      "/go-learn/": [
        {
          text: "Go学习笔记",
          items: [{ text: "入门指南", link: "/go-learn/入门指南.html" }],
        },
        {
          text: "基本语法",
          collapsed: true,
          items: [
            { text: "关键字", link: "/go-learn/基本语法/关键字.html" },
            { text: "字面量", link: "/go-learn/基本语法/字面量.html" },
            { text: "运算符", link: "/go-learn/基本语法/运算符.html" },
            { text: "字符串", link: "/go-learn/基本语法/字符串.html" },
            { text: "数组与切片", link: "/go-learn/基本语法/数组与切片.html" },
            { text: "包", link: "/go-learn/基本语法/包.html" },
            { text: "函数", link: "/go-learn/基本语法/函数.html" },
            { text: "指针", link: "/go-learn/基本语法/指针.html" },
            { text: "时间与日期", link: "/go-learn/基本语法/时间与日期.html" },
            { text: "锁", link: "/go-learn/基本语法/锁.html" },
          ],
        },
      ],
      "/university/": [
        { text: "计算机图形学", link: "/university/计算机图形学.html" },
      ],
    },

    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                },
              },
            },
          },
        },
      },
    },
    socialLinks: [{ icon: "github", link: "https://github.com/codepzj" }],
    editLink: {
      pattern: "https://github.com/codepzj/blog/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页面",
    },
    footer: {
      message: "基于 MIT 许可发布",
      copyright: `版权所有 © 2024-${new Date().getFullYear()} Alan`,
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    outline: {
      label: "页面导航",
    },

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },

    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
  markdown: {
    theme: {
      light: "one-light",
      dark: "one-dark-pro",
    },
    config: (md) => {
      md.use(timeline);
    },
  },
  base: "/docs/",
  outDir: "docs",
});
