'use strict';


module.exports = {
  static: {
    // path:'src',
    dir: `${__rootdir}/public/dist`,
    maxAge: 1000 * 60 * 60 * 24 * 365
  },
  views: {
    engine: 'ejs',
    dir: `${__rootdir}/views/dist`
  }
};


