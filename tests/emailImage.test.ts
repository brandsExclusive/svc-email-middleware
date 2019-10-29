const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http');
import server from '../src/server'

chai.use(chaiHttp)

it('should return hello world', async () => {
  let request = await chai.request(server).get('testing')
  console.log(request.status);
  expect(request.status).to.equal(404)
});
