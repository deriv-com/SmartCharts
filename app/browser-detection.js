function browserDetect(rootEleId, SupportedBrowsers){
    var cqRoot = document.getElementById(rootEleId);

    function detect() {
      if (typeof navigator !== 'undefined') {
          var userAgentString = navigator.userAgent;
          var browsers = getBrowserRules();
          if (!userAgentString) {
            return null;
          }

          var detected = browsers.map(function(browser) {
            var match = browser.rule.exec(userAgentString);
            var version = match && match[1].split(/[._]/).slice(0,3);

            if (version && version.length < 3) {
              version = version.concat(version.length == 1 ? [0, 0] : [0]);
            }

            return match && {
              name: browser.name,
              version: version.join('.')
            };
          }).filter(Boolean)[0] || null;

          if (detected) {
            detected.os = detectOS(userAgentString);
          }

          if (/alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/i.test(userAgentString)) {
            detected = detected || {};
            detected.bot = true;
          }

          return detected;

      }
    }

    function detectOS(userAgentString) {
      var rules = getOperatingSystemRules();
      var detected = rules.filter(function (os) {
        return os.rule && os.rule.test(userAgentString);
      })[0];

      return detected ? detected.name : null;
    }

    function getNodeVersion() {
      var isNode = typeof process !== 'undefined' && process.version;
      return isNode && {
        name: 'node',
        version: process.version.slice(1),
        os: process.platform
      };
    }

    function getBrowserRules() {
      return buildRules([
        [ 'aol', /AOLShield\/([0-9\._]+)/ ],
        [ 'edge', /Edge\/([0-9\._]+)/ ],
        [ 'yandexbrowser', /YaBrowser\/([0-9\._]+)/ ],
        [ 'vivaldi', /Vivaldi\/([0-9\.]+)/ ],
        [ 'kakaotalk', /KAKAOTALK\s([0-9\.]+)/ ],
        [ 'samsung', /SamsungBrowser\/([0-9\.]+)/ ],
        [ 'chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
        [ 'phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/ ],
        [ 'crios', /CriOS\/([0-9\.]+)(:?\s|$)/ ],
        [ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
        [ 'fxios', /FxiOS\/([0-9\.]+)/ ],
        [ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
        [ 'opera', /OPR\/([0-9\.]+)(:?\s|$)$/ ],
        [ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/ ],
        [ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
        [ 'ie', /MSIE\s(7\.0)/ ],
        [ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
        [ 'android', /Android\s([0-9\.]+)/ ],
        [ 'ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/ ],
        [ 'safari', /Version\/([0-9\._]+).*Safari/ ],
        [ 'facebook', /FBAV\/([0-9\.]+)/],
        [ 'instagram', /Instagram\ ([0-9\.]+)/],
        [ 'ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/]
      ]);
    }

    function getOperatingSystemRules() {
      return buildRules([
        [ 'iOS', /iP(hone|od|ad)/ ],
        [ 'Android OS', /Android/ ],
        [ 'BlackBerry OS', /BlackBerry|BB10/ ],
        [ 'Windows Mobile', /IEMobile/ ],
        [ 'Amazon OS', /Kindle/ ],
        [ 'Windows 3.11', /Win16/ ],
        [ 'Windows 95', /(Windows 95)|(Win95)|(Windows_95)/ ],
        [ 'Windows 98', /(Windows 98)|(Win98)/ ],
        [ 'Windows 2000', /(Windows NT 5.0)|(Windows 2000)/ ],
        [ 'Windows XP', /(Windows NT 5.1)|(Windows XP)/ ],
        [ 'Windows Server 2003', /(Windows NT 5.2)/ ],
        [ 'Windows Vista', /(Windows NT 6.0)/ ],
        [ 'Windows 7', /(Windows NT 6.1)/ ],
        [ 'Windows 8', /(Windows NT 6.2)/ ],
        [ 'Windows 8.1', /(Windows NT 6.3)/ ],
        [ 'Windows 10', /(Windows NT 10.0)/ ],
        [ 'Windows ME', /Windows ME/ ],
        [ 'Open BSD', /OpenBSD/ ],
        [ 'Sun OS', /SunOS/ ],
        [ 'Linux', /(Linux)|(X11)/ ],
        [ 'Mac OS', /(Mac_PowerPC)|(Macintosh)/ ],
        [ 'QNX', /QNX/ ],
        [ 'BeOS', /BeOS/ ],
        [ 'OS/2', /OS\/2/ ],
        [ 'Search Bot', /(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/ ]
      ]);
    }

    function buildRules(ruleTuples) {
      return ruleTuples.map(function(tuple) {
        return {
          name: tuple[0],
          rule: tuple[1]
        };
      });
    }

    function renderNotSupported(){
        var cqNotSupported = document.createElement('div');
        cqNotSupported.style.cssText = 'background:#fff url("./dist/app/assets/bg-not-supported.svg") repeat scroll center center;position:fixed;width:100%;height:100%;font-family:"Roboto";font-style:normal;line-height:1.5;letter-spacing:normal;text-align:center;color:#333333;';

        var cqLogo = document.createElement('div');
        cqLogo.style.cssText = 'background:url("./dist/app/assets/binary-logo.svg") no-repeat scroll center center;width:139px;height:32px;margin-bottom:8%;padding:20px;';
        cqNotSupported.appendChild(cqLogo);

        var cqIconNotSupported = document.createElement('div');
        cqIconNotSupported.style.cssText = 'background:url("./dist/app/assets/icon-not-supported.svg") no-repeat scroll center center / 160px 160px;width:160px;height:160px;margin:auto;';
        cqNotSupported.appendChild(cqIconNotSupported);

        var cqH1 = document.createElement('h1');
        cqH1.innerHTML = 'YOUR BROWSER IS NOT SUPPORTED';
        cqH1.style.cssText = 'font-family:"Roboto";font-size:24px;font-weight:bold;text-transform:uppercase;';
        cqNotSupported.appendChild(cqH1);

        var cqP = document.createElement('p');
        cqP.innerHTML = 'Please update your browser for the best trading experience.';
        cqP.style.cssText = 'font-family:"Roboto";font-size:20px;font-weight:normal;';
        cqNotSupported.appendChild(cqP);

        var cqA = document.createElement('a');
        cqA.href = 'http://outdatedbrowser.com/';
        cqA.innerHTML = 'Update Browser';
        cqA.style.cssText = 'background:#e98024;border-radius:4px;font-family:"Roboto";color:#fff;padding:10px;font-size:14px;font-weight:500;text-align:center;text-transform:uppercase;text-decoration:none;';
        cqNotSupported.appendChild(cqA);
        
        if (cqRoot.nextSibling) {
            cqRoot.parentNode.insertBefore(cqNotSupported, cqRoot.nextSibling);
        } else {
            cqRoot.parentNode.appendChild(cqNotSupported);
        }
        cqRoot.parentNode.removeChild(cqRoot);
    }

    window.onerror = function(message, source, lineno, colno, error){
        if (
                (
                    message.indexOf('[mobx] MobX 5+ requires Proxy objects') !== -1 ||
                    message.indexOf('not supported browser') !== -1 
                ) && cqRoot
            ) {
            renderNotSupported();
        }
    }

    var browser = detect();
    if (browser) {
        var version = parseInt(browser.version.split('.').join(''));
        var name = browser.name;
        var os = browser.os;

        if (
            SupportedBrowsers[os] && 
            SupportedBrowsers[os][name] !== undefined) {
            if(version < SupportedBrowsers[os][name]){
                throw new Error('not supported browser');
            }
        }
    }
}

browserDetect('root', {
    'Mac OS': {
        safari: 1012,
        firefox: 2700,
        chrome: 4902623,
        opera: 3602130,
        yandexbrowser: 14122130,
    },
    'Windows 10': {
        edge: 16162990,
        ie: 0, // not supported
        firefox: 3200,
        chrome: 4902623,
        opera: 3602130,
        yandexbrowser: 14122130,
    },
    'Windows 8.1': {
        ie: 0, // not supported at all
        firefox: 2700,
        chrome: 4902623,
        opera: 3602130,
        yandexbrowser: 14122130,
    },
    'Windows 8': {
        ie: 0, // not supported at all
        firefox: 2800,
        chrome: 4902623,
        opera: 3602130,
        yandexbrowser: 14122130,
    },
    'Windows 7': {
        ie: 0, // not supported at all
        firefox: 2700,
        chrome: 4902623,
        opera: 3602130,
        yandexbrowser: 14122130,
    },
});


