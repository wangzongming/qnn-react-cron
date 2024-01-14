import React, { useState, useEffect, useContext } from "react";
import { Tabs, Button } from "antd";
import SecondPane from "./SecondPane";
import MinutePane from "./MinutePane";
import HourPane from "./HourPane";
import DayPane from "./DayPane";
import MonthPane from "./MonthPane";
import WeekPane from "./WeekPane";
import YearPane from "./YearPanel";
import { secondRegex, minuteRegex, hourRegex, dayRegex, monthRegex, weekRegex, yearRegex } from "./cron-regex";
import "./index.less";

import QnnReactCronContext from "./GlobalContext";
QnnReactCronContext.displayName = "qnn-react-cron config provider";
const QnnReactCronContextProvider = QnnReactCronContext.Provider;

const { TabPane } = Tabs;

function Cron(props) {
	const { language = {} } = useContext(QnnReactCronContext);
	const { paneTitle = {} } = language;

	const { onChange, style, value, onOk, footer, getCronFns, panesShow = {} } = props;
	
	// 手动制定后不设置
	let defaultTab = props.defaultTab;
	if(!defaultTab){
		try {
			let [secondVal, minuteValue, hourVal, dayVal, monthVal, weekVal, yearVal] = value.split(" ");
			secondVal = secondRegex.test(secondVal) ? secondVal : "*";
			minuteValue = minuteRegex.test(minuteValue) ? minuteValue : "*";
			hourVal = hourRegex.test(hourVal) ? hourVal : "*";
			dayVal = dayRegex.test(dayVal) ? dayVal : "*";
			monthVal = monthRegex.test(monthVal) ? monthVal : "*";
			weekVal = weekRegex.test(weekVal) ? weekVal : "?";
			weekVal = dayVal !== "?" ? "?" : weekVal; 
			yearVal = yearRegex.test(yearVal) ? yearVal : "*";
			if(secondVal !== "?" && panesShow.second !== false ){ defaultTab="second" }
			else if(minuteValue !== "?" && panesShow.minute !== false){ defaultTab="minute" }
			else if(hourVal !== "?" && panesShow.hour !== false){ defaultTab="hour" }
			else if(dayVal !== "?" && panesShow.day !== false){ defaultTab="day" }
			else if(monthVal !== "?" && panesShow.month !== false){ defaultTab="month" }
			else if(weekVal !== "?" && panesShow.week !== false){ defaultTab="week" }
			else if(yearVal !== "?" && panesShow.year !== false){ defaultTab="year" }
		} catch (error) {  }
	}
	if(!defaultTab){
		if(panesShow.second !== false ){ defaultTab="second" }
		else if(panesShow.minute !== false){ defaultTab="minute" }
		else if(panesShow.hour !== false){ defaultTab="hour" }
		else if(panesShow.day !== false){ defaultTab="day" }
		else if(panesShow.month !== false){ defaultTab="month" }
		else if(panesShow.week !== false){ defaultTab="week" }
		else if(panesShow.year !== false){ defaultTab="year" } 
	}
	 
	const [currentTab, setCurrentTab] = useState(defaultTab);
	const [second, setSecond] = useState("*");
	const [minute, setMinute] = useState("*");
	const [hour, setHour] = useState("*");
	const [day, setDay] = useState("*");
	const [month, setMonth] = useState("*");
	const [week, setWeek] = useState("?");
	const [year, setYear] = useState("*");

	const onParse = () => {
		return new Promise((resolve) => {
			if (value) {
				try {
					let [secondVal, minuteValue, hourVal, dayVal, monthVal, weekVal, yearVal] = value.split(" ");
					secondVal = secondRegex.test(secondVal) ? secondVal : "*";
					minuteValue = minuteRegex.test(minuteValue) ? minuteValue : "*";
					hourVal = hourRegex.test(hourVal) ? hourVal : "*";
					dayVal = dayRegex.test(dayVal) ? dayVal : "*";
					monthVal = monthRegex.test(monthVal) ? monthVal : "*";
					weekVal = weekRegex.test(weekVal) ? weekVal : "?";
					weekVal = dayVal !== "?" ? "?" : weekVal;
					// console.log('yearVal', value.split(" "), yearVal, yearRegex.test(yearVal))
					// return;
					yearVal = yearRegex.test(yearVal) ? yearVal : "*";
					setSecond(secondVal);
					setMinute(minuteValue);
					setHour(hourVal);
					setDay(dayVal);
					setMonth(monthVal);
					setWeek(weekVal);
					setYear(yearVal);
					resolve({
						value,
						secondVal,
						minuteValue,
						hourVal,
						dayVal,
						monthVal,
						weekVal,
						yearVal,
					});
				} catch (error) {
					setSecond("*");
					setMinute("*");
					setHour("*");
					setDay("*");
					setMonth("*");
					setWeek("?");
					setYear("*");
					resolve({});
				}
			} else {
				setSecond("*");
				setMinute("*");
				setHour("*");
				setDay("*");
				setMonth("*");
				setWeek("?");
				setYear("*");
				resolve({});
			}
		});
	};

	const onGenerate = () => {
		if (onOk) {
			onOk([second, minute, hour, day, month, week, year].join(" "));
		}
	};

	const onChangeDay = (v) => {
		setDay(v);
		if (v !== "?") {
			setWeek("?");
		}
	};

	const onChangeWeek = (v) => {
		setWeek(v);
		if (v !== "?") {
			setDay("?");
		}
	};


	const changeInc = (value, changeFn, type) => {
		changeFn(value)
		onChange && onChange({ type, value });
	}

	useEffect(() => {
		getCronFns &&
			getCronFns({
				//设置值
				onParse,
				getValue: () => [second, minute, hour, day, month, week, year].join(" "),
			});
	});

	useEffect(() => {
		onParse();
	}, [value]);

	return (
		<div
			className={ 
				"qnn-react-cron"
			}
			style={style}
		>
			<Tabs
				activeKey={currentTab}
				onChange={setCurrentTab}
				// className={styles.Tabs}
				className={"Tabs"}
			>
				{panesShow.second !== false && (
					<TabPane tab={paneTitle.second || "秒"} key="second">
						<SecondPane value={second} onChange={val => changeInc(val, setSecond, "second")} />
					</TabPane>
				)}
				{panesShow.minute !== false && (
					<TabPane tab={paneTitle.minute || "分"} key="minute">
						<MinutePane value={minute} onChange={val => changeInc(val, setMinute, "minute")} />
					</TabPane>
				)}
				{panesShow.hour !== false && (
					<TabPane tab={paneTitle.hour || "时"} key="hour">
						<HourPane value={hour} onChange={val => changeInc(val, setHour, "hour")} />
					</TabPane>
				)}
				{panesShow.day !== false && (
					<TabPane tab={paneTitle.day || "日"} key="day">
						<DayPane value={day} onChange={val => changeInc(val, onChangeDay, "day")} />
					</TabPane>
				)}
				{panesShow.month !== false && (
					<TabPane tab={paneTitle.month || "月"} key="month">
						<MonthPane value={month} onChange={val => changeInc(val, setMonth, "month")} />
					</TabPane>
				)}
				{panesShow.week !== false && (
					<TabPane tab={paneTitle.week || "周"} key="week">
						<WeekPane value={week} onChange={val => changeInc(val, onChangeWeek, "week")} />
					</TabPane>
				)}
				{panesShow.year !== false && (
					<TabPane tab={paneTitle.year || "年"} key="year">
						<YearPane value={year} onChange={val => changeInc(val, setYear, "year")} />
					</TabPane>
				)}
			</Tabs>
			<div className={"footer"}>
				{footer === false || footer === null || footer ? (
					footer
				) : (
					<>
						<Button style={{ marginRight: 10 }} onClick={onParse}>
							解析到UI
						</Button>
						<Button type="primary" onClick={onGenerate}>
							生成
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
Cron.Provider = QnnReactCronContextProvider;
export default Cron;
