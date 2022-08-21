/**
 * Build with ZMake tool
 */

// Build at 2022-08-20 01:43:18.791842
(() => {

  // Convert sloar to luoar. Source: https://github.com/xm2by/fragment/blob/master/%E5%85%AC%E5%8E%86%E8%BD%AC%E5%86%9C%E5%8E%86/sloarToLunar.js
  // 农历1949-2100年查询表
  let lunarYearArr = [
    0x0b557, //1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
    0x0d520 //2100
  ],
    lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    lunarDay = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'],
    tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 公历转农历函数
  function sloarToLunar(sy, sm, sd) {
    // 输入的月份减1处理
    sm -= 1;

    // 计算与公历基准的相差天数
    // Date.UTC()返回的是距离公历1970年1月1日的毫秒数,传入的月份需要减1
    let daySpan = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;
    let ly, lm, ld;
    // 确定输出的农历年份
    for (let j = 0; j < lunarYearArr.length; j++) {
      daySpan -= lunarYearDays(lunarYearArr[j]);
      if (daySpan <= 0) {
        ly = 1949 + j;
        // 获取农历年份确定后的剩余天数
        daySpan += lunarYearDays(lunarYearArr[j]);
        break
      }
    }

    // 确定输出的农历月份
    for (let k = 0; k < lunarYearMonths(lunarYearArr[ly - 1949]).length; k++) {
      daySpan -= lunarYearMonths(lunarYearArr[ly - 1949])[k];
      if (daySpan <= 0) {
        // 有闰月时，月份的数组长度会变成13，因此，当闰月月份小于等于k时，lm不需要加1
        if (hasLeapMonth(lunarYearArr[ly - 1949]) && hasLeapMonth(lunarYearArr[ly - 1949]) <= k) {
          if (hasLeapMonth(lunarYearArr[ly - 1949]) < k) {
            lm = k;
          } else if (hasLeapMonth(lunarYearArr[ly - 1949]) === k) {
            lm = '闰' + k;
          } else {
            lm = k + 1;
          }
        } else {
          lm = k + 1;
        }
        // 获取农历月份确定后的剩余天数
        daySpan += lunarYearMonths(lunarYearArr[ly - 1949])[k];
        break
      }
    }

    // 确定输出农历哪一天
    ld = daySpan;

    // 将计算出来的农历月份转换成汉字月份，闰月需要在前面加上闰字
    if (hasLeapMonth(lunarYearArr[ly - 1949]) && (typeof (lm) === 'string' && lm.indexOf('闰') > -1)) {
      lm = `闰${lunarMonth[/\d/.exec(lm) - 1]}`
    } else {
      lm = lunarMonth[lm - 1];
    }

    // 将计算出来的农历年份转换为天干地支年
    ly = getTianGan(ly) + getDiZhi(ly);

    // 将计算出来的农历天数转换成汉字
    if (ld < 11) {
      ld = `${lunarDay[10]}${lunarDay[ld - 1]}`
    } else if (ld > 10 && ld < 20) {
      ld = `${lunarDay[9]}${lunarDay[ld - 11]}`
    } else if (ld === 20) {
      ld = `${lunarDay[1]}${lunarDay[9]}`
    } else if (ld > 20 && ld < 30) {
      ld = `${lunarDay[11]}${lunarDay[ld - 21]}`
    } else if (ld === 30) {
      ld = `${lunarDay[2]}${lunarDay[9]}`
    }
    return {
      lunarYear: ly,
      lunarMonth: lm,
      lunarDay: ld,
    }
  }

  // 计算农历年是否有闰月，参数为存储农历年的16进制
  // 农历年份信息用16进制存储，其中16进制的最后1位可以用于判断是否有闰月
  function hasLeapMonth(ly) {
    // 获取16进制的最后1位，需要用到&与运算符
    if (ly & 0xf) {
      return ly & 0xf
    } else {
      return false
    }
  }

  // 如果有闰月，计算农历闰月天数，参数为存储农历年的16进制
  // 农历年份信息用16进制存储，其中16进制的第1位（0x除外）可以用于表示闰月是大月还是小月
  function leapMonthDays(ly) {
    if (hasLeapMonth(ly)) {
      // 获取16进制的第1位（0x除外）
      return (ly & 0xf0000) ? 30 : 29
    } else {
      return 0
    }
  }

  // 计算农历一年的总天数，参数为存储农历年的16进制
  // 农历年份信息用16进制存储，其中16进制的第2-4位（0x除外）可以用于表示正常月是大月还是小月
  function lunarYearDays(ly) {
    let totalDays = 0;

    // 获取正常月的天数，并累加
    // 获取16进制的第2-4位，需要用到>>移位运算符
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      let monthDays = (ly & i) ? 30 : 29;
      totalDays += monthDays;
    }
    // 如果有闰月，需要把闰月的天数加上
    if (hasLeapMonth(ly)) {
      totalDays += leapMonthDays(ly);
    }

    return totalDays
  }

  // 获取农历每个月的天数
  // 参数需传入16进制数值
  function lunarYearMonths(ly) {
    let monthArr = [];

    // 获取正常月的天数，并添加到monthArr数组中
    // 获取16进制的第2-4位，需要用到>>移位运算符
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      monthArr.push((ly & i) ? 30 : 29);
    }
    // 如果有闰月，需要把闰月的天数加上
    if (hasLeapMonth(ly)) {
      monthArr.splice(hasLeapMonth(ly), 0, leapMonthDays(ly));
    }

    return monthArr
  }

  // 将农历年转换为天干，参数为农历年
  function getTianGan(ly) {
    let tianGanKey = (ly - 3) % 10;
    if (tianGanKey === 0) tianGanKey = 10;
    return tianGan[tianGanKey - 1]
  }

  // 将农历年转换为地支，参数为农历年
  function getDiZhi(ly) {
    let diZhiKey = (ly - 3) % 12;
    if (diZhiKey === 0) diZhiKey = 12;
    return diZhi[diZhiKey - 1]
  }

  function getQinMingJieDate(fullYear) {
    //清明节的日期是不固定的，规律是：闰年开始的前2年是4月4日，闰年开始的第3年和第4年是4月5日
    if (isLeapYear(fullYear) || isLeapYear(fullYear - 1)) {
      return '4.4';
    }
    else {
      return '4.5';
    }
  }

  //判断是否是闰年
  function isLeapYear(Year) {
    if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
      return (true);
    } else { return (false); }
  }

  class FsUtils {
    static writeText(fn, data) {
      if (!fn.startsWith("/storage")) fn = FsUtils.fullPath(fn);

      try {
        hmFS.remove(fn);
      } catch (e) { }

      const buffer = FsUtils.strToUtf8(data);
      const f = FsUtils.open(fn, hmFS.O_WRONLY | hmFS.O_CREAT);
      hmFS.write(f, buffer, 0, buffer.byteLength);
      hmFS.close(f);
    }

    static read(fn, limit = false) {
      if (!fn.startsWith("/storage")) fn = FsUtils.fullPath(fn);
      const [st, e] = FsUtils.stat(fn);
      const f = FsUtils.open(fn, hmFS.O_RDONLY);

      const size = limit ? limit : st.size;
      const data = new ArrayBuffer(size);
      hmFS.read(f, data, 0, size);
      hmFS.close(f);

      return data;
    }

    static fetchTextFile(fn, limit = false) {
      const data = FsUtils.read(fn, limit);

      const view = new Uint8Array(data);
      let str = "";

      return FsUtils.Utf8ArrayToStr(view);
    }

    static stat(path) {
      if (path.startsWith("/storage")) {
        const statPath = "../../../" + path.substring(9);
        return hmFS.stat_asset(statPath);
      }

      return hmFS.stat(path);
    }

    static open(path, m) {
      if (path.startsWith("/storage")) {
        const statPath = "../../../" + path.substring(9);
        return hmFS.open_asset(statPath, m);
      }

      return hmFS.open(path, m);
    }

    static fetchJSON(fn) {
      const text = FsUtils.fetchTextFile(fn);
      return JSON.parse(text);
    }

    static getSelfPath() {
      const pkg = hmApp.packageInfo();
      const idn = pkg.appId.toString(16).padStart(8, "0").toUpperCase();
      return "/storage/js_" + pkg.type + "s/" + idn;
    }

    static fullPath(path) {
      return FsUtils.getSelfPath() + "/assets/" + path;
    }

    static rmTree(path) {
      if (!path.startsWith("/storage")) path = FsUtils.fullPath(path);

      const [files, e] = hmFS.readdir(path);

      for (let i in files) {
        FsUtils.rmTree(path + "/" + files[i]);
      }

      console.log(path);
      hmFS.remove(path);
    }

    static sizeTree(path) {
      if (!path.startsWith("/storage")) path = FsUtils.fullPath(path);

      const [files, e] = hmFS.readdir(path);
      let value = 0;

      for (let fn in files) {
        const file = path + "/" + files[fn];
        const statPath = "../../../" + file.substring(9);
        const [st, e] = hmFS.stat_asset(statPath);
        value += st.size ? st.size : FsUtils.sizeTree(file);
      }

      return value;
    }

    // https://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    static strToUtf8(str) {
      var utf8 = [];
      for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
            0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f));
        } else {
          i++;
          charcode = 0x10000 + (((charcode & 0x3ff) << 10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >> 18),
            0x80 | ((charcode >> 12) & 0x3f),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f));
        }
      }

      return new Uint8Array(utf8).buffer;
    }

    // source: https://stackoverflow.com/questions/13356493/decode-utf-8-with-javascript
    static Utf8ArrayToStr(array) {
      var out, i, len, c;
      var char2, char3;

      out = "";
      len = array.length;
      i = 0;
      while (i < len) {
        c = array[i++];
        switch (c >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
          case 12:
          case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(
              ((c & 0x1f) << 6) | (char2 & 0x3f)
            );
            break;
          case 14:
            // 1110 xxxx  10xx xxxx  10xx xxxx
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode(
              ((c & 0x0f) << 12) |
              ((char2 & 0x3f) << 6) |
              ((char3 & 0x3f) << 0)
            );
            break;
        }
      }

      return out;
    }

    static printBytes(val) {
      const options = ["B", "KB", "MB"];
      let curr = 0;

      while (val > 800 && curr < options.length) {
        val = val / 1000;
        curr++;
      }

      return Math.round(val * 100) / 100 + " " + options[curr];
    }
  }

  // source: C:\Users\hdff0\Desktop\mb7_apps\calendar\src\AppCalendar.js
  class AppCalendar {
    columns = [];

    /**
     * Fetch all required data
     */
    constructor() {
      const time = hmSensor.createSensor(hmSensor.id.TIME);

      this._data = FsUtils.fetchJSON("highlights.json");

      this.today = time.year + "-" +
        String(time.month) + "-" +
        String(time.day);

      this.currentMonth = time.month;
      this.currentYear = time.year;
    }

    /**
     * Render base UI
     */
    start() {
      this.todayHighlight = hmUI.createWidget(hmUI.widget.STROKE_RECT, {
        w: 26,
        h: 20,
        color: 0xff2222,
        line_width: 2,
        x: -20,
        y: -20,
        radius: 4
      })

      this.display = hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: 32,
        w: 192,
        h: 100,
        color: 0xffffff,
        text_size: 24,
        text: "Hello",
        align_h: hmUI.align.CENTER_H,
      });

      for (let i = 0; i < 7; i++) {
        this.columns.push(
          hmUI.createWidget(hmUI.widget.TEXT, {
            x: 5 + 26 * i,
            y: 108,
            w: 26,
            h: 180,
            color: i > 4 ? 0xffaaaa : 0xffffff,
            text_size: 16,
            align_h: hmUI.align.CENTER_H,
            text: "0\n1\n2",
          })
        );
      }

      this.highlights = hmUI.createWidget(hmUI.widget.TEXT, {
        x: 12,
        y: 288,
        w: 168,
        h: 0,
        text_size: 18,
        text_style: hmUI.text_style.WRAP,
        color: 0xeeeeee,
        text: "..."
      });

      this.laodContent();

      hmUI.createWidget(hmUI.widget.IMG, {
        x: 0,
        y: 100,
        w: 96,
        h: 260 - 72,
        src: "",
      }).addEventListener(hmUI.event.CLICK_UP, () => {
        this.switchPage(-1);
      });

      hmUI.createWidget(hmUI.widget.IMG, {
        x: 96,
        y: 100,
        w: 96,
        h: 260 - 72,
        src: "",
      }).addEventListener(hmUI.event.CLICK_UP, () => {
        this.switchPage(1);
      });
    }

    /**
     * Change page
     */
    switchPage(delta) {
      this.currentMonth += delta;
      if (this.currentMonth < 1) {
        if (this.currentYear - 2 < 1949) {
          this.currentMonth -= delta;
          return;
        }
        this.currentYear--;
        this.currentMonth = 12;
      } else if (this.currentMonth > 12) {
        if (this.currentYear + 2 > 2100) {
          this.currentMonth -= delta;
          return;
        }
        this.currentYear++;
        this.currentMonth = 1;
      }
      this.laodContent();
    }

    /**
     * Load page content
     */
    laodContent() {
      this.display.setProperty(
        hmUI.prop.TEXT,
        this.currentYear + "-" + this.currentMonth
      );

      // Start/finish date
      const date = new Date(this.currentYear, this.currentMonth - 1);
      const end = new Date(this.currentYear, this.currentMonth);

      // Prepare columns array
      const columns = ["一\n", "二\n", "三\n", "四\n", "五\n", "六\n", "日\n"];
      const voids = (date.getDay() + 6) % 7;
      for (let i = 0; i < voids; i++) columns[i] += "\n";

      // Iterate days from date to end
      let highlights = "", todayX = -20, todayY = -20;
      while (date < end) {
        const column = (date.getDay() + 6) % 7;

        if (date.getMonth() === this.currentMonth - 1) {
          columns[column] += date.getDate();

          const hl = this.currentMonth + "." + date.getDate();

          const lunar = sloarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
          const lunarHL = lunar.lunarMonth + "月" + lunar.lunarDay;

          if (this._data[hl]) {
            highlights += hl + ": " + this._data[hl] + "\n";
          }
          if (this._data[lunarHL]) {
            highlights += hl + ": " + this._data[lunarHL] + "\n";
          }

          if (hl == '4.4' || hl == '4.5'); {
            const qmDate = getQinMingJieDate(date.getFullYear());
            if (qmDate == hl) {
              highlights += hl + ": " + "清明节" + "\n";
            }
          }
        }

        // Find column, append value
        columns[column] += "\n";

        // Today highlight
        const str = date.getFullYear() + "-" +
          (date.getMonth() + 1) + "-" + date.getDate();

        if (str == this.today) {
          const columnLines = columns[column].split("\n");

          todayX = 5 + 26 * (column);
          todayY = 111 + 24 * (columnLines.length - 2);
        }

        // Next day
        date.setDate(date.getDate() + 1);
      }

      // Update columns
      for (let i = 0; i < columns.length; i++) {
        this.columns[i].setProperty(hmUI.prop.TEXT, columns[i]);
      }

      // Update today highlight
      this.todayHighlight.setProperty(hmUI.prop.MORE, {
        x: todayX,
        y: todayY
      })

      // Update highlights
      if (!highlights) highlights = "无节日";
      const metrics = hmUI.getTextLayout(highlights, {
        text_size: 18,
        text_width: 168
      });
      this.highlights.setProperty(hmUI.prop.TEXT, highlights);
      this.highlights.setProperty(hmUI.prop.MORE, {
        h: metrics.height + 80
      })
    }
  }

  // source: C:\Users\hdff0\Desktop\mb7_apps\calendar\entrypoint.js
  let __$$app$$__ = __$$hmAppManager$$__.currentApp;
  let __$$module$$__ = __$$app$$__.current;
  __$$module$$__.module = DeviceRuntimeCore.Page({
    onInit() {
      const cal = new AppCalendar();
      cal.start();
    },
  });



})();
