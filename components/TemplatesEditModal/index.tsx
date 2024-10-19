import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { removeTemplateByIndex, saveTemplates } from "@/slices/templatesSlice";
import { Button, Flex, Group, Modal, ScrollArea } from "@mantine/core";
import { IconDeviceFloppy, IconTemplate } from "@tabler/icons-react";
import TemplatesList from "@/components/TemplatesEditModal/list";

interface TemplatesEditModalProps {
  isOpen: boolean;
  close: () => void;
  applyTemplate: (index: number) => void;
  saveCurrentAsTemplate: () => void;
}
const TemplatesEditModal = ({
  isOpen,
  close,
  applyTemplate,
  saveCurrentAsTemplate,
}: TemplatesEditModalProps) => {
  const templates = useSelector((state: RootState) => state.templates);
  const dispatch = useDispatch<AppDispatch>();

  const delTemplate = (templateIndex: number) => {
    dispatch(removeTemplateByIndex(templateIndex));
    dispatch(saveTemplates());
  };

  return (
    <Modal
      opened={isOpen}
      onClose={close}
      scrollAreaComponent={ScrollArea.Autosize}
      title={
        <Group gap="xs">
          <IconTemplate />
          {"模板列表"}
        </Group>
      }
      size="lg"
    >
      <Flex direction="column" gap="md">
        {/*List*/}
        <TemplatesList
          templates={templates}
          apply={applyTemplate}
          del={delTemplate}
        />

        {/*Add new*/}
        <Button
          leftSection={<IconDeviceFloppy />}
          color="lime"
          onClick={saveCurrentAsTemplate}
        >
          保存当前编辑内容为模板
        </Button>
      </Flex>
    </Modal>
  );
};

export default TemplatesEditModal;
