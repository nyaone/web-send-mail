import { ActionIcon, Group, Table } from "@mantine/core";
import type { Template } from "@/types/template";
import { actionIconStyle } from "@/styles/actionIconStyle";
import DeleteItemButton from "@/components/DeleteItemButton";
import { IconPencilBolt } from "@tabler/icons-react";

const TemplatesListHeader = () => (
  <Table.Tr>
    <Table.Th>主题</Table.Th>
    <Table.Th>操作</Table.Th>
  </Table.Tr>
);

interface TemplatesListRowProps {
  template: Template;
  apply: () => void;
  del: () => void;
}
const TemplatesListRow = ({ template, apply, del }: TemplatesListRowProps) => (
  <Table.Tr>
    <Table.Td>{template.subject}</Table.Td>
    <Table.Td>
      <Group gap="xs">
        <ActionIcon color="yellow" title="应用" onClick={apply}>
          <IconPencilBolt style={actionIconStyle} />
        </ActionIcon>
        <DeleteItemButton
          itemName={template.subject}
          title="删除"
          iconStyle={actionIconStyle}
          onClick={del}
        />
      </Group>
    </Table.Td>
  </Table.Tr>
);

interface TemplatesListProps {
  templates: Template[];
  apply: (index: number) => void;
  del: (index: number) => void;
}
const TemplatesList = ({ templates, apply, del }: TemplatesListProps) => (
  <Table highlightOnHover>
    <Table.Caption>共有 {templates.length} 个模板</Table.Caption>
    <Table.Thead>
      <TemplatesListHeader />
    </Table.Thead>
    <Table.Tbody>
      {templates.map((t, index) => (
        <TemplatesListRow
          key={t.subject}
          template={t}
          apply={() => apply(index)}
          del={() => del(index)}
        />
      ))}
    </Table.Tbody>
  </Table>
);

export default TemplatesList;
