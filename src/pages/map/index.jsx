/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, DatePicker, Form, message, Select } from "antd";
import { forwardRef, useEffect, useRef, useState } from "react";
import Axios from "../../axios";
const FormItem = Form.Item;
const Option = Select.Option;
const params = {}
let map;
const Map = () => {
    const form = useRef();
    const [count, setCount] = useState(0);// 自行车数目
    useEffect(() => {
        Axios.ajax({
            url: "/map/bike_list",
            data: { params }
        }).then(res => {
            if (res.code === 0) {
                setCount(res.result.total_count);
                renderMap(res.result)
            }
        })
    }, []);
    // 查询事件
    const onSubmit = () => {
        let list = form.current.getFieldsValue();
        Axios.ajax({
            url: "/user/list1",
            data: { params: list }
        }).then(res => {
            if (res.code === 0) {
                message.success("成功")
            }
        })
    }
    // 地图渲染
    const renderMap = (res) => {
        let list = res.route_list;
        map = new window.BMapGL.Map("container");
        let gps1 = list[0].split(",");
        let startPoint = new window.BMapGL.Point(gps1[0], gps1[1]);
        let gps2 = list[list.length - 1].split(",");
        let endPoint = new window.BMapGL.Point(gps2[0], gps2[1]);
        map.centerAndZoom(endPoint, 11);
        // 创建起点图标
        let startIcon = new window.BMapGL.Icon("./assets/start_point.png", new window.BMapGL.Size(36, 42), {// 调用的时候可以传三个参数：1、指定图片；2、存放图片盒子的大小；3、图片的大小
            imageSize: new window.BMapGL.Size(36, 42),
            anchor: new window.BMapGL.Size(18, 42)
        });
        // 创建终点图标
        let endIcon = new window.BMapGL.Icon("./assets/end_point.png", new window.BMapGL.Size(36, 42), {// 调用的时候可以传三个参数：1、指定图片；2、存放图片盒子的大小；3、图片的大小
            imageSize: new window.BMapGL.Size(36, 42),
            anchor: new window.BMapGL.Size(18, 42)
        });
        // 创建icon图标
        let startMarker = new window.BMapGL.Marker(startPoint, { icon: startIcon });
        let endMarker = new window.BMapGL.Marker(endPoint, { icon: endIcon });
        map.addOverlay(startMarker);
        map.addOverlay(endMarker);
        addMapControl();// 添加控价
        drawBikeRoute(list);// 绘制用户路线图
        drawPolygn(res.service_list);// 绘制服务区
        bikePoint(res.bike_list);// 绘制自行车坐标点
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
    // 创建用户路线图
    const drawBikeRoute = (positionList) => {
        let pointArr = [];
        positionList.map(item => {
            let p = item.split(",");
            return pointArr.push(new window.BMapGL.Point(p[0], p[1]));
        });
        let polyline = new window.BMapGL.Polyline(pointArr, {
            strokeColor: '#ef4136',
            strokeWeight: 3,
            strokeOpacity: 0.8
        });
        map.addOverlay(polyline);
    }
    // 绘制骑行服务区
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
    // 创建多个地点自行车图标
    const bikePoint = (positionList) => {
        // 创建自行车图标："/assets/bike.jpg";
        let bikeIcon = new window.BMapGL.Icon("./assets/bike.jpg", new window.BMapGL.Size(36, 42), {// 调用的时候可以传三个参数：1、指定图片；2、存放图片盒子的大小；3、图片的大小
            imageSize: new window.BMapGL.Size(36, 42),
            anchor: new window.BMapGL.Size(18, 42)
        });
        positionList.map(item => {
            let p = item.split(",");
            let point = new window.BMapGL.Point(p[0], p[1]);
            let bikeMarker = new window.BMapGL.Marker(point, { icon: bikeIcon });
            return map.addOverlay(bikeMarker);
        })
    }
    return (
        <div style={{ width: "100%" }}>
            <Card>
                <FormList ref={form} onSubmit={onSubmit} />
            </Card>
            <Card>
                <div>共{count}辆车</div>
                <div id="container" style={{ height: 500 }}></div>
            </Card>
        </div>
    );
}

export default Map;



const FormList = forwardRef((props, ref) => {
    const { onSubmit } = props;
    return (
        <Form layout="inline" ref={ref}>
            <FormItem label="城市" name="city" initialValue={""}>
                <Select style={{ width: 100 }}>
                    <Option value="">全部</Option>
                    <Option value="1">北京</Option>
                    <Option value="2">天津</Option>
                    <Option value="3">深圳</Option>
                    <Option value="4">上海</Option>
                </Select>
            </FormItem>
            <FormItem label="订单时间" name="start_time">
                <DatePicker />
            </FormItem>
            <FormItem label="-" colon={false} name="end_time">
                <DatePicker />
            </FormItem>
            <FormItem label="订单状态" name="order_state" initialValue={""}>
                <Select style={{ width: 100 }}>
                    <Option value="">全部</Option>
                    <Option value="1">进行中</Option>
                    <Option value="2">进行中(临时停车)</Option>
                    <Option value="3">行程结束</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" onClick={onSubmit} style={{ margin: "0 15px" }}>查询</Button>
                <Button onClick={() => ref.current.resetFields()}>重置</Button>
            </FormItem>
        </Form>
    )
})