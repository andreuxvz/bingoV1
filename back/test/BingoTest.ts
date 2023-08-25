import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";
import { BingoModel as Bingo } from "../model/Bingo";
import { assert } from "chai";

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
        })
        .catch(done);
    });
  });

  describe("/POST bingo", () => {
    it("it should new POST to create bingo card", (done) => {
      chai
        .request(app)
        .post("/api/bingos")
        .send({})
        .then((res) => {
          res.should.have.status(200);
          res.body.status.should.be.eql("success");
          res.body.data.should.be.a("object");
          const { bingo } = res.body.data;
          bingo.numbers.should.be.a("array");
          bingo.numbers.should.have.length(25); // esto porque estamos incluyendo al 0 como valor de free

          done();
        })
        .catch(done);
    });
  });

  describe("/GET/:id bingo", () => {
    it("it should GET a bingo by the id", function (done) {
      const bingo: any = new Bingo({
        numbers: [
          1, 3, 4, 6, 7, 17, 22, 23, 29, 30, 31, 32, 0, 37, 44, 55, 58, 56, 60,
          61, 63, 65, 66, 68,
        ],
      });

      bingo
        .save()
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
        })
        .catch(done);
    });
  });

  describe("/PUT/:id bingo", () => {
    it("it should UPDATE a bingo given the id", (done) => {
      const bingo = new Bingo({
        numbers: [
          1, 3, 4, 6, 7, 17, 22, 23, 29, 30, 31, 32, 0, 37, 44, 55, 58, 56, 60,
          61, 63, 65, 66, 68,
        ],
      });

      bingo
        .save()
        .then((bingoUpd: any) => {
          chai
            .request(app)
            .put("/api/bingos/" + bingo._id.toString())
            .send({
              numbers: ["1", "12", "3", "32", "44", "33"],
            })
            .then((res) => {
              res.should.have.status(200);
              res.body.data.should.be.a("object");
              res.body.status.should.be.eql("success");
              done();
            })
            .catch((err) => {
              done();
            });
        })
        .catch(done);
    });
  });

  describe("/DELETE/:id bingo", () => {
    it("it should DELETE a bingo given the id", (done) => {
      const bingo = new Bingo({
        numbers: [
          1, 3, 4, 6, 7, 17, 22, 23, 29, 30, 31, 32, 0, 37, 44, 55, 58, 56, 60,
          61, 63, 65, 66, 68,
        ],
      });
      bingo
        .save()
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
            });
        })
        .catch(done);
    });
  });
});
