import { Button, Form, Input, message } from "antd";
import { PostWriteProps } from "../../types/components/post/PostWriteProps";
import { useEffect, useRef } from "react";
import { Editor } from '@toast-ui/react-editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import Prism from 'prismjs';
import styles from '../../styles/components/post/PostWrite.module.scss'
import { fileApi } from "../../api/api";

function PostWrite({ post, isUpdate, boardId, onSave }: PostWriteProps) {
    const editorRef = useRef<Editor>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        post && form.setFieldsValue(post);
    }, [post])

    useEffect(() => {
        if (editorRef.current) {
          editorRef.current.getInstance().removeHook('addImageBlobHook');
          editorRef.current.getInstance().addHook('addImageBlobHook', (blob:any, callback: any) => {
            (async () => {
                const file = new FormData();
                file.append('file', blob);

                const response = await fileApi.post('/files', file);

                if (response.data.isSuccess) {
                    const createdFile = response.data.data.createdFile;
                    const fileUrl = `${import.meta.env.VITE_API_URL_DEV}/files/public/images/${createdFile.id}`;
                    callback(fileUrl, `${createdFile.originalName}.${createdFile.extension}`);
                }
            })();
            return false;
          });
        }
    
        return () => {};
      }, [editorRef]);

      const onFinish = (values: any) => {
        const content = editorRef.current?.getInstance().getMarkdown();

        if (!content) {
            message.error('내용을 입력해주세요.');
            return;
        }

        if (onSave) {
            const written = { ...post, ...values, content };
            if (isUpdate) written.boardId = boardId
            onSave(written);
        }
      };

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