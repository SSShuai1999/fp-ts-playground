export default ~(() => {
  // [{ type: "🍇", commit: "👍🏿" },{ type: "🥕", commit: "😭" }]

  const data = [
    {
      id: 1,
      rankScore: "1.0",
      prob: null,
      stdNo: "sad asd-asd",
      nameCn: "asd",
      className: null,
      classNo: null,
      classType: "null",
      classAllName: "A9510  ",
      pdfExist: "0",
      secretLevel: "asd",
      stdStatus: "asd",
      parentNames: "asdsad",
      gjbType: null,
      searchGjbType: "asdasd",
      searchHType: "asd",
      editor: "asdasda",
      sysName: null,
      sysCode: "1.5.8",
      sysId: null,
      pubDate: "2001-11-23 00:00:00",
      htype: "asdasd(sadad)",
    },
  ];

  const multiply = [{ searchHType: "G" }, { sysCode: undefined }];

  const filterFunc = (source: any[], filterData: any[]) => {
    // 将数据打平成一个对象
    const format = source.reduce((p: any, n: any) => ({ ...n, ...p }), {});
    const keys = Object.keys(format);
    const isUnd = (x: unknown) => x === undefined;
    const isStr = (x: unknown) => typeof x === "string";
    const eq = (l: string, r: string) => (isStr(l) ? l.includes(r) : l === r);
    return filterData.filter((di: any) =>
      keys.every(
        (ki: any) =>
          isUnd(di[ki]) || isUnd(format[ki]) || eq(di[ki], format[ki])
      )
    );
  };

  const result = filterFunc(multiply, data);
  console.log(result);
})();
