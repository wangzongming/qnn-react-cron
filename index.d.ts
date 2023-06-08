import React from "react";
import * as React from "react";
export interface CronFns {
	// 解析Cron表达式到UI
	onParse: () => Promise<any>;
	getValue: () => string;
}
export interface CronProps {
	/**
	 * Cron表达式，用来解析到UI
	 */

	value?: string;
	/**
	 * 样式
	 */

	style?: React.CSSProperties;

	/**
	 * 点击生成按钮时调用该回调
	 */
	onOk?: (value: string) => void;

	/**
	 * 底部按钮
	 */
	footer?: boolean | React.ReactNode;

	/**
	 * 获取组件方法
	 */
	getCronFns?: (cronFns: CronFns) => void

	/**
	 * 配置面板的隐藏, false 即隐藏
	 * Configuration panel hiding
	 */

	panesShow: {
		second: boolean;
		minute: boolean;
		hour: boolean;
		day: boolean;
		month: boolean;
		week: boolean;
		year: boolean;
	};

	/**
	 * 默认显示哪个面板, 默认为 second， 如果隐藏了 second 需要自行设置
	 * The default is second. If second is hidden, you need to set it by yourself
	 */
	defaultTab: "second" | "minute" | "hour" | "day" | "month" | "week" | "year";
}

export type Cron = React.FC<CronProps>;
