var assert = require('assert');
describe('cli()', function() {

		describe('constructor', function() {
				it('should return cli object with necessary methods', function() {
          cli = require('../index.js');
						assert.equal(typeof cli, 'object');
						assert.equal(typeof cli.files, 'function');
						assert.equal(typeof cli.ready, 'function');
				});
		});
		describe.skip('param', function() {
      it('should accept integers up to 3', function() {
      });
		});
});
