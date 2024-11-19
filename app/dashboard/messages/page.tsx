import { MessageList } from "@/components/messages/message-list"
import { MessagePanel } from "@/components/messages/message-panel"

export default function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      <MessageList />
      <MessagePanel />
    </div>
  )
}