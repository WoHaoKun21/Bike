/* eslint-disable react-hooks/exhaustive-deps */
import { Card } from "antd";
import { useState, useEffect } from "react";
import Axios from "../../axios";
import "./detail.less"
let map;
const OrderDetail = (props) => {
    const [info, setInfo] = useState({})
    useEffect(() => {
        let orderId = props.match.params.orderId;
        console.log(orderId)
        Axios.ajax({
            url: "/order/detail",
            data: { params: { orderId } }
        }).then(res => {
            if (res.code === 0) {
                setInfo(res.result);
                renderMap(res.result)
            }
        })
    }, []);
    // 初始化地图
    const renderMap = (list) => {
        map = new window.BMapGL.Map("orderDetailMap");
        let point = new window.BMapGL.Point(116.404, 39.915);// 创建一个坐标点
        map.centerAndZoom(point, 11);// 地图中心坐标点
        map.enableScrollWheelZoom(true);
        addMapControl();// 添加地图控件的方法
        drawBikeRoute(list.position_list);// 绘制用户路线图/骑车范围的方法，将获得到的数据传递下去
        drawPolygn(list.area);// 调用函数用来创建覆盖范围
    }
    // 添加地图控件
    const addMapControl = () => {
        let scaleCtrl = new window.BMapGL.ScaleControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT });  // 添加比例尺控件，并放在右上角
        let zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
        let cityCtrl = new window.BMapGL.CityListControl();  // 添加城市列表控件
        map.addControl(scaleCtrl);
        map.addControl(zoomCtrl);
        map.addControl(cityCtrl);
    }
    // 绘制用户路线图
    const drawBikeRoute = (positionList) => {
        // 绘制起点和终点的图标————————————————开始
        let startPoint;
        let endPoint;
        if (positionList.length > 0) {
            let arr = positionList[0];
            let arr2 = positionList[positionList.length - 1];
            startPoint = new window.BMapGL.Point(arr.lon, arr.lat);// 生成起始点的坐标
            endPoint = new window.BMapGL.Point(arr2.lon, arr2.lat);// 生成终点的坐标
            // 起点图标
            let startIcon = new window.BMapGL.Icon("./assets/start_point.png", new window.BMapGL.Size(36, 42), {// 调用的时候可以传三个参数：1、指定图片；2、存放图片盒子的大小；3、图片的大小
                imageSize: new window.BMapGL.Size(36, 42),
                anchor: new window.BMapGL.Size(18, 42)
            });
            // 终点图标
            let endIcon = new window.BMapGL.Icon("./assets/end_point.png", new window.BMapGL.Size(36, 42), {// 调用的时候可以传三个参数：1、指定图片；2、存放图片盒子的大小；3、图片的大小
                imageSize: new window.BMapGL.Size(36, 42),
                anchor: new window.BMapGL.Size(18, 42)
            });
            let startMarker = new window.BMapGL.Marker(startPoint, { icon: startIcon });// 通过Marker来在指定位置生成图标
            let endMarker = new window.BMapGL.Marker(endPoint, { icon: endIcon });
            map.addOverlay(startMarker);
            map.addOverlay(endMarker);
            // 绘制起点和终点的图标————————————————结束
            // 绘制路线图————————————————————开始
            let pointArr = [];
            positionList.map(item => {
                let p = new window.BMapGL.Point(item.lon, item.lat);
                return pointArr.push(p);
            });
            let polyline = new window.BMapGL.Polyline(pointArr, {
                strokeColor: '#f00',
                strokeWeight: 3,
                strokeOpacity: 0.8
            });
            map.addOverlay(polyline);
            // 绘制路线图————————————————————结束
        }
    }
    // 绘制范围图
    const drawPolygn = (positionList) => {
        let listArr = [];
        positionList.map(item => {
            let p = new window.BMapGL.Point(item.lon, item.lat);
            return listArr.push(p);
        });
        let polygon = new window.BMapGL.Polygon(listArr, {
            strokeColor: '#f00',
            strokeWeight: 3,
            strokeOpacity: 0.7,
            fillColor: "#ff8605",
            fillOpacity: 0.4
        });
        map.addOverlay(polygon);
    }
    return (
        <div style={{ width: "100%" }}>
            <Card>
                <div id="orderDetailMap" className="order-map"></div>
                <div className="detail-items">
                    <div className="item-title">基础信息</div>
                    <ul className="detail-form">
                        <li>
                            <div className="detail-form-left">用车模式</div>
                            <div className="detail-form-content">{info.mode === 1 ? "服务区模式" : "停车点"}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">订单编号</div>
                            <div className="detail-form-content">{info.order_sn}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">车辆编号</div>
                            <div className="detail-form-content">{info.bike_sn}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">用户姓名</div>
                            <div className="detail-form-content">{info.user_name}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">手机号码</div>
                            <div className="detail-form-content">{info.mobile}</div>
                        </li>
                    </ul>
                </div>
                <div className="detail-items">
                    <div className="item-title">行驶轨迹</div>
                    <ul className="detail-form">
                        <li>
                            <div className="detail-form-left">行程起点</div>
                            <div className="detail-form-content">{info.start_location}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">行程终点</div>
                            <div className="detail-form-content">{info.end_location}</div>
                        </li>
                        <li>
                            <div className="detail-form-left">行驶里程</div>
                            <div className="detail-form-content">{info.distance / 1000}公里</div>
                        </li>
                    </ul>
                </div>
            </Card>
        </div>
    );
}

export default OrderDetail;