"use strict";

let sampleText = [
  "知道我和唐僧的區別嗎？唐僧取經，我娶你",
  "這是手背，這是腳背，你是我的寶貝",
  "我想問一下路，到你心裡的路",
  "你知道你是哪裡人嗎？你是我的人",
  "梨子可以讓，但妳不行",
  "我可以親口跟你說早安嗎？",
  "在非洲，每六十秒，就有一分鐘過去",
  "凡是每天喝水的人，有高機率在100年內死去",
  "每呼吸60秒，就減少一分鐘的壽命",
  "當你吃下吃下廿碗白飯，換算竟相當於吃下了二十碗白飯的熱量",
  "誰能想的到，這名16歲少女，在四年前，只是一名12歲少女",
  "台灣人在睡覺時，大多數的美國人都在工作",
  "當蝴蝶在南半球拍了兩下翅膀，牠就會稍微飛高一點點",
  "據統計，未婚生子的人數中有高機率為女性",
  "只要每天省下買一杯奶茶的錢，十天後就能買十杯奶茶",
  "當你的左臉被人打，那你的左臉就會痛",
  "今年中秋節剛好是滿月、今年七夕恰逢鬼月、今年母親節正好是星期日",
  "台灣競爭力低落，在美國就連小學生都會說流利的英語"
];
let fakeTweet = [];
for (let i = 0; i < 100; i++) {
  let random = Math.floor(Math.random() * sampleText.length);
  fakeTweet.push({
    UserId: Math.ceil(Math.random() * 10),
    description: sampleText[random],
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Tweets", fakeTweet, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tweets", null, {});
  }
};
