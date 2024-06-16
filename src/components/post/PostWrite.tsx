import { Button, Form, Input } from "antd";
import { PostWriteProps } from "../../types/components/post/PostWriteProps";
import { useEffect, useRef } from "react";
import { Editor } from '@toast-ui/react-editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import Prism from 'prismjs';
import styles from '../../styles/components/post/PostWrite.module.scss'

function PostWrite({ post, onSave }: PostWriteProps) {
    const editorRef = useRef<Editor>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        post && form.setFieldsValue(post);
    }, [post])

    const onFinish = (values: any) => {
        if (onSave) {
            const updatedPost =  { ...post, ...values, content: editorRef.current?.getInstance().getMarkdown() };
            onSave(updatedPost);
        }
    };

    useEffect(() => {
        if (editorRef.current) {
          // 기존 훅 제거
          editorRef.current.getInstance().removeHook('addImageBlobHook');
          // 새로운 훅 추가
          editorRef.current.getInstance().addHook('addImageBlobHook', (blob:any, callback: any) => {
            (async () => {
                console.log(blob)
                console.log(callback)
            })();
    
            return false;
          });
        }
    
        return () => {};
      }, [editorRef]);

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label='제목'
                    name='title'
                    rules={[
                        {
                            required: true,
                            message: '제목은 필수입력 항목입니다.'
                        }
                    ]}
                    validateTrigger={['onBlur']}
                >
                    <Input placeholder="제목을 입력해주세요." maxLength={100} />
                </Form.Item>
                <Form.Item
                    label='내용'
                    name='content'
                    rules={[
                        {
                            required: true,
                            message: '내용은 필수입력 항목입니다.'
                        }
                    ]}
                    validateTrigger={['onBlur']}
                >
                    <Editor
                        initialValue={post?.content}
                        placeholder="내용을 작성해주세요."
                        previewStyle="vertical"
                        height="500px"
                        initialEditType="markdown"
                        useCommandShortcut={true}
                        plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
                        ref={editorRef}
                    />
                </Form.Item>
                <Form.Item className={styles.buttons_container}>
                    <Button type="primary" htmlType="submit">저장</Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default PostWrite;