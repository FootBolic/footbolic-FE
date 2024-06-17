import { Button, Card, Form, Modal, Pagination, Skeleton, Table, Typography } from "antd";
import { useState } from "react";
import { ManagementLayoutProps } from "../../types/components/layout/ManagementLayoutProps";
import Error from "../error/Error";
import styles from "../../styles/components/layout/ManagementLayout.module.scss";
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";
import { BOARD_PAGE_SIZE } from "../../constants/common/DataConstants";
import { addKey } from "../../util/DataUtil";
import { DataNode } from "antd/es/tree";
import Tree from "../tree/Tree";

const { Text } = Typography;

function ManagementLayout({ 
    isFetching,
    isError,
    searchBar,
    cardContentType,
    cardTableColumns,
    cardData,
    cardTablePage,
    cardTableSize,
    onCardPageChange,
    cardTreeDefaultExpandAll,
    cardTreeSelectedKeys,
    onTreeSelect,
    isDeletable,
    formInstance,
    formDisabled,
    formElements,
    formDeleteButtonDisabled,
    onSave,
    onDelete 
}: ManagementLayoutProps) {
    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    return (
        <>
            {
                isFetching ? <Skeleton active /> : <>
                    {
                        isError ? <Error /> : (
                            <>
                                {searchBar}
                                <div className={isMobile ? styles.mobile_container : styles.container}>
                                    <div className={styles.card_container}>
                                        <Card className={styles.card} bodyStyle={{ overflowY: 'auto', height: '100%' }}>
                                            {cardContentType === 'table' ? <>
                                                <div className={styles.board_container}>
                                                    <Table scroll={{ x: true }} className={styles.board} pagination={false} dataSource={addKey(cardData)}>
                                                        {cardTableColumns?.map((e) => {
                                                            return (
                                                                <Table.Column
                                                                    className={e.className}
                                                                    title={e.title}
                                                                    dataIndex={e.dataIndex}
                                                                    key={e.key}
                                                                    width={e.width}
                                                                    align={e.align}
                                                                    render={e.render}
                                                                />
                                                            )
                                                        })}
                                                    </Table>
                                                </div>
                                                <div className={styles.pagination_container}>
                                                    <Pagination 
                                                        showSizeChanger={false}
                                                        pageSize={BOARD_PAGE_SIZE}
                                                        size="small"
                                                        defaultCurrent={cardTablePage}
                                                        total={cardTableSize}
                                                        onChange={onCardPageChange}
                                                    />
                                                </div>
                                            </> : <>
                                                {cardContentType === 'tree' ? <>
                                                    <Tree 
                                                        showLine={true}
                                                        data={cardData as DataNode[]}
                                                        onSelect={onTreeSelect}
                                                        defaultExpandAll={cardTreeDefaultExpandAll}
                                                        selectedKeys={cardTreeSelectedKeys}
                                                    />
                                                </> : <></>}
                                            </>}
                                        </Card>
                                    </div>
                                    <div className={styles.form_container}>
                                        <Form 
                                            form={formInstance}
                                            disabled={formDisabled}
                                            layout="vertical"
                                            onFinish={() => setIsSaveModalOpen(true)}
                                            className={styles.form}
                                        >
                                            {formElements}
                                            <Form.Item className={styles.button_container}>
                                                <Button type='primary' onClick={() => formInstance.submit()}>
                                                    저장
                                                </Button>
                                                <Modal
                                                    title='저장'
                                                    open={isSaveModalOpen}
                                                    onOk={(values) => {
                                                        onSave(values);
                                                        setIsSaveModalOpen(false);
                                                    }}
                                                    onCancel={() => setIsSaveModalOpen(false)}
                                                    okText='확인'
                                                    cancelText='취소'
                                                >
                                                    <Text>저장하시겠습니까?</Text>
                                                </Modal>
                                                {isDeletable && <>
                                                    <Button danger disabled={formDeleteButtonDisabled} type='primary' onClick={() => setIsDeleteModalOpen(true)}>
                                                        삭제
                                                    </Button>
                                                    <Modal
                                                        title='삭제'
                                                        open={isDeleteModalOpen}
                                                        onOk={() => {
                                                            onDelete && onDelete();
                                                            setIsDeleteModalOpen(false);
                                                        }}
                                                        onCancel={() => setIsDeleteModalOpen(false)}
                                                        okText='삭제'
                                                        cancelText='취소'
                                                        okButtonProps={{ danger: true }}
                                                    >
                                                        <Text>삭제하시겠습니까?</Text>
                                                    </Modal>
                                                </>}
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </>
            }
        </>
    )
}

export default ManagementLayout;