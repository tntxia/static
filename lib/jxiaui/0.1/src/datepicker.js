// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 

Date.prototype.format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports = {
    name: 'jxiaui-datepicker',
    props: {
        value: {},
        format: {
            default: 'yyyy-MM-dd'
        },
        default: {}
    },
    data() {
        return {
            inputText: null,
            showFlag: false,
            year: null,
            yearEditing: false,
            month: null,
            dateArr: []
        }
    },
    mounted() {
        let now = new Date();
        if (this.default === 'now') {
            this.inputText = now.format(this.format);
        }
        let year = now.getFullYear();
        this.year = year;
        let month = now.getMonth();
        this.month = month;
        this.initDate();
    },
    methods: {
        emptyFun() {},
        initDate() {
            let year = this.year;
            let month = this.month;
            let firstDateOfMonth = getFirstDateOfMonth(year, month);
            let day = firstDateOfMonth.getDay();
            let gap = -day;
            this.dateArr = [];
            let dRow = [];
            this.dateArr.push(dRow);
            for (i = gap; i < 42 + gap; i++) {
                let d = new Date(year, month, i + 1);
                let m = d.getMonth();
                let date = d.getDate();
                if (dRow.length >= 7) {
                    dRow = [];
                    this.dateArr.push(dRow);
                }
                dRow.push({
                    label: d.getDate(),
                    isToday: isToday(year, m, date),
                    isCurrentMonth: m == month,
                    source: d
                });
            }
        },
        showCalendar() {
            let me = this;
            this.showFlag = true;
            document.addEventListener("click", hideCalendar, false);

            function hideCalendar() {
                me.showFlag = false;
                document.removeEventListener("click", hideCalendar, false);
            }
        },
        startEditYear() {
            this.yearEditing = true;
        },
        endEditYear() {
            this.yearEditing = false;
        },
        choose(d) {
            this.inputText = d.format(this.format);
            this.showFlag = false;
        },
        preYear() {
            this.year--;
            this.initDate();
        },
        preMonth() {
            this.month--;
            this.initDate();
        },
        nextMonth() {
            this.month++;
            this.initDate();
        },
        nextYear() {
            this.year++;
            this.initDate();
        }
    },
    watch: {
        inputText() {
            this.$emit("input", this.inputText);
        }
    },
}

function getFirstDateOfMonth(year, month) {
    return new Date(year, month, 1);
}

function isToday(year, month, date) {
    let now = new Date();
    return now.getFullYear() == year && now.getMonth() == month && now.getDate() == date;
}

function isThisMonth(d) {
    let year = d.getFullYear();
    let month = d.getMonth();

    let now = new Date();
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth();
    return year == nowYear && month == nowMonth;

}