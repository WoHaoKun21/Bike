import { Button, Card, DatePicker, Form, Input, message, Modal, Radio, Select, Table } from "antd";
import { forwardRef, useEffect, useRef, useState } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from "moment";
import Axios from "../../axios";
import Utils from "../../utils";

const FormItem = Form.Item;
const Option = Select.Option;
const params = { page: 1 };
const User = () => {
    const form = useRef();
    const user = useRef();
    const [flag, setFlag] = useState(false);// 用来调用useEffect的
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState({});
    // 单选按钮变量
    const [rowKey, setRowKey] = useState([]);// 选中的key
    const [rowItem, setRowItem] = useState({});// 点击行存储的对象
    const [title, setTitle] = useState("");// 模态框标题
    const [types, setTypes] = useState("");// 模态框类型，在Form表单用来进行判断的
    const [isShow, setIsShow] = useState(false);// 是否显示模态框
    useEffect(() => {
        Axios.ajax({
            url: "/user/list1",
            data: { params }
        }).then(res => {
            if (res.code === 0) {
                res.result.item_list.map((item, index) => item.key = index)
                setDataSource(res.result.item_list);
                setPagination(Utils.pagination(res, (current) => {
                    params.page = current;
                    setFlag(!flag);
                }))
            }
        })
    }, [flag]);
    // “查询按钮”点击事件
    const onUserSearch = () => {
        const list = form.current.getFieldsValue();
        Axios.ajax({
            url: "/user/list1",
            data: { params: list }
        }).then(res => {
            setFlag(!flag);// 调用useEffect
        })
    };
    // 点击行Table列表行事件
    const onhandleClick = (record, index) => {
        let key = [index];
        setRowKey(key);
        setRowItem(record);
    }
    // 创建/编辑/详情/删除，按钮的通用事件
    const onhandleSubmit = (type) => {
        if (type !== "create") {
            if (!rowItem.id) {
                Modal.info({
                    title: "提示",
                    content: "请选择一条数据"
                });
                return;
            }
        }
        switch (type) {
            case "create":// 创建员工
                setIsShow(true);
                setTitle("创建员工");
                setTypes(type);
                break;
            case "edit":// 编辑员工员工
                setIsShow(true);
                setTitle("编辑员工");
                setTypes(type);
                break;
            case "detail":
                setIsShow(true);
                setTitle("员工详情");
                setTypes(type);
                break;
            case "delete":
                Modal.confirm({
                    title: "确认删除",
                    content: "是否删除当前员工",
                    onOk() {
                        Axios.ajax({
                            url: "/user/delete",
                            data: { params: { rowId: rowItem.id } }// Id是用户的id
                        }).then(res => {
                            if (res.code === 0) {
                                message.success("用户删除成功");
                                setRowItem({});
                                setRowKey([]);
                                setFlag(!flag);
                            }
                        })
                    }
                })
                break;
            default:
                return;
        }
    }
    // 模态框的OK事件
    const onSubmit = () => {
        const list = user.current.getFieldsValue();
        Axios.ajax({
            url: types === "create" ? "/user/add" : "/user/edit",
            data: { params: list }
        }).then(res => {
            if (res.code === 0) {
                message.success(`操作成功`);
                setIsShow(false);
                setFlag(!flag);
                setRowKey([]);// 清除选择按钮
                setRowItem({});// 清除选择后保存的对象
                user.current.resetFields();// 数据清除
            }
        })
    }
    // Table表格的标头
    const columns = [
        { title: "id", dataIndex: "id", align: "center" },
        { title: "用户名", dataIndex: "userName", align: "center" },
        {
            title: "性别", dataIndex: "sex", align: "center",
            render(text) {
                return text === 1 ? "男" : "女";
            }
        },
        { title: "状态", dataIndex: "state", align: "center" },
        { title: "爱好", dataIndex: "interest", align: "center" },
        {
            title: "婚姻状态", dataIndex: "isMarried", align: "center",
            render(text) {
                return text === 1 ? "已婚" : "未婚";
            }
        },
        { title: "生日", dataIndex: "birthday", align: "center" },
        { title: "地址", dataIndex: "address", align: "center" },
        { title: "早起时间", dataIndex: "time", align: "center" },
    ];
    const rowSelection = { type: "radio", selectedRowKeys: rowKey };
    let footer = {};
    if (types === "detail") {
        footer = { footer: null };
    }
    return (
        <div style={{ width: "100%" }}>
            <Card>
                <FormList ref={form} onUserSearch={onUserSearch} />
            </Card>
            <Card style={{ marginTop: 10 }} className="operate-wrap">
                <Button type="primary" onClick={() => onhandleSubmit("create")} icon={<PlusOutlined />}>创建员工</Button>
                <Button type="primary" onClick={() => onhandleSubmit("edit")} icon={<EditOutlined />}>编辑员工</Button>
                <Button type="primary" onClick={() => onhandleSubmit("detail")}>员工详情</Button>
                <Button type="primary" onClick={() => onhandleSubmit("delete")} icon={<DeleteOutlined />}>删除员工</Button>
            </Card>
            <div className="content-wrap">
                <Table
                    bordered
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    onRow={(record, index) => ({
                        onClick: () => { onhandleClick(record, index) }
                    })}
                />
            </div>
            <Modal
                title={title}
                visible={isShow}
                onCancel={() => setIsShow(false)}
                onOk={onSubmit}
                {...footer}
            >
                <UserForm ref={user} userInfo={rowItem} types={types} />
            </Modal>
        </div>
    );
}

export default User;

const FormList = forwardRef((props, ref) => {
    const { onUserSearch } = props;
    return (
        <Form layout="inline" ref={ref}>
            <FormItem label="用户" name="username">
                <Input placeholder="请输入用户名" />
            </FormItem>
            <FormItem label="密码" name="password">
                <Input.Password placeholder="请输入密码" />
            </FormItem>
            <FormItem label="入职日期" name="time">
                <DatePicker placeholder="选择时间" />
            </FormItem>
            <FormItem>
                <Button type="primary" onClick={onUserSearch}>查询</Button>
                <Button style={{ margin: "0 20px" }} onClick={() => ref.current.resetFields()}>重置</Button>
            </FormItem>
        </Form>
    );
});

const UserForm = forwardRef((props, ref) => {
    const { userInfo, types } = props;
    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 }
    }
    console.log("UserForm的类型：", types);
    return (
        <Form ref={ref}>
            <FormItem label="用户名" name="name" initialValue={userInfo.userName} {...formItemLayout}>
                {types === "detail" ? userInfo.userName : <Input placeholder="请输入用户名" />}
            </FormItem>
            <FormItem label="性别" name="sex" initialValue={userInfo.sex} {...formItemLayout}>
                {
                    types === "detail" ? userInfo.sex === 1 ? "男" : "女" :
                        <Radio.Group>
                            <Radio value={1}>男</Radio>
                            <Radio value={2}>女</Radio>
                        </Radio.Group>
                }
            </FormItem>
            <FormItem label="状态" name="status" initialValue={userInfo.state} {...formItemLayout}>
                {
                    types === "detail" ? userInfo.state :
                        <Select>
                            <Option value={1}>咸鱼一条</Option>
                            <Option value={2}>风华浪子</Option>
                            <Option value={3}>北大才子一枚</Option>
                            <Option value={4}>百度FE</Option>
                            <Option value={5}>创业者</Option>
                        </Select>
                }
            </FormItem>
            <FormItem label="生日" name="birthday" initialValue={moment(userInfo.birthday)} {...formItemLayout}>
                {types === "detail" ? userInfo.birthday : <DatePicker />}
            </FormItem>
            <FormItem label="联系地址" name="address" initialValue={userInfo.address} {...formItemLayout}>
                {types === "detail" ? userInfo.address : <Input.TextArea />}
            </FormItem>
        </Form>
    )
});