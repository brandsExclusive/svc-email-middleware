import * as chai from "chai"
import * as nock from "nock";
import server from "../src/server"
import chaiHttp = require('chai-http');
import * as  app from "../src/start"

const RECOMMENDATION = process.env.RECOMMENDATION || "home";
const MID = process.env.MID || "100016247";
const expect = chai.expect
chai.use(chaiHttp);

const payload = [
    {
        "name":"igdrec_1",
        "title":"You May Also Like",
        "priority":2,
        "items":[
            {
                "link":"https://100016247.collect.igodigital.com/redirect/WRm",
                "image_link":"https://res.cloudinary.com/lux-group/image/upload/g_auto,f_auto,fl_progressive,q_auto,c_fill,g_center/v7z0ekfmmjdr21jeba6j",
                "name":"Ultimate Beachfront Escape in Phuket’s Biggest Resort",
                "product_code":"0060I00000bisPtQAI"
            },
            {
                "link":"https://100016247.collect.igodigital.com/redirect/isdf",
                "image_link":"https://images.luxuryescapes.com/lux-group/image/upload/g_auto,f_auto,fl_progressive,q_auto,c_fill,g_center/xwf2dw02yrectdi3inot",
                "name":"Grand Opening: All-Inclusive Maldives Luxury with Return Transfers from Malé, Unlimited Drinks & Premium Dining",
                "product_code":"0060I00000csfBvQAI"
            }
        ]
    }
]



describe('test image urls', () => {

  beforeEach(async () => {
      nock('https://100016247.recs.igodigital.com')
      .get(`/a/v2/${MID}/${RECOMMENDATION}/recommend.json?email=testing`)
      .reply(200, payload)
    });

    it("testing email images 302", async () => {
         const resp = await chai.request(app).get('/api/email-middleware/email-image/mobile/1/igdrec_1/testing').redirects(0)
         expect(resp.status).to.equal(302)
         expect(resp.text).to.equal('Found. Redirecting to https://pi-templates.s3.us-east-1.amazonaws.com/production/5bbbf546d98e0373c1f51287/0060I00000csfBvQAI~1_au_au.png')
    })

    it("testing email links 302", async () => {
         const resp = await chai.request(app).get('/api/email-middleware/track-link/1/igdrec_1/testing').redirects(0)
         expect(resp.status).to.equal(302)
         expect(resp.text).to.equal('Found. Redirecting to https://100016247.collect.igodigital.com/redirect/isdf')
    })

    it("testing auth protection on daily views", async () => {
         const resp = await chai.request(app).get('/api/email-middleware/daily-views')
        expect(resp.status).to.equal(401)

    })

    it("testing auth protection on user views", async () => {
         const resp = await chai.request(app).get('/api/email-middleware/user-opens/testing')
        expect(resp.status).to.equal(401)

    })

});
