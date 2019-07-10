process.env.NODE_ENV = "test";

var chai = require("chai");
var sinon = require("sinon");
chai.use(require("sinon-chai"));

const { expect } = require("chai");
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require("sequelize-test-helpers");

const db = require("../../models");
const LikeModel = require("../../models/like");

describe("# Like Model", () => {
  before(done => {
    done();
  });

  const Like = LikeModel(sequelize, dataTypes);
  const like = new Like();
  checkModelName(Like)("Like");

  context("properties", () => {
    [].forEach(checkPropertyExists(like));
  });

  context("associations", () => {
    const User = "User";
    const Tweet = "Tweet";
    before(() => {
      Like.associate({ User });
      Like.associate({ Tweet });
    });

    it("should belong to user", done => {
      expect(Like.belongsTo).to.have.been.calledWith(User);
      done();
    });
    it("should belong to tweet", done => {
      expect(Like.belongsTo).to.have.been.calledWith(Tweet);
      done();
    });
  });

  context("action", () => {
    let data = null;

    it("create", done => {
      //water- 建立空值-會產生具有ID的空資料
      db.Like.create({}).then(like => {
        data = like;
        //water-測試
        //console.log(like);
        //console.log(data);
        done();
      });
    });
    console.log(data);

    //water- 拿上方新增的空資料的ID
    it("read", done => {
      // console.log("like_model新增後data(read案例)", data);
      db.Like.findByPk(data.id).then(like => {
        expect(data.id).to.be.equal(like.id);
        done();
      });
    });
    it("update", done => {
      db.Like.update({}, { where: { id: data.id } }).then(() => {
        db.Like.findByPk(data.id).then(like => {
          expect(data.updatedAt).to.be.not.equal(like.updatedAt);
          done();
        });
      });
    });
    it("delete", done => {
      db.Like.destroy({ where: { id: data.id } }).then(() => {
        db.Like.findByPk(data.id).then(like => {
          expect(like).to.be.equal(null);
          done();
        });
      });
    });
  });
});
