const add = (a: number, b: number): number => a + b;

describe("add関数", () => {
  it("1 + 2 = 3になる", () => {
    expect(add(1, 2)).toBe(3);
  });
});
