import { Button, Form, Input, message, Upload, UploadFile } from "antd";
import { PostWriteProps } from "../../types/components/post/PostWriteProps";
import { useEffect, useRef, useState } from "react";
import { Editor } from '@toast-ui/react-editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import Prism from 'prismjs';
import styles from '../../styles/components/post/PostWrite.module.scss'
import { fileApi } from "../../api/api";
import { UPLOAD_ALLOWED_EXTENSIONS } from "../../constants/common/DataConstants";
import { UploadOutlined } from "@ant-design/icons";
import { FileInterface } from "../../types/entity/file/FileInterface";

function PostWrite({ post, isUpdate, boardId, onSave }: PostWriteProps) {
    const editorRef = useRef<Editor>(null);
    const [form] = Form.useForm();
    const [thumbnailFileId, setThumbnailFileId] = useState<string>("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (post?.thumbnailFile) {
            setThumbnailFileId(post.thumbnailFile.id);
            setFiles(post.thumbnailFile)
        }
    }, [])

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
                        !thumbnailFileId && setThumbnailFileId(createdFile.id);
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
            const written = { ...post, ...values, content, thumbnailFileId };
            if (isUpdate) written.boardId = boardId;
            onSave(written);
        }
    };

    const handleUploadImage = async (options: any) => {
        const file = new FormData();
        file.append('file', options.file);

        const response = await fileApi.post('/files', file);

        if (response.data.isSuccess) {
            const createdFile = response.data.data.createdFile;
            setThumbnailFileId(createdFile.id);
            setFiles(createdFile);
        } else {
            setThumbnailFileId("");
            setFileList([]);
        }
    }

    const setFiles = (data: FileInterface) => {
        setFileList([{
            uid: data.id,
            status: 'done',
            name: `${data.originalName}.${data.extension}`,
            thumbUrl: `${import.meta.env.VITE_API_URL_DEV}/files/public/images/${data.id}`
        }]);
    }

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
                <Form.Item
                    label='썸네일'
                    name='thumbnail'
                >
                    <Upload
                        customRequest={handleUploadImage}
                        listType="picture"
                        maxCount={1}
                        fileList={fileList}
                        beforeUpload={(file) => {
                            const isImage = UPLOAD_ALLOWED_EXTENSIONS.includes(file.type);
                            !isImage && message.error(`PNG 파일 또는 JPG 파일만 허용됩니다.`);
                            return isImage || Upload.LIST_IGNORE;
                        }}
                        onRemove={() => {
                            setThumbnailFileId("");
                            setFileList([]);
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>
                <Form.Item className={styles.buttons_container}>
                    <Button type="primary" htmlType="submit">저장</Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default PostWrite;