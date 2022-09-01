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

	const { style, value, onOk, footer, getCronFns, panesShow = {}, defaultTab = "second" } = props;
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
				// styles.cron
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
						<SecondPane value={second} onChange={setSecond} />
					</TabPane>
				)}
				{panesShow.minute !== false && (
					<TabPane tab={paneTitle.minute || "分"} key="minute">
						<MinutePane value={minute} onChange={setMinute} />
					</TabPane>
				)}
				{panesShow.hour !== false && (
					<TabPane tab={paneTitle.hour || "时"} key="hour">
						<HourPane value={hour} onChange={setHour} />
					</TabPane>
				)}
				{panesShow.day !== false && (
					<TabPane tab={paneTitle.day || "日"} key="day">
						<DayPane value={day} onChange={onChangeDay} />
					</TabPane>
				)}
				{panesShow.month !== false && (
					<TabPane tab={paneTitle.month || "月"} key="month">
						<MonthPane value={month} onChange={setMonth} />
					</TabPane>
				)}
				{panesShow.week !== false && (
					<TabPane tab={paneTitle.week || "周"} key="week">
						<WeekPane value={week} onChange={onChangeWeek} />
					</TabPane>
				)}
				{panesShow.year !== false && (
					<TabPane tab={paneTitle.year || "年"} key="year">
						<YearPane value={year} onChange={setYear} />
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
