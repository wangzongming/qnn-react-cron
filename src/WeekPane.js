import React, { useState, useMemo, useEffect, useCallback, useContext } from "react";
import { Radio, Checkbox, Row, Col, InputNumber } from "antd";
import WeekSelect, { weekOptionsObj } from "./WeekSelect";
import GlobalContext from "./GlobalContext";

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const radioStyle = {
	display: "block",
	paddingBottom: "6px",
};

const weekOptions = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function WeekPane(props) {
	const { language = {} } = useContext(GlobalContext);
	const { assign, donTAssign, everyTime = {}, aTob = {}, aStartTob = {}, week: weekOptionsByL } = language;
	const { value, onChange } = props;
	const [currentRadio, setCurrentRadio] = useState(2);
	const [from, setFrom] = useState("SUN");
	const [to, setTo] = useState("MON");
	const [weekOfMonth, setWeekOfMonth] = useState(1);
	const [dayOfWeek, setDayOfWeek] = useState("MON");
	const [lastWeekOfMonth, setLastWeekOfMonth] = useState("MON");
	const [selected, setSelected] = useState(["MON"]);

	const isFirstRender = React.useRef();
	if (isFirstRender.current !== false) {
		isFirstRender.current = true;
	}
	useEffect(() => {
		if (value === "*") {
			setCurrentRadio(1);
		} else if (value === "?") {
			setCurrentRadio(2);
		} else if (value.indexOf("-") > -1) {
			setCurrentRadio(3);
			const [defaultFrom, defaultTo] = value.split("-");
			setFrom(defaultFrom);
			setTo(defaultTo);
		} else if (value.indexOf("#") > -1) {
			setCurrentRadio(4);
			const [defaultDayOfWeek, defaultWeekOfMonth] = value.split("#");
			setWeekOfMonth(parseInt(defaultWeekOfMonth, 10));
			setDayOfWeek(defaultDayOfWeek);
		} else if (value.indexOf("L") > -1) {
			setCurrentRadio(5);
			const [defaultLastWeekOfMonth] = value.split("L");
			setLastWeekOfMonth(defaultLastWeekOfMonth);
		} else {
			setCurrentRadio(6);
			setSelected(value ? value.split(",") : ["MON"]);
		}
	}, [value]);

	useEffect(() => {
		if (!isFirstRender.current) {
			switch (currentRadio) {
				case 1:
					onChange("*");
					break;
				case 2:
					onChange("?");
					break;
				case 3:
					onChange(`${from}-${to}`);
					break;
				case 4:
					onChange(`${dayOfWeek}#${weekOfMonth}`);
					break;
				case 5:
					onChange(`${lastWeekOfMonth}L`);
					break;
				case 6:
					onChange(selected.join(","));
					break;
				default:
					break;
			}
		}
	}, [currentRadio, from, to, weekOfMonth, dayOfWeek, lastWeekOfMonth, selected]);

	const onChangeRadio = useCallback((e) => {
		setCurrentRadio(e.target.value);
	}, []);

	const onChangeFrom = useCallback((v) => {
		setFrom(v || "MON");
	}, []);

	const onChangeTo = useCallback((v) => {
		setTo(v || "MON");
	}, []);

	const onChangeWeekOfMonth = useCallback((v) => {
		setWeekOfMonth(v || 1);
	}, []);

	const onChangeDayOfWeek = useCallback((v) => {
		setDayOfWeek(v || "MON");
	}, []);

	const onChangeLastWeekOfMonth = useCallback((v) => {
		setLastWeekOfMonth(v || "MON");
	}, []);

	const onChangeSelected = useCallback((v) => {
		setSelected(v.length !== 0 ? v : ["MON"]);
	}, []);

	const checkList = useMemo(() => {
		const disabled = currentRadio !== 6;
		return weekOptions.map((item) => {
			return (
				<Col key={item} span={3}>
					<Checkbox disabled={disabled} value={item}>
						{weekOptionsByL?.[`${item}`.toLocaleLowerCase()] || weekOptionsObj[item]}
					</Checkbox>
				</Col>
			);
		});
	}, [currentRadio, selected]);

	useEffect(() => {
		isFirstRender.current = false;
	}, []);

	const aTobA = <WeekSelect disabled={currentRadio !== 3} value={from} size="small" onChange={onChangeFrom} style={{ width: 100 }} />;
	const aTobB = <WeekSelect disabled={currentRadio !== 3} value={to} size="small" onChange={onChangeTo} style={{ width: 100 }} />;

	const aStartTobA = <InputNumber disabled={currentRadio !== 4} min={0} max={5} value={weekOfMonth} size="small" onChange={onChangeWeekOfMonth} style={{ width: 100 }} />;
	const aStartTobB = <WeekSelect disabled={currentRadio !== 4} value={dayOfWeek} size="small" onChange={onChangeDayOfWeek} style={{ width: 100 }} />;

	const aStartTob2A = <WeekSelect disabled={currentRadio !== 5} value={lastWeekOfMonth} size="small" onChange={onChangeLastWeekOfMonth} style={{ width: 100 }} />;

	return (
		<RadioGroup name="radiogroup" value={currentRadio} onChange={onChangeRadio} style={{ width: "100%" }}>
			<Radio style={radioStyle} value={1}>
				{everyTime.week || "每一周"}
			</Radio>

			<Radio style={radioStyle} value={2}>
				{donTAssign || "不指定"}
			</Radio>

			<span style={{ display: "flex", alignItems: "center", fontSize: 14 }}>
				<Radio style={radioStyle} value={3} />
				{aTob.week ? (
					aTob.week(aTobA, aTobB)
				) : (
					<>
						从&nbsp;
						{aTobA}
						&nbsp;-&nbsp;
						{aTobB}
						&nbsp;，每星期执行一次
					</>
				)}
			</span>

			<span style={{ display: "flex", alignItems: "center", fontSize: 14 }}>
				<Radio style={radioStyle} value={4} />
				{aStartTob.week ? (
					aStartTob.week(aStartTobA, aStartTobB)
				) : (
					<>
						本月第&nbsp;
						{aStartTobA}
						&nbsp;周的&nbsp;
						{aStartTobB}
						&nbsp;执行一次
					</>
				)}
			</span>

			<span style={{ display: "flex", alignItems: "center", fontSize: 14 }}>
				<Radio style={radioStyle} value={5} />
				{aStartTob.week2 ? (
					aStartTob.week2(aStartTob2A)
				) : (
					<>
						本月的最后一个&nbsp;
						{aStartTob2A}
						&nbsp;执行一次
					</>
				)}
			</span>

			<Radio style={radioStyle} value={6}>
				{assign || "指定"}
				<br />
				<CheckboxGroup value={selected} onChange={onChangeSelected} style={{ width: "100%" }}>
					<Row>{checkList}</Row>
				</CheckboxGroup>
			</Radio>
		</RadioGroup>
	);
}

export default WeekPane;
