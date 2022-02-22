import React, { useContext } from "react";
import { Select } from "antd";
import GlobalContext from "./GlobalContext";

const weekOptions = {
	SUN: "星期日",
	MON: "星期一",
	TUE: "星期二",
	WED: "星期三",
	THU: "星期四",
	FRI: "星期五",
	SAT: "星期六",
};

export { weekOptions as weekOptionsObj };

function WeekSelect(props) {
	const {
		language = {},
	} = useContext(GlobalContext);
	const { week: weekOptionsByL } = language;
	return (
		<Select size="small" {...props}>
			{Object.entries(weekOptions).map(([weekCode, weekName]) => {
				return (
					<Select.Option key={weekCode} value={weekCode}>
						{weekOptionsByL?.[`${weekCode}`.toLocaleLowerCase()] || weekName}
					</Select.Option>
				);
			})}
		</Select>
	);
}

export default WeekSelect;
