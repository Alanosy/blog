import DefaultTheme from "vitepress/theme";
import { onMounted, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import mediumZoom from "medium-zoom";
import "vitepress-markdown-timeline/dist/theme/index.css";
import "./global.css";

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
  },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      // 为所有图片增加缩放功能
      mediumZoom(".main img", { background: "var(--vp-c-bg)" });
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
};
