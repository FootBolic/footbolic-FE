import { Drawer } from "antd";
import { ChatroomDrawerProps } from "../../types/components/chat/ChatroomDrawerProps";
import Chatroom from "./Chatroom";

function ChatroomDrawer({ isOpen, setIsOpen }: ChatroomDrawerProps) {
    return (
        <Drawer
            placement="right"
            size="large"
            title="실시간 채팅"
            open={isOpen}
            onClose={() => setIsOpen && setIsOpen(false)}
        >
            <Chatroom />
        </Drawer>
    )
}

export default ChatroomDrawer;