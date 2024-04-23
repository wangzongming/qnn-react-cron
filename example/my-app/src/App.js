import './App.css';
import { Button } from "antd"

import React, { useRef } from "react";
import Cron from "qnn-react-cron2";

// 可使用 Cron.Provider 配置国际化语言
// 无需配置语言时，可不使用  Cron.Provider
// Cron.Provider 应该包裹于入口组件以实现全部路由下的组件内部语言都被自定义

const QnnCron = () => {

  const cronFnsRef = useRef();

  // language 为可选参数， 具体配置如下
  const language = {

    // 面板标题,
    // panel title,
    paneTitle: {
      second: "秒",
      minute: "分",
      hour: "时",
      day: "日",
      month: "月",
      week: "周",
      year: "年",
    },

    // assign  指定
    assign: "指定",
    // Don't assign  不指定
    donTAssign: "不指定",

    // Every minute ...   每一秒钟、每一分钟
    everyTime: {
      second: "每一秒钟",
      minute: "每一分钟",
      hour: "每一小时",
      day: "每一日",
      month: "每一月",
      week: "每一周",
      year: "每年",
    },

    // weel option  周选项
    week: {
      sun: "星期日",
      mon: "星期一",
      tue: "星期二",
      wed: "星期三",
      thu: "星期四",
      fri: "星期五",
      sat: "星期六",
    },

    // from [a] to [b] [unit], executed once [unit]    a 到 b 每一个时间单位执行一次
    aTob: {
      second: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}秒，每秒执行一次
        </span>
      ),
      minute: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}分，每分钟执行一次
        </span>
      ),
      hour: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}时，每小时执行一次
        </span>
      ),
      day: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}日，每日执行一次
        </span>
      ),
      month: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}月，每月执行一次
        </span>
      ),
      week: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}，每星期执行一次
        </span>
      ),
      year: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}年，每年执行一次
        </span>
      ),
    },

    // from [a] [unit] start, every [b] Execute once [unit]   从 a 开始, 每一个时间单位执行一次
    aStartTob: {
      second: (AInput, BInput) => (
        <span>
          从{AInput}秒开始，每{BInput}秒执行一次
        </span>
      ),
      minute: (AInput, BInput) => (
        <span>
          从{AInput}分开始，每{BInput}分执行一次
        </span>
      ),
      hour: (AInput, BInput) => (
        <span>
          从{AInput}时开始，每{BInput}小时执行一次
        </span>
      ),
      day: (AInput, BInput) => (
        <span>
          从{AInput}日开始，每{BInput}日执行一次
        </span>
      ),
      month: (AInput, BInput) => (
        <span>
          从{AInput}月开始，每{BInput}月执行一次
        </span>
      ),

      // [n] in the NTH week of this month    本月第 n 周的 星期[n] 执行一次
      week: (AInput, BInput) => (
        <span>
          本月第{AInput}周的{BInput}执行一次
        </span>
      ),

      // 本月的最后一个 星期[n] 执行一次
      week2: (AInput) => <span>月的最后一个{AInput}执行一次</span>,

      year: (AInput, BInput) => (
        <span>
          从{AInput}年开始，每{BInput}年执行一次
        </span>
      ),
    }

  };

  return <Cron.Provider value={{
    // Minimum optional year    最小可选择的年份
    minYear: new Date().getFullYear(),
    // Maximum optional year   最大可选择的年份
    maxYear: new Date().getFullYear() + 60,
    // language   国际化语言配置
    language
  }}>
    <Cron
      value="* * * * * ? *"

      // 配置面板的隐藏, false 即隐藏
      // Configuration panel hiding
      panesShow={{
        second: true,
        minute: true,
        hour: true,
        day: true,
        month: true,
        week: true,
        year: true,
      }}

      // 默认显示哪个面板, 默认为有值且未隐藏的第一个面板 或者 第一个未被隐藏的面板， 设置后将不会自动跳转到有值的面板，而是定死默认显示某个面板
      // Which panel is displayed by default. The default is the first panel that has a value and is not hidden or the first panel that is not hidden. After setting this parameter, the system does not automatically jump to the panel that has a value
      defaultTab={"second"}

      // 未自定义底部按钮时，用户点击确认按钮后的回调
      // The bottom button is not customized when the user clicks the confirm button after the callback
      onOk={(value) => {
        console.log("cron:", value);
      }}

      // 相当于 ref
      // equivalent to ref
      getCronFns={(fns) => {
        // 获取值方法
        // fns.getValue: () => string

        // 解析Cron表达式到UI 调用该方法才可以重新渲染 【一般不使用】(value值改变后组件会自动更新渲染)
        // fns.onParse: () => Promise().then(()=>void).catch(()=>()=>void),
        cronFnsRef.current = fns;
      }}

      // 自定义底部按钮后需要自行调用方法来或者值
      // After customizing the bottom button, you need to call the method or value
      footer={[
        //默认值
        <Button key="1" style={{ marginRight: 10 }} onClick={() => cronFnsRef.current.onParse("* * * * * ? *")}>
          解析到UI
        </Button>,
        <Button key="2" type="primary" onClick={() => console.log(cronFnsRef.current.getValue())}>
          生成
        </Button>
      ]}

      // onChange 事件，当值改变时触发 
      // onChange event, triggered when the value changes 
      // @param type = "second" | "minute" | "hour" | "day" | "month" | "week" | "year"
      // @param value = string
      onChange={({ type, value }) => {
        console.log(type, value)
      }}
    />
  </Cron.Provider>
}

function App() {
  return (
    <div className="App">
      <h1 style={{ padding: 50, textAlign: "center" }}>qnn-react-cron 组件测试</h1>

      <div style={{ width: 800, margin: "0 auto" }}>
        <QnnCron />
      </div>
    </div>
  );
}

export default App;
