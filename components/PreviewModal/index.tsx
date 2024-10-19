import { Group, Modal, ScrollArea } from "@mantine/core";
import type { Template } from "@/types/template";
import { AspectRatio } from "@mantine/core";
import { IconLayoutDashboard } from "@tabler/icons-react";

interface PreviewModalProps {
  isOpen: boolean;
  close: () => void;
  content: Template | null;
}
const PreviewModal = ({ isOpen, close, content }: PreviewModalProps) => (
  <Modal
    opened={isOpen}
    onClose={close}
    scrollAreaComponent={ScrollArea.Autosize}
    title={
      <Group gap="xs">
        <IconLayoutDashboard />
        {content?.subject}
      </Group>
    }
    size="xl"
  >
    <AspectRatio ratio={16 / 9}>
      <iframe
        srcDoc={content?.body}
        style={{
          border: "none",
        }}
      />
    </AspectRatio>
  </Modal>
);

export default PreviewModal;
