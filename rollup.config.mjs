import copy from "rollup-plugin-copy";

export default {
  input: "source/js/extra.js",
  output: {
    file: "bundle.js", // 不需要生成的 JS 输出文件，仍然需要指定
  },
  plugins: [
    copy({
      targets: [
        {
          src: "docs/docs/*", // 源文件夹路径，可以使用通配符
          dest: "public/docs", // 目标文件夹路径
        },
      ],
      verbose: true,
    }),
  ],
};
