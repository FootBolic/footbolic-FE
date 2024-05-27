import { SearchBarProps } from "../../types/components/search/SearchBarProps";
import styles from '../../styles/components/search/SearchBar.module.scss';
import { Button, Card, Form, Input, TreeSelect } from "antd";
import { SEARCH_TYPES } from "../../constants/components/SearchBarConstants";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";

function SearchBar({ defaultValues, elements, onSearch, onReset} : SearchBarProps) {
    const [form] = Form.useForm();
    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);

    useEffect(() => {
        defaultValues ? form.setFieldsValue(defaultValues) : form.resetFields();
    }, [defaultValues])

    return (
        <Card className={isMobile ? styles.mobile_container : styles.container} >
            <div className={styles.flex}>
                <div className={styles.form_container}>
                    <Form form={form} layout="inline">
                        {
                            elements.map((e, i) => {
                                return (
                                    <Form.Item className={styles.form_item} label={e.label} name={e.name} key={i}>
                                        {
                                            e.type === SEARCH_TYPES.INPUT ?
                                                <Input maxLength={e.maxLength} placeholder={e.placeholder} /> :
                                            (e.type === SEARCH_TYPES.SELECT && <>
                                                <TreeSelect
                                                    placeholder={e.placeholder} treeDefaultExpandAll treeData={e.options} style={{ overflowX: 'scroll' }}
                                                />
                                            </>)
                                        }
                                    </Form.Item>
                                )
                            })
                        }
                    </Form>
                </div>
                <div className={styles.button_container}>
                    <Button onClick={() => defaultValues ? onReset() : form.resetFields()}>초기화</Button>
                    <Button type="primary" onClick={() => onSearch(form.getFieldsValue())}>검색</Button>
                </div>
            </div>
        </Card>
    )
}

export default SearchBar;