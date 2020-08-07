import React from 'react';
import * as React from 'react';
export interface CronFns {
    // 解析Cron表达式到UI
    onParse: () => Promise<any>,
    getValue: () => string
}
interface IProps {
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
    getCronFns?: () => CronFns;
}

export default function Cron(props: IProps): React.ReactNode;
