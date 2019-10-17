import { Modal } from 'antd';

const { confirm } = Modal;

const ModalDelete = (content, okFn) => (
    confirm({
      title: '请确认是否要删除',
      content,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        okFn();
      },
      onCancel() {},
    })
  )

export default ModalDelete;
