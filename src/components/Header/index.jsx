/* eslint-disable jsx-a11y/anchor-is-valid */
import { Col, Row } from "antd";
// import axios from "axios";
import { useEffect, useState } from "react";
import Utils from "../../utils";
import "./index.less";

const Header = (props) => {
    // const [weater, setWeather] = useState({});
    const [time, setTime] = useState("");
    useEffect(() => {
        setInterval(() => {
            let data = new Date().getTime()
            setTime(Utils.formateDate(data));
        }, 1000);
    }, [time]);
    return (
        <div className='header'>
            <Row className="header-top">
                <Col span={24}>
                    <span>欢迎，秦皇岛 海港区</span>
                    <a href="#">退出</a>
                </Col>
            </Row>
            <Row className="breadcrumb">
                <Col span={4} className="bread-title">首页</Col>
                <Col span={20} className="weather">
                    <span className="data">{time}</span>
                    <span className="weather-detail">
                        <i className={`qi-101`}></i>多云
                    </span>
                </Col>
            </Row>
        </div>
    );
};

export default Header;
