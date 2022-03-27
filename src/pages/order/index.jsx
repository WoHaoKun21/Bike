import { Button, Card, DatePicker, Form, message, Modal, Select, Table } from "antd";
import { forwardRef, useEffect, useRef, useState } from "react";
import Axios from "../../axios";
import Utils from "../../utils";

const FormItem = Form.Item;
const Option = Select.Option;
const params = { page: 1 };
const Order = () => {
    const form = useRef();
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState(false);
    const [flag, setFlag] = useState(false);
    const [rowKey, setRowKey] = useState([]);
    const [rowItem, SetRowItem] = useState({});
    useEffect(() => {
        Axios.ajax({
            url: "/order/list",
            data: { params }
        }).then(res => {
            res.result.item_list.map((item, index) => item.key = index);
            setDataSource(res.result.item_list);
            setPagination(Utils.pagination(res, (current) => {// 用来实现分页效果
                params.page = current;
                setFlag(!flag);
            }));
        })
    }, [flag]);
    // “查询”按钮的查询功能
    const onhandleSearch = () => {
        const formList = form.current.getFieldsValue();
        Axios.ajax({
            url: "/order/list",
            data: { params: formList }
        }).then((res) => {
            if (res.code === 0) {
                setFlag(!flag);
            }
        });
    };
    // 点击行事件
    const onhandleClick = (record, index) => {
        let key = [index];
        setRowKey(key);
        SetRowItem(record);
    };
    // “结束订单”按钮事件
    const onhandleFinish = () => {
        if (!rowItem.id) {
            Modal.info({
                title: "提示",
                content: "请选择一条订单"
            })
            return;
        }
        Axios.ajax({
            url: "/finish_order",
            data: { params: { itemId: rowItem.id } }
        }).then(res => {
            if (res.code === 0) {
                message.success("订单结束成功")
                setFlag(!flag);
            }
        })
    }
    const columns = [
        { title: "订单编号", dataIndex: "order_sn", align: "center" },
        { title: "车辆编号", dataIndex: "bike_sn", align: "center" },
        { title: "用户名", dataIndex: "user_name", align: "center" },
        { title: "手机号", dataIndex: "mobile", align: "center" },
        {
            title: "里程", dataIndex: "distance", align: "center",
            render(text) { return text / 1000 + "Km"; }
        },
        {
            title: "行驶时长", dataIndex: "total_time", align: "center",
            render(text) { return (text / 60 / 60).toFixed(2) + "/h" }
        },
        { title: "状态", dataIndex: "status", align: "center" },
        { title: "开始时间", dataIndex: "start_time", align: "center" },
        { title: "结束时间", dataIndex: "end_time", align: "center" },
        { title: "订单金额", dataIndex: "total_fee", align: "center" },
        { title: "实付金额", dataIndex: "user_pay", align: "center" },
    ]
    // 单选按钮配置
    const rowSelection = {
        type: "radio",
        selectedRowKeys: rowKey// 选中的key值
    }
    return (
        <div style={{ width: "100%" }}>
            <Card>
                <FormList ref={form} onhandleSearch={onhandleSearch} />
            </Card>
            <Card style={{ marginTop: 10 }}>
                <Button type="primary" style={{ marginRight: 10 }}>订单详情</Button>
                <Button type="primary" onClick={onhandleFinish}>结束订单</Button>
            </Card>
            <div className="content-wrap">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    onRow={(record, index) => ({
                        onClick(e) { onhandleClick(record, index) },
                    })}
                />
            </div>
        </div>
    );
}
export default Order;

const FormList = forwardRef((props, ref) => {
    const { onhandleSearch } = props;
    return (
        <Form layout="inline" ref={ref}>
            <FormItem label="城市" name="city">
                <Select style={{ width: 100 }} placeholder="全部">
                    <Option value="">全部</Option>
                    <Option value="1">北京</Option>
                    <Option value="2">天津</Option>
                    <Option value="3">深圳</Option>
                </Select>
            </FormItem>
            <FormItem label="订单时间" name="start_time" colon={false}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={"开始日期"} />
            </FormItem>
            <FormItem label="-" name="end_time" colon={false}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={"结束日期"} />
            </FormItem>
            <FormItem label="订单状态" name="order_status">
                <Select style={{ width: 100 }} placeholder="全部">
                    <Option value="">全部</Option>
                    <Option value="1">进行中</Option>
                    <Option value="2">行程结束</Option>
                </Select>
            </FormItem>

            <FormItem>
                <Button style={{ margin: "0 20px" }} type="primary" onClick={onhandleSearch}>查询</Button>
                <Button onClick={() => ref.current.resetFields()}>重置</Button>
            </FormItem>
        </Form>
    );
});