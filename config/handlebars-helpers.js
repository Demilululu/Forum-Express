const moment = require('moment')

module.exports = {
  ifCond: function(v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  isZero: function (v1, options) {
    if (v1 === 0) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  moment: function (a) {
    return moment(a).fromNow();
  },
  
}