'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "1756499d77011c0be564a414e567db76",
"index.html": "ffc7611c1a2127ac142979bc01f15859",
"/": "ffc7611c1a2127ac142979bc01f15859",
"main.dart.js": "0d091861b4c7fb98bfada376472d7248",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"manifest.json": "a06b13fcde5dfd1e240278072e116d12",
"assets/AssetManifest.json": "ad0c1b8937d33b2c17b7472ab5d4c4e5",
"assets/NOTICES": "6e236301011331de64912e63faf619d4",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/packages/deriv_chart/assets/icons/icon_placeholder.png": "23e9167e0fd2be2b618b589ed8401a1a",
"assets/packages/deriv_chart/assets/icons/symbols/1hz300v.png": "90527d87c8da43c78bcad66528b09581",
"assets/packages/deriv_chart/assets/icons/symbols/otc_aex.png": "84ab872d7286a67f2633cbbcff89f0bb",
"assets/packages/deriv_chart/assets/icons/symbols/frxusdpln.png": "d980230b5ea98c9b5d002a3cb8c84c13",
"assets/packages/deriv_chart/assets/icons/symbols/frxnzdusd.png": "bc348f3842a0451f56bd8bb3e734204b",
"assets/packages/deriv_chart/assets/icons/symbols/frxusdmxn.png": "f08040e1eefd9b94d74982301d7e4713",
"assets/packages/deriv_chart/assets/icons/symbols/frxnzdjpy.png": "f7e9bdd69b05f1e03f0639d159d00a71",
"assets/packages/deriv_chart/assets/icons/symbols/frxaudchf.png": "774fdfbacb2fb4d90515ce21b60d6df2",
"assets/packages/deriv_chart/assets/icons/symbols/otc_ftse.png": "03f4252f41ad5a660709d6d43a799379",
"assets/packages/deriv_chart/assets/icons/symbols/boom1000.png": "275e3affe9199072740e6d1d96d1d7f5",
"assets/packages/deriv_chart/assets/icons/symbols/frxgbpchf.png": "226b953b636290e10055d14bca9b5bc0",
"assets/packages/deriv_chart/assets/icons/symbols/frxgbpnok.png": "b8c7d9f5574f84e68351fb8a139408f0",
"assets/packages/deriv_chart/assets/icons/symbols/r_50.png": "32a462d9ab4f510ba2bb48d23d20348e",
"assets/packages/deriv_chart/assets/icons/symbols/frxeurnzd.png": "5e6997f168d3f146c492d0eed9503b0b",
"assets/packages/deriv_chart/assets/icons/symbols/1hz75v.png": "d42630a1e38f8f8c3233b6e85cc38dfa",
"assets/packages/deriv_chart/assets/icons/symbols/rdbear.png": "b1786f16d6a49e34d5a9cb548dcc0830",
"assets/packages/deriv_chart/assets/icons/symbols/1hz100v.png": "86c6ae319c2bbac459d52642a42c0d37",
"assets/packages/deriv_chart/assets/icons/symbols/jd50.png": "9c2ae1a557664cfdb6541275b0b8759c",
"assets/packages/deriv_chart/assets/icons/symbols/otc_as51.png": "e728bbf9a2dfcd66cd56320857e49b95",
"assets/packages/deriv_chart/assets/icons/symbols/frxusdcad.png": "e8c3bf13c091879e68111700e9ec74e6",
"assets/packages/deriv_chart/assets/icons/symbols/crash300n.png": "bc1bd32c4a53b3341ac9bf66f869e463",
"assets/packages/deriv_chart/assets/icons/symbols/jd150.png": "3e60df618ae2f598dd50e0488b075861",
"assets/packages/deriv_chart/assets/icons/symbols/crash500.png": "eb715e454caa0be405e64320cbf75a9d",
"assets/packages/deriv_chart/assets/icons/symbols/crybtcusd.png": "02fb37d758a94ce064225cc50345ea93",
"assets/packages/deriv_chart/assets/icons/symbols/1hz25v.png": "3009a4c570587e2c3e1dc81759f12f4d",
"assets/packages/deriv_chart/assets/icons/symbols/otc_hsi.png": "927d54a894ba10b540a9983dff9f1187",
"assets/packages/deriv_chart/assets/icons/symbols/rdbull.png": "79b731e365d4a780407e9415b811c7aa",
"assets/packages/deriv_chart/assets/icons/symbols/frxeurcad.png": "dbfeb90340a097fac57fe24e439d57d8",
"assets/packages/deriv_chart/assets/icons/symbols/btcusd.png": "822ecfb1d3138c3b30c08d8de090c3b5",
"assets/packages/deriv_chart/assets/icons/symbols/wldusd.png": "00e205727f005f0885e3d896f87e5e7e",
"assets/packages/deriv_chart/assets/icons/symbols/crybnbusd.png": "372740ee2ae319f26fde7ef7a81ac359",
"assets/packages/deriv_chart/assets/icons/symbols/jd25.png": "40c3b57cddf1ba75eac5b38c2394bae1",
"assets/packages/deriv_chart/assets/icons/symbols/frxgbpjpy.png": "42bb921c4580882c07be30471ae97372",
"assets/packages/deriv_chart/assets/icons/symbols/otc_spc.png": "5a365f15f8180ad73077670be60fbc4c",
"assets/packages/deriv_chart/assets/icons/symbols/dshusd.png": "d5e83cc9d822d803830d238f28357b9b",
"assets/packages/deriv_chart/assets/icons/symbols/frxaudjpy.png": "605d3cdb4e33aa0730a52749583e2d62",
"assets/packages/deriv_chart/assets/icons/symbols/bnbusd.png": "3d5b95e1f0195528fc798ea8be00ca14",
"assets/packages/deriv_chart/assets/icons/symbols/wldgbp.png": "decd925f9c4071564ae41060de68e8bf",
"assets/packages/deriv_chart/assets/icons/symbols/otc_ssmi.png": "1561a92a36989a64f85c7221384c4957",
"assets/packages/deriv_chart/assets/icons/symbols/frxaudusd.png": "028051074b041db767963ab238dc3cd1",
"assets/packages/deriv_chart/assets/icons/symbols/r_25.png": "afcf1df622b3db9569dea6c4e03bca62",
"assets/packages/deriv_chart/assets/icons/symbols/frxeuraud.png": "74165ef668f66beabacb69e6e475b43d",
"assets/packages/deriv_chart/assets/icons/symbols/crydshusd.png": "d1b4a516dbf4bf2a01f781e4bdd340af",
"assets/packages/deriv_chart/assets/icons/symbols/frxgbpusd.png": "8e568a6f779c412f5cd1baf6c3e3aa5a",
"assets/packages/deriv_chart/assets/icons/symbols/frxeurjpy.png": "aeb0d0b3064206ade4551fb584fa28aa",
"assets/packages/deriv_chart/assets/icons/symbols/cryltcusd.png": "d961cacac37de35b0c6f9d4fc55b7a1a",
"assets/packages/deriv_chart/assets/icons/symbols/stprng.png": "2c1de68d72d7f616c62fdb0c79bed45c",
"assets/packages/deriv_chart/assets/icons/symbols/wldaud.png": "2fe0b5f56a4b7e10335ab45a05533f26",
"assets/packages/deriv_chart/assets/icons/symbols/frxeurgbp.png": "64f2f86f9299d5408e355711023eca39",
"assets/packages/deriv_chart/assets/icons/symbols/wldxau.png": "15d97f02978d830b0d40c5ab885d3539",
"assets/packages/deriv_chart/assets/icons/symbols/otc_ndx.png": "c1d2bec8ca9dc9ca8aa8205d61f447a8",
"assets/packages/deriv_chart/assets/icons/symbols/frxusdchf.png": "73c02e4807d10f708314a493f0e68a95",
"assets/packages/deriv_chart/assets/icons/symbols/ltcusd.png": "49c0bf02c99cc70f164329d4c794b884",
"assets/packages/deriv_chart/assets/icons/symbols/1hz50v.png": "ca1f2126d70fc86cca2ca808afba73e5",
"assets/packages/deriv_chart/assets/icons/symbols/frxeurusd.png": "87d65825df117aa6320059e251870c85",
"assets/packages/deriv_chart/assets/icons/symbols/frxgbpaud.png": "b093bacf9b6b37256cbb7454d5c0c618",
"assets/packages/deriv_chart/assets/icons/symbols/frxbrousd.png": "db8cdc3fb067e7ede3c34671f4729c06",
"assets/packages/deriv_chart/assets/icons/symbols/1hz200v.png": "48e2e5414fc64e2b1bdb6e9d4f898d66",
"assets/packages/deriv_chart/assets/icons/symbols/jd10.png": "476427fae7af1535682199b14a0637e6",
"assets/packages/deriv_chart/assets/icons/symbols/frxusdnok.png": "d957fdfa55248112e72ee6eb0ad166b7",
"assets/packages/deriv_chart/assets/icons/symbols/otc_n225.png": "3292d39066ad579b4f98719da4325351",
"assets/packages/deriv_chart/assets/icons/symbols/xmrusd.png": "ecdce25fe2272992147875c80aa5564c",
"assets/packages/deriv_chart/assets/icons/symbols/otc_dji.png": "5431f4a3681ef9fbe32421ac87531e0d",
"assets/packages/deriv_chart/assets/icons/symbols/jd200.png": "71c8b672dafa03ff61e437067bda3145",
"assets/packages/deriv_chart/assets/icons/symbols/boom500.png": "ec41b2ed3470ea74bf5b4bc0197cee4f",
"assets/packages/deriv_chart/assets/icons/symbols/1hz10v.png": "9f4582fb123c907533d86092cb1d9baa",
"assets/packages/deriv_chart/assets/icons/symbols/frxxptusd.png": "6ae6a0220f76917758e82381568a0a9c",
"assets/packages/deriv_chart/assets/icons/symbols/wldeur.png": "d6cb32cec19edd8f358068a16b86ea56",
"assets/packages/deriv_chart/assets/icons/symbols/otc_gdaxi.png": "1319d58b3f166cba038ad455902d4649",
"assets/packages/deriv_chart/assets/icons/symbols/frxgbpcad.png": "be914c3dd3192d404b79e5f7d3f943f9",
"assets/packages/deriv_chart/assets/icons/symbols/frxxagusd.png": "52726410fea8214c4c94ca6e4b328247",
"assets/packages/deriv_chart/assets/icons/symbols/r_10.png": "3090d1f1213cf44d4de951ffe72579f6",
"assets/packages/deriv_chart/assets/icons/symbols/cryxmrusd.png": "272edb110a2628fc60d2fb0bd237cc50",
"assets/packages/deriv_chart/assets/icons/symbols/frxaudcad.png": "827bb3e47b0e64ddbf1bb5ae61a01033",
"assets/packages/deriv_chart/assets/icons/symbols/zecusd.png": "0585b34fb4febfffa9d61cb1c95e9f55",
"assets/packages/deriv_chart/assets/icons/symbols/frxaudnzd.png": "8a0984ff7646f0d9b97496bb4e8099a8",
"assets/packages/deriv_chart/assets/icons/symbols/crash1000.png": "8a28cf0b6da088f5e7e66cc7ff19b85d",
"assets/packages/deriv_chart/assets/icons/symbols/jd75.png": "99462c4c4b5032c8af1558c3a639a8b4",
"assets/packages/deriv_chart/assets/icons/symbols/cryxrpusd.png": "5d0c030de1adb482f7796945ae149117",
"assets/packages/deriv_chart/assets/icons/symbols/otc_fchi.png": "f9a69497fc71115c37d75216fcc20b6c",
"assets/packages/deriv_chart/assets/icons/symbols/frxusdsek.png": "de4d5275c29f934ade5b7528186aafa2",
"assets/packages/deriv_chart/assets/icons/symbols/frxgbpnzd.png": "cb7dd4cdb203d45e80e4faaf5e940217",
"assets/packages/deriv_chart/assets/icons/symbols/cryeosusd.png": "43ae4baee03d269a0b9fb525781173b9",
"assets/packages/deriv_chart/assets/icons/symbols/cryzecusd.png": "ea36d64aa57f4e1d44bc9c5ce9284ad9",
"assets/packages/deriv_chart/assets/icons/symbols/frxxpdusd.png": "3fd9da692e54ba8da043dee61bc62d4c",
"assets/packages/deriv_chart/assets/icons/symbols/r_75.png": "ac2b6b21fdbd825b23c4905f2b92603d",
"assets/packages/deriv_chart/assets/icons/symbols/xrpusd.png": "3c1edf55f4b1e20ac79ef9eeb0171545",
"assets/packages/deriv_chart/assets/icons/symbols/eosusd.png": "c1ab7f666c4bc67dfa6cccf9746165d1",
"assets/packages/deriv_chart/assets/icons/symbols/crybchusd.png": "e61eedb43a2f79f2c2c8b4c892c5f5fc",
"assets/packages/deriv_chart/assets/icons/symbols/boom300n.png": "64cbad2add96b626bc2d3d37838755c5",
"assets/packages/deriv_chart/assets/icons/symbols/jd100.png": "ec8bd86974b154e357650ba5a20916b7",
"assets/packages/deriv_chart/assets/icons/symbols/cryethusd.png": "d4520def9dba50f3758cbe869db8ce0f",
"assets/packages/deriv_chart/assets/icons/symbols/r_100.png": "76159a96ba97803b9eb024846f7e4dfe",
"assets/packages/deriv_chart/assets/icons/symbols/frxxauusd.png": "075478e155c016554bd9ce8c0c78bbb8",
"assets/packages/deriv_chart/assets/icons/symbols/frxusdjpy.png": "2a27170f100f619036d79e164566e005",
"assets/packages/deriv_chart/assets/icons/symbols/bchusd.png": "1433535ddc1ae0fec062c6cc8e5840d6",
"assets/packages/deriv_chart/assets/icons/symbols/ethusd.png": "bcdd0cd2cfcaa223c3d4ccef318fd503",
"assets/packages/deriv_chart/assets/icons/symbols/otc_sx5e.png": "ea3bd71efec331d541705e2271b3b766",
"assets/packages/deriv_chart/assets/icons/symbols/frxeurchf.png": "1a66826ef57b967efeb3e67673609eac",
"assets/fonts/MaterialIcons-Regular.otf": "69eac75d484a0881bd9cb574da342d22",
"assets/assets/icons/symbols/1hz300v.png": "90527d87c8da43c78bcad66528b09581",
"assets/assets/icons/symbols/otc_aex.png": "84ab872d7286a67f2633cbbcff89f0bb",
"assets/assets/icons/symbols/frxusdpln.png": "d980230b5ea98c9b5d002a3cb8c84c13",
"assets/assets/icons/symbols/frxnzdusd.png": "bc348f3842a0451f56bd8bb3e734204b",
"assets/assets/icons/symbols/frxusdmxn.png": "f08040e1eefd9b94d74982301d7e4713",
"assets/assets/icons/symbols/frxnzdjpy.png": "f7e9bdd69b05f1e03f0639d159d00a71",
"assets/assets/icons/symbols/frxaudchf.png": "774fdfbacb2fb4d90515ce21b60d6df2",
"assets/assets/icons/symbols/otc_ftse.png": "03f4252f41ad5a660709d6d43a799379",
"assets/assets/icons/symbols/boom1000.png": "275e3affe9199072740e6d1d96d1d7f5",
"assets/assets/icons/symbols/frxgbpchf.png": "226b953b636290e10055d14bca9b5bc0",
"assets/assets/icons/symbols/frxgbpnok.png": "b8c7d9f5574f84e68351fb8a139408f0",
"assets/assets/icons/symbols/r_50.png": "32a462d9ab4f510ba2bb48d23d20348e",
"assets/assets/icons/symbols/frxeurnzd.png": "5e6997f168d3f146c492d0eed9503b0b",
"assets/assets/icons/symbols/1hz75v.png": "d42630a1e38f8f8c3233b6e85cc38dfa",
"assets/assets/icons/symbols/rdbear.png": "b1786f16d6a49e34d5a9cb548dcc0830",
"assets/assets/icons/symbols/1hz100v.png": "86c6ae319c2bbac459d52642a42c0d37",
"assets/assets/icons/symbols/jd50.png": "9c2ae1a557664cfdb6541275b0b8759c",
"assets/assets/icons/symbols/otc_as51.png": "e728bbf9a2dfcd66cd56320857e49b95",
"assets/assets/icons/symbols/frxusdcad.png": "e8c3bf13c091879e68111700e9ec74e6",
"assets/assets/icons/symbols/crash300n.png": "bc1bd32c4a53b3341ac9bf66f869e463",
"assets/assets/icons/symbols/jd150.png": "3e60df618ae2f598dd50e0488b075861",
"assets/assets/icons/symbols/crash500.png": "eb715e454caa0be405e64320cbf75a9d",
"assets/assets/icons/symbols/crybtcusd.png": "02fb37d758a94ce064225cc50345ea93",
"assets/assets/icons/symbols/1hz25v.png": "3009a4c570587e2c3e1dc81759f12f4d",
"assets/assets/icons/symbols/otc_hsi.png": "927d54a894ba10b540a9983dff9f1187",
"assets/assets/icons/symbols/rdbull.png": "79b731e365d4a780407e9415b811c7aa",
"assets/assets/icons/symbols/frxeurcad.png": "dbfeb90340a097fac57fe24e439d57d8",
"assets/assets/icons/symbols/btcusd.png": "822ecfb1d3138c3b30c08d8de090c3b5",
"assets/assets/icons/symbols/wldusd.png": "00e205727f005f0885e3d896f87e5e7e",
"assets/assets/icons/symbols/crybnbusd.png": "372740ee2ae319f26fde7ef7a81ac359",
"assets/assets/icons/symbols/jd25.png": "40c3b57cddf1ba75eac5b38c2394bae1",
"assets/assets/icons/symbols/frxgbpjpy.png": "42bb921c4580882c07be30471ae97372",
"assets/assets/icons/symbols/otc_spc.png": "5a365f15f8180ad73077670be60fbc4c",
"assets/assets/icons/symbols/dshusd.png": "d5e83cc9d822d803830d238f28357b9b",
"assets/assets/icons/symbols/frxaudjpy.png": "605d3cdb4e33aa0730a52749583e2d62",
"assets/assets/icons/symbols/bnbusd.png": "3d5b95e1f0195528fc798ea8be00ca14",
"assets/assets/icons/symbols/wldgbp.png": "decd925f9c4071564ae41060de68e8bf",
"assets/assets/icons/symbols/otc_ssmi.png": "1561a92a36989a64f85c7221384c4957",
"assets/assets/icons/symbols/frxaudusd.png": "028051074b041db767963ab238dc3cd1",
"assets/assets/icons/symbols/r_25.png": "afcf1df622b3db9569dea6c4e03bca62",
"assets/assets/icons/symbols/frxeuraud.png": "74165ef668f66beabacb69e6e475b43d",
"assets/assets/icons/symbols/crydshusd.png": "d1b4a516dbf4bf2a01f781e4bdd340af",
"assets/assets/icons/symbols/frxgbpusd.png": "8e568a6f779c412f5cd1baf6c3e3aa5a",
"assets/assets/icons/symbols/frxeurjpy.png": "aeb0d0b3064206ade4551fb584fa28aa",
"assets/assets/icons/symbols/cryltcusd.png": "d961cacac37de35b0c6f9d4fc55b7a1a",
"assets/assets/icons/symbols/stprng.png": "2c1de68d72d7f616c62fdb0c79bed45c",
"assets/assets/icons/symbols/wldaud.png": "2fe0b5f56a4b7e10335ab45a05533f26",
"assets/assets/icons/symbols/frxeurgbp.png": "64f2f86f9299d5408e355711023eca39",
"assets/assets/icons/symbols/wldxau.png": "15d97f02978d830b0d40c5ab885d3539",
"assets/assets/icons/symbols/otc_ndx.png": "c1d2bec8ca9dc9ca8aa8205d61f447a8",
"assets/assets/icons/symbols/frxusdchf.png": "73c02e4807d10f708314a493f0e68a95",
"assets/assets/icons/symbols/ltcusd.png": "49c0bf02c99cc70f164329d4c794b884",
"assets/assets/icons/symbols/1hz50v.png": "ca1f2126d70fc86cca2ca808afba73e5",
"assets/assets/icons/symbols/frxeurusd.png": "87d65825df117aa6320059e251870c85",
"assets/assets/icons/symbols/frxgbpaud.png": "b093bacf9b6b37256cbb7454d5c0c618",
"assets/assets/icons/symbols/frxbrousd.png": "db8cdc3fb067e7ede3c34671f4729c06",
"assets/assets/icons/symbols/1hz200v.png": "48e2e5414fc64e2b1bdb6e9d4f898d66",
"assets/assets/icons/symbols/jd10.png": "476427fae7af1535682199b14a0637e6",
"assets/assets/icons/symbols/frxusdnok.png": "d957fdfa55248112e72ee6eb0ad166b7",
"assets/assets/icons/symbols/otc_n225.png": "3292d39066ad579b4f98719da4325351",
"assets/assets/icons/symbols/xmrusd.png": "ecdce25fe2272992147875c80aa5564c",
"assets/assets/icons/symbols/otc_dji.png": "5431f4a3681ef9fbe32421ac87531e0d",
"assets/assets/icons/symbols/jd200.png": "71c8b672dafa03ff61e437067bda3145",
"assets/assets/icons/symbols/boom500.png": "ec41b2ed3470ea74bf5b4bc0197cee4f",
"assets/assets/icons/symbols/1hz10v.png": "9f4582fb123c907533d86092cb1d9baa",
"assets/assets/icons/symbols/frxxptusd.png": "6ae6a0220f76917758e82381568a0a9c",
"assets/assets/icons/symbols/wldeur.png": "d6cb32cec19edd8f358068a16b86ea56",
"assets/assets/icons/symbols/otc_gdaxi.png": "1319d58b3f166cba038ad455902d4649",
"assets/assets/icons/symbols/frxgbpcad.png": "be914c3dd3192d404b79e5f7d3f943f9",
"assets/assets/icons/symbols/frxxagusd.png": "52726410fea8214c4c94ca6e4b328247",
"assets/assets/icons/symbols/r_10.png": "3090d1f1213cf44d4de951ffe72579f6",
"assets/assets/icons/symbols/cryxmrusd.png": "272edb110a2628fc60d2fb0bd237cc50",
"assets/assets/icons/symbols/frxaudcad.png": "827bb3e47b0e64ddbf1bb5ae61a01033",
"assets/assets/icons/symbols/zecusd.png": "0585b34fb4febfffa9d61cb1c95e9f55",
"assets/assets/icons/symbols/frxaudnzd.png": "8a0984ff7646f0d9b97496bb4e8099a8",
"assets/assets/icons/symbols/crash1000.png": "8a28cf0b6da088f5e7e66cc7ff19b85d",
"assets/assets/icons/symbols/jd75.png": "99462c4c4b5032c8af1558c3a639a8b4",
"assets/assets/icons/symbols/cryxrpusd.png": "5d0c030de1adb482f7796945ae149117",
"assets/assets/icons/symbols/otc_fchi.png": "f9a69497fc71115c37d75216fcc20b6c",
"assets/assets/icons/symbols/frxusdsek.png": "de4d5275c29f934ade5b7528186aafa2",
"assets/assets/icons/symbols/frxgbpnzd.png": "cb7dd4cdb203d45e80e4faaf5e940217",
"assets/assets/icons/symbols/cryeosusd.png": "43ae4baee03d269a0b9fb525781173b9",
"assets/assets/icons/symbols/cryzecusd.png": "ea36d64aa57f4e1d44bc9c5ce9284ad9",
"assets/assets/icons/symbols/frxxpdusd.png": "3fd9da692e54ba8da043dee61bc62d4c",
"assets/assets/icons/symbols/r_75.png": "ac2b6b21fdbd825b23c4905f2b92603d",
"assets/assets/icons/symbols/xrpusd.png": "3c1edf55f4b1e20ac79ef9eeb0171545",
"assets/assets/icons/symbols/eosusd.png": "c1ab7f666c4bc67dfa6cccf9746165d1",
"assets/assets/icons/symbols/crybchusd.png": "e61eedb43a2f79f2c2c8b4c892c5f5fc",
"assets/assets/icons/symbols/boom300n.png": "64cbad2add96b626bc2d3d37838755c5",
"assets/assets/icons/symbols/jd100.png": "ec8bd86974b154e357650ba5a20916b7",
"assets/assets/icons/symbols/cryethusd.png": "d4520def9dba50f3758cbe869db8ce0f",
"assets/assets/icons/symbols/r_100.png": "76159a96ba97803b9eb024846f7e4dfe",
"assets/assets/icons/symbols/frxxauusd.png": "075478e155c016554bd9ce8c0c78bbb8",
"assets/assets/icons/symbols/frxusdjpy.png": "2a27170f100f619036d79e164566e005",
"assets/assets/icons/symbols/bchusd.png": "1433535ddc1ae0fec062c6cc8e5840d6",
"assets/assets/icons/symbols/ethusd.png": "bcdd0cd2cfcaa223c3d4ccef318fd503",
"assets/assets/icons/symbols/otc_sx5e.png": "ea3bd71efec331d541705e2271b3b766",
"assets/assets/icons/symbols/frxeurchf.png": "1a66826ef57b967efeb3e67673609eac",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
