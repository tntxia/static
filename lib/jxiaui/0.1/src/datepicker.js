module.exports = {
    name: 'jxiaui-datepicker',
    props: {
        value: {}
    },
    data() {
        return {
            inputText: null,
            showFlag: false,
            year: null,
            month: null,
            dateArr: []
        }
    },
    mounted() {
        let now = new Date();
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
        choose(d) {
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            let date = d.getDate();
            if (date < 10) {
                date = "0" + date;
            }

            this.inputText = year + "-" + month + "-" + date;
            this.showFlag = false;
            this.$emit("input", this.inputText);
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
    }
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