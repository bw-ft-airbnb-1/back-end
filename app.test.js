describe("server", () => {
  it("should be in testing mode", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});
