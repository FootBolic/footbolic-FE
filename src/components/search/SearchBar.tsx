import { SearchBarProps } from "../../types/components/search/SearchBarProps";
import styles from '../../styles/components/search/SearchBar.module.scss';
import { Button, Card, DatePicker, Form, Input, TreeSelect } from "antd";
import { SEARCH_TYPES } from "../../constants/components/SearchBarConstants";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";
import { DATE_FORMAT } from "../../constants/common/DataConstants";
import dayjs from "dayjs";

function SearchBar({ defaultValues, elements, onSearch, onReset} : SearchBarProps) {
    const [form] = Form.useForm();
    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);

    useEffect(() => {
        if (defaultValues) {
            let values = { ...defaultValues };

            for (let e of elements) {
                if (e.type === SEARCH_TYPES.DATE && values[e.name]) {
                    values[e.name] = dayjs(values[e.name]);
                }
            }

            form.setFieldsValue(values);
        } else {
            form.resetFields()
        }
    }, [defaultValues])

    const handleSearch = () => {
        let values = form.getFieldsValue();

        for (let e of elements) {
            if (e.type === SEARCH_TYPES.DATE && form.getFieldValue(e.name)) {
                values[e.name] = form.getFieldValue(e.name).format(DATE_FORMAT)
            }
        }

        onSearch(values)
    }

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
                                            (e.type === SEARCH_TYPES.SELECT ? 
                                                <TreeSelect
                                                    placeholder={e.placeholder}
                                                    treeDefaultExpandAll
                                                    treeData={e.options}
                                                    allowClear
                                                /> : 
                                            (e.type === SEARCH_TYPES.DATE &&
                                                <DatePicker
                                                    className={styles.date_picker}
                                                    placeholder={e.placeholder}
                                                    allowClear
                                                />
                                            ))
                                        }
                                    </Form.Item>
                                )
                            })
                        }
                    </Form>
                </div>
                <div className={styles.button_container}>
                    <Button onClick={() => defaultValues ? onReset() : form.resetFields()}>초기화</Button>
                    <Button type="primary" onClick={handleSearch}>검색</Button>
                </div>
            </div>
        </Card>
    )
}

export default SearchBar;