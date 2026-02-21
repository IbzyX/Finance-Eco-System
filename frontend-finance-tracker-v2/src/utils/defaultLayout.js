export const sizeMap = {
  small: { w: 1, h: 2 },    // width 1 column, height 2 rows
  medium: { w: 1, h: 4 },   // width 1 column, height 4 rows
  large: { w: 2, h: 6 },    // width 2 columns, height 6 rows
};

export const defaultLayout = [
  { i: "Total Pie", ...sizeMap.large, x: 0, y: 0 },
  { i: "Upcoming Bills", ...sizeMap.medium, x: 2, y: 0 },
  { i: "Accounts", ...sizeMap.medium, x: 0, y: 6 },
  { i: "Savings", ...sizeMap.small, x: 1, y: 6 },
  { i: "Cashflow Chart", ...sizeMap.medium, x: 0, y: 10 },
  { i: "Investments", ...sizeMap.large, x: 1, y: 10 },
  { i: "Savings Projection", ...sizeMap.large, x: 0, y: 16 },
  { i: "Habits", ...sizeMap.large, x: 2, y: 16 },
];
