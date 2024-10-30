const load = jest.fn(() => ({
  html: jest.fn(),
}));

module.exports = { load };
