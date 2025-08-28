module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  testMatch: ["<rootDir>/tests/*.(test|spec).ts"],
};