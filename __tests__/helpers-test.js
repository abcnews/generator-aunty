const Helpers = require('../helpers');

describe('#allPaths', () => {
  it('finds all paths in a directory', async () => {
    const paths = await Helpers.getAllPaths(__dirname + '/all-paths');

    expect(paths instanceof Array).toBeTruthy();
    expect(paths.length).toBe(5);
    expect(paths[0]).toMatch(/^\//);
    expect(paths[0]).toMatch(/\.txt$/);
  });
});
