import type { Server } from "@/types/server";
import { ActionIcon, Group, Table } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { actionIconStyle } from "@/styles/actionIconStyle";
import DeleteItemButton from "@/components/DeleteItemButton";

const ServersListHeader = () => (
  <Table.Tr>
    <Table.Th>主机名</Table.Th>
    <Table.Th>操作</Table.Th>
  </Table.Tr>
);

interface ServersListRowProps {
  server: Server;
  edit: () => void;
  del: () => void;
}
const ServersListRow = ({ server, edit, del }: ServersListRowProps) => (
  <Table.Tr key={server.host}>
    <Table.Td>{server.host}</Table.Td>
    <Table.Td>
      <Group gap="xs">
        <ActionIcon color="indigo" title="编辑" onClick={edit}>
          <IconEdit style={actionIconStyle} />
        </ActionIcon>
        <DeleteItemButton
          itemName={server.host}
          title="删除"
          iconStyle={actionIconStyle}
          onClick={del}
        />
      </Group>
    </Table.Td>
  </Table.Tr>
);

interface ServersListProps {
  servers: Server[];
  edit: (index: number) => void;
  del: (index: number) => void;
}
const ServersList = ({ servers, edit, del }: ServersListProps) => (
  <Table highlightOnHover>
    <Table.Caption>共有 {servers.length} 个服务器</Table.Caption>
    <Table.Thead>
      <ServersListHeader />
    </Table.Thead>
    <Table.Tbody>
      {servers.map((s, index) => (
        <ServersListRow
          key={s.host}
          server={s}
          edit={() => edit(index)}
          del={() => del(index)}
        />
      ))}
    </Table.Tbody>
  </Table>
);

export default ServersList;
