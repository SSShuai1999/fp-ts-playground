export default ~(() => {
  const data = [
    {
      type: 1,
      name: "帅神orz",
      gender: 1,
      commit: "我不到啊~ 😅😅😅",
    },
    {
      type: 2,
      name: "小红",
      gender: 2,
      commit: "还他妈戴你那眼镜呢？ 我徒弟呢？ 😅😅😅",
    },
    {
      type: 1,
      name: "小红",
      gender: 1,
      commit: "忽略~！😅😅😅",
    },
    {
      type: 2,
      name: "小小酥",
      gender: 2,
      commit: "多多少少沾点 😅😅😅",
    },
    {
      type: 1,
      name: "潘子",
      gender: 1,
      commit: "把握不住~ 😅😅😅",
    },
    {
      type: 1,
      name: "嘎子",
      gender: 1,
      commit: "我把握的住~ 😅😅😅",
    },
  ];

  const multiply = [{ name: "帅神orz" }, { commit: "我不到啊~ 😅😅😅" }];

  const filterFunc = (source: any[], filterData: any[]) => {
    // 将数据打平成一个对象
    const format = source.reduce((p: any, n: any) => ({ ...n, ...p }), {});
    const keys = Object.keys(format);
    return filterData.filter((di: any) =>
      keys.every((ki: any) => di[ki] === undefined || di[ki] === format[ki])
    );
  };

  const result = filterFunc(multiply, data);
  console.log(result);
})();
