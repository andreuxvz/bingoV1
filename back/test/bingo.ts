import chai from "chai";
import chaiHttp from "chai-http";
import app from '../index'
import { IBingo } from "../interfaces";
import { BingoModel as Bingo } from "../model/Bingo";

chai.should();
 
chai.use(chaiHttp);
 
describe("bingos", () => {
  beforeEach(async () => {
    await Bingo.deleteMany({});
  });
  describe("/GET bingo", () => {
    it("it should GET all the bingos", (done) => {
      chai
        .request(app)
        .get("/api/bingos")
        .then((res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(0);
          done();
        }).catch(done);
        
    });
  });

  describe("/POST bingo", () => {
    it("it should new POST a bingo", (done) => {
      let bingo = {
        numbers: ['1','2','3','32','44','33'],
      };
      chai
        .request(app)
        .post("/api/bingos")
        .send(bingo)
        .then((res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("object");
          res.body.status.should.be.eql("success");
          done();
        })
        .catch(done);;
    });
  });

  describe("/GET/:id bingo", () => {
    it("it should GET a bingo by the id", function (done) {
            const bingo: any = new Bingo({
                numbers: ['1', '2', '3', '32', '44', '33'],
            });

            bingo.save()
                .then((bingo: any) => {
                    chai
                    .request(app)
                    .get("/api/bingos/" + bingo._id.toString())
                    .send(bingo)
                    .then((res) => {
                        res.should.have.status(200);
                        res.body.data.should.be.a("object");
                        res.body.status.should.be.eql("success");
                        done();
                    })
                    .catch((err) => {
                        done();
                    });
                }).catch(done);

        });
  });

  describe("/PUT/:id bingo", () => {
    it("it should UPDATE a bingo given the id", (done) => {
      const bingo = new Bingo({
        numbers: ['1', '15', '23', '32', '44', '33'],
      });

      bingo.save()
        .then((bingoUpd: any) => {
            chai
              .request(app)
              .put("/api/bingos/" + bingo._id.toString())
              .send({
                numbers: ['1', '12', '3', '32', '44', '33'],
              })
              .then((res) => {
                res.should.have.status(200);
                res.body.data.should.be.a("object");
                res.body.status.should.be.eql("success");
                done();
              })
              .catch((err) => {
                done();
              })
        }).catch(done);
      });
    });

  describe("/DELETE/:id bingo", () => {
    it("it should DELETE a bingo given the id", (done) => {
      const bingo = new Bingo({
        numbers: ['1','2','3','32','44','33'],
      });
      bingo.save()
        .then((bingoUpd: any) => {
            chai
                .request(app)
                .delete("/api/bingos/" + bingoUpd._id.toString())
                .then((res: any) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a("object");
                    res.body.status.should.be.eql("success");
                    done();
                })
                .catch((err) => {
                    done();
                })
        }).catch(done);
      
    });
  });

});
