import { Select } from "antd";

const Utils = {
    formateDate(time) {
        if (!time) return "";
        let date = new Date(time);
        let years = date.getFullYear() < 10 ? "0" + date.getFullYear() : date.getFullYear();
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth();
        let data = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return `${years}-${month}-${data} ${hours}:${minutes}:${seconds}`;
    },
    pagination(data, callback) {
        return {
            onChange: (current) => {// 这里的current是获得到的页数
                callback(current);
            },
            current: data.result.page,// 当前页码
            pageSize: data.result.page_size,// 当前页码的条数
            total: data.result.total_count,// 显示总页数
            showTotal: () => `共${data.result.total_count}条数据`,
            showQuickJumper: true,// 是否可以快速跳转到某页
        };
    },
    getOptionList(data) {
        // console.log("Utils里面获得到的数据：", data);
        if (!data) {
            return [];
        }
        let option = [];// 创建一个空数组
        data.map((item, index) => {
            return option.push(<Select.Option value={item.id} key={index}>{item.name}</Select.Option>)
        });
        return option;
    },
    updateSelectedItm(selectedItem, selectedRowKeys, type, flag) {
        const { setRowKeys, setRowItem, setCheckId } = type;// 用来更新数据
        if (flag) {// 复选按钮执行的数据
            setRowKeys(selectedRowKeys);
            setCheckId(selectedItem);
        } else {
            setRowKeys(selectedRowKeys);
            setRowItem(selectedItem);
        }
    }
}
export default Utils;