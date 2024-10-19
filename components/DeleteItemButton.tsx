import { IconTrash } from "@tabler/icons-react";
import type { ActionIconVariant, MantineSize } from "@mantine/core";
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Modal,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CSSProperties } from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  itemName: string;
  confirm: () => void;
}
const ConfirmDeleteModal = ({
  open,
  onClose,
  itemName,
  confirm,
}: ConfirmDeleteModalProps) => {
  return (
    <Modal title="删除确认" opened={open} onClose={onClose} centered>
      <Text>您即将删除 :</Text>
      <Title order={3} my="md" c="red">
        {itemName}
      </Title>
      <Text>这是一个不可逆的操作，请再次确认。</Text>
      <Center mt="lg">
        <Group gap="sm">
          <Button variant="default" color="gray" onClick={onClose}>
            取消
          </Button>
          <Button color="red" onClick={confirm}>
            确认
          </Button>
        </Group>
      </Center>
    </Modal>
  );
};

interface AccordionDeleteItemButtonProps {
  itemName: string;
  title?: string;
  size?: number | MantineSize | string | undefined;
  variant?: string | ActionIconVariant | undefined;
  iconStyle?: CSSProperties;
  onClick: () => void;
}
const DeleteItemButton = ({
  itemName,
  title,
  size,
  variant,
  iconStyle,
  onClick,
}: AccordionDeleteItemButtonProps) => {
  const [
    isConfirmModalOpen,
    { open: openConfirmModal, close: closeConfirmModal },
  ] = useDisclosure(false);

  return (
    <>
      <ActionIcon
        title={title}
        size={size}
        variant={variant}
        color="red"
        onClick={openConfirmModal}
      >
        <IconTrash style={iconStyle} />
      </ActionIcon>

      <ConfirmDeleteModal
        open={isConfirmModalOpen}
        onClose={closeConfirmModal}
        itemName={itemName}
        confirm={() => {
          closeConfirmModal();
          onClick();
        }}
      />
    </>
  );
};

export default DeleteItemButton;
