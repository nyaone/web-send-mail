import { Button, Flex, Group, Modal, ScrollArea } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { useState } from "react";
import ServerEditModal from "@/components/ServerEditModal";
import {
  addServer,
  removeServerByIndex,
  saveServers,
  updateServerByIndex,
} from "@/slices/serversSlice";
import { Server } from "@/types/server";
import ServersList from "./list";
import { IconPlus, IconSettings } from "@tabler/icons-react";

interface ServersEditModalProps {
  isOpen: boolean;
  close: () => void;
}
const ServersEditModal = ({ isOpen, close }: ServersEditModalProps) => {
  const servers = useSelector((state: RootState) => state.servers);
  const dispatch = useDispatch<AppDispatch>();

  const [isServerEditModalOpen, setIsServerEditModalOpen] = useState(false);

  const [currentEditServerIndex, setCurrentEditServerIndex] =
    useState<number>(-1);

  const saveServer = (newState: Server) => {
    // Close modal
    setIsServerEditModalOpen(false);

    // Find conflicts
    let editingIndex = currentEditServerIndex; // Default value
    const hostMatch = servers.findIndex((s) => s.host === newState.host);
    if (hostMatch !== -1) {
      editingIndex = hostMatch; // Update matched rather than original selected
    }

    // Process submitted data
    if (editingIndex !== -1) {
      dispatch(
        updateServerByIndex({
          index: editingIndex,
          server: newState,
        }),
      );
    } else {
      dispatch(addServer(newState));
    }
    dispatch(saveServers());
  };

  const newServer = () => {
    setCurrentEditServerIndex(-1);
    setIsServerEditModalOpen(true);
  };

  const editServer = (serverIndex: number) => {
    setCurrentEditServerIndex(serverIndex);
    setIsServerEditModalOpen(true);
  };

  const delServer = (serverIndex: number) => {
    dispatch(removeServerByIndex(serverIndex));
    dispatch(saveServers());
  };

  return (
    <Modal
      opened={isOpen}
      onClose={close}
      scrollAreaComponent={ScrollArea.Autosize}
      title={
        <Group gap="xs">
          <IconSettings />
          {"服务器列表"}
        </Group>
      }
      size="lg"
    >
      <Flex direction="column" gap="md">
        {/*List*/}
        <ServersList servers={servers} edit={editServer} del={delServer} />

        {/*Add new*/}
        <Button leftSection={<IconPlus />} color="lime" onClick={newServer}>
          新增服务器
        </Button>
      </Flex>

      {/*Edit single server modal*/}
      <ServerEditModal
        isOpen={isServerEditModalOpen}
        close={() => {
          setIsServerEditModalOpen(false);
        }}
        initialServer={
          currentEditServerIndex === -1
            ? undefined
            : servers[currentEditServerIndex]
        }
        save={saveServer}
      />
    </Modal>
  );
};

export default ServersEditModal;
