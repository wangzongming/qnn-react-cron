import React,{ useState,useEffect } from 'react';
import { Tabs,Button } from 'antd';
import styles from './index.less';
import SecondPane from './SecondPane';
import MinutePane from './MinutePane';
import HourPane from './HourPane';
import DayPane from './DayPane';
import MonthPane from './MonthPane';
import WeekPane from './WeekPane';
import YearPane from './YearPanel';
import { secondRegex,minuteRegex,hourRegex,dayRegex,monthRegex,weekRegex,yearRegex } from './cron-regex';

const { TabPane } = Tabs;

function Cron(props) {
    const { style,value,onOk,footer,getCronFns } = props;
    const [currentTab,setCurrentTab] = useState('1');
    const [second,setSecond] = useState('*');
    const [minute,setMinute] = useState('*');
    const [hour,setHour] = useState('*');
    const [day,setDay] = useState('*');
    const [month,setMonth] = useState('*');
    const [week,setWeek] = useState('?');
    const [year,setYear] = useState('*'); 

    const onParse = () => {
        return new Promise((resolve) => {
            if (value) {
                try {
                    let [secondVal,minuteValue,hourVal,dayVal,monthVal,weekVal,yearVal] = value.split(' ');
                    secondVal = secondRegex.test(secondVal) ? secondVal : '*';
                    minuteValue = minuteRegex.test(minuteValue) ? minuteValue : '*';
                    hourVal = hourRegex.test(hourVal) ? hourVal : '*';
                    dayVal = dayRegex.test(dayVal) ? dayVal : '*';
                    monthVal = monthRegex.test(monthVal) ? monthVal : '*';
                    weekVal = weekRegex.test(weekVal) ? weekVal : '?';
                    weekVal = dayVal !== '?' ? '?' : weekVal;
                    yearVal = yearRegex.test(yearVal) ? yearVal : '*';
                    setSecond(secondVal);
                    setMinute(minuteValue);
                    setHour(hourVal);
                    setDay(dayVal);
                    setMonth(monthVal);
                    setWeek(weekVal);
                    setYear(yearVal);
                    resolve({
                        value,
                        secondVal,minuteValue,hourVal,dayVal,monthVal,weekVal,yearVal
                    });
                } catch (error) {
                    setSecond('*');
                    setMinute('*');
                    setHour('*');
                    setDay('*');
                    setMonth('*');
                    setWeek('?');
                    setYear('*');
                    resolve({})
                }
            } else {
                setSecond('*');
                setMinute('*');
                setHour('*');
                setDay('*');
                setMonth('*');
                setWeek('?');
                setYear('*');
                resolve({})
            }
        })
    };

    const onGenerate = () => {
        if (onOk) {
            onOk([second,minute,hour,day,month,week,year].join(' '));
        }
    };

    const onChangeDay = (v) => {
        setDay(v);
        if (v !== '?') {
            setWeek('?');
        }
    };

    const onChangeWeek = (v) => {
        setWeek(v);
        if (v !== '?') {
            setDay('?');
        }
    };

    useEffect(() => {
        getCronFns && getCronFns({
            //设置值
            onParse,
            getValue: () => [second,minute,hour,day,month,week,year].join(' ')
        })
    });

    useEffect(() => { 
        onParse();
    },[value]);

    return (
        <div className={styles.cron} style={style}>
            <Tabs activeKey={currentTab} onChange={setCurrentTab} className={styles.Tabs}>
                <TabPane tab="秒" key="1">
                    <SecondPane value={second} onChange={setSecond} />
                </TabPane>
                <TabPane tab="分" key="2">
                    <MinutePane value={minute} onChange={setMinute} />
                </TabPane>
                <TabPane tab="时" key="3">
                    <HourPane value={hour} onChange={setHour} />
                </TabPane>
                <TabPane tab="日" key="4">
                    <DayPane value={day} onChange={onChangeDay} />
                </TabPane>
                <TabPane tab="月" key="5">
                    <MonthPane value={month} onChange={setMonth} />
                </TabPane>
                <TabPane tab="周" key="6">
                    <WeekPane value={week} onChange={onChangeWeek} />
                </TabPane>
                <TabPane tab="年" key="7">
                    <YearPane value={year} onChange={setYear} />
                </TabPane>
            </Tabs>
            <div className={styles.footer}>
                {
                    (footer === false || footer === null || footer) ? footer : <>
                        <Button style={{ marginRight: 10 }} onClick={onParse}>
                            解析到UI
                         </Button>
                        <Button type="primary" onClick={onGenerate}>
                            生成
                        </Button>
                    </>
                }
            </div>
        </div>
    );
}

export default Cron;
