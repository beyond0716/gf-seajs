seajs.config({
    // 别名配置
    alias: {
        // lib
        "jquery": "lib/jquery/jQuery/1.12.4/jquery-1.12.4.min",
        "jqueryUi": "lib/jquery/jquery-ui.min",
        "validator": "lib/jquery/jquery.form-validator.min",
        "icheck": "lib/jquery/icheck.min",
        "select2": "lib/jquery/select2.min",
        // "cookie": "lib/jquery/jquery.cookie",
        "resize": "lib/jquery/jquery.ba-resize.min",
        "jeegoocontext": "lib/jquery/jquery.jeegoocontext-2.0.0.min",
        "mCustomScrollbar": "lib/jquery/jquery.mCustomScrollbar.concat.min",
        "dialog": "lib/artDialog/dist/dialog-min",
        'template-native': 'lib/template/template',
        // utils
        'template': 'utils/template-helper',
        'client': 'utils/client.js',
        'check': 'utils/check.js',
        // pages
        'test': 'pages/test.js',
        'rev':'pages/rev.js'
    },

    // 路径配置
    paths: {
        'js':'/js',
        'lib':'/js/lib',
        'pages':'/js/pages',
        'utils':'/js/utils'
    },

    // 变量配置
    vars: {
        'locale': 'zh-cn'
    },

    // 映射配置
    map: [
        ['http://example.com/js/app/', 'http://localhost/js/app/']
    ],

    // 预加载项
    preload: [
      'jquery'
    ],
  
    // 调试模式
    debug: true,

    // Sea.js 的基础路径
    base: '/js/lib/seajs',

    // 文件编码
    charset: 'utf-8'
});