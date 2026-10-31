import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.js';
import { Message } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';
import { Modal } from '../components/ui/Modal.js';
import {
  Mail,
  MailOpen,
  Trash2,
  Clock,
  User,
  Reply,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['messages', unreadOnly],
    queryFn: () => api.getMessages(1, 50, unreadOnly),
  });

  const markReadMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      api.markMessageRead(id, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Message status updated');
    },
    onError: (err: any) => error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      success('Message deleted!');
      setSelectedMessage(null);
    },
    onError: (err: any) => error(err.message),
  });

  const handleOpenMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      markReadMutation.mutate({ id: msg.id, isRead: true });
    }
  };

  const messages = data?.items || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Contact Messages Inbox</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            Inquiries received from the public visitor contact form.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] p-1 rounded-lg">
          <button
            onClick={() => setUnreadOnly(false)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              !unreadOnly ? 'bg-[#e91010] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => setUnreadOnly(true)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              unreadOnly ? 'bg-[#e91010] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Unread Only
          </button>
        </div>
      </div>

      <div className="bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#e91010]" />
            <span className="text-xs">Loading inbox...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            {unreadOnly ? 'No unread messages.' : 'Inbox is empty.'}
          </div>
        ) : (
          <div className="divide-y divide-[#262626] light:divide-[#C6B7A0]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                  !msg.isRead
                    ? 'bg-[#1a1414] hover:bg-[#221818] border-l-2 border-l-[#e91010]'
                    : 'hover:bg-[#161616]'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`p-2 rounded-lg ${
                      !msg.isRead ? 'bg-[#e91010]/20 text-[#e91010]' : 'bg-[#181818] text-neutral-500'
                    }`}
                  >
                    {!msg.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white light:text-black">
                        {msg.senderName}
                      </span>
                      <span className="text-[11px] text-neutral-400 truncate">
                        &lt;{msg.senderEmail}&gt;
                      </span>
                    </div>
                    <p className="text-xs font-medium text-neutral-300 light:text-neutral-800 truncate max-w-xl">
                      {msg.subject}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate max-w-xl">{msg.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markReadMutation.mutate({ id: msg.id, isRead: !msg.isRead });
                    }}
                    title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <CheckCircle className={`w-4 h-4 ${msg.isRead ? 'text-neutral-600' : 'text-[#e91010]'}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete message from ${msg.senderName}?`)) {
                        deleteMutation.mutate(msg.id);
                      }
                    }}
                    title="Delete message"
                    className="p-1 text-neutral-400 hover:text-[#e91010]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Reader Modal */}
      <Modal
        isOpen={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || 'Message Details'}
        maxWidth="lg"
      >
        {selectedMessage && (
          <div className="space-y-5">
            <div className="bg-[#181818] p-4 rounded-lg border border-[#262626] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#e91010]" />
                  <span className="font-bold text-xs text-white">{selectedMessage.senderName}</span>
                </div>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                Email:{' '}
                <a
                  href={`mailto:${selectedMessage.senderEmail}`}
                  className="text-[#e91010] hover:underline"
                >
                  {selectedMessage.senderEmail}
                </a>
              </p>
              {selectedMessage.ipAddress && (
                <p className="text-[10px] text-neutral-500 font-mono">
                  IP: {selectedMessage.ipAddress}
                </p>
              )}
            </div>

            <div className="p-4 bg-[#141414] border border-[#262626] rounded-lg">
              <p className="text-xs text-neutral-200 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  if (confirm('Delete this message?')) {
                    deleteMutation.mutate(selectedMessage.id);
                  }
                }}
                className="px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <a
                href={`mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(
                  selectedMessage.subject
                )}`}
                className="px-4 py-2 bg-[#e91010] hover:bg-[#c80c0c] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-[#e91010]/20"
              >
                <Reply className="w-4 h-4" />
                <span>Reply via Email</span>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
