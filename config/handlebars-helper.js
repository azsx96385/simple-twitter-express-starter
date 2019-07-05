const moment = require("moment");
module.exports = {
  ifCond: function(a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  moment: function(a) {
    return moment(a).format("YYYY-MM-DD");
  },
  moment_hr_min: function(a) {
    return moment(a).format("DD-HH-MM");
  }
};
