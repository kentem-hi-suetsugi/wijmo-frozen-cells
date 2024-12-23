const getData = () => {
  const data = [];
  for (let i = 0; i < 6; i++) {
    data.push({
      checker: true,
      num1: Math.random() * 5000,
      num2: Math.random() * 5000,
      num3: Math.random() * 5000,
      num4: Math.random() * 5000,
      num5: Math.random() * 5000,
      num6: Math.random() * 5000,
      num7: Math.random() * 5000,
      num8: Math.random() * 5000,
      num9: Math.random() * 5000,
      num0: Math.random() * 5000,
    });
  }
  return data;
};
export const data = getData();
