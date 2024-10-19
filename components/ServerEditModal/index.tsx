import { Server } from "@/types/server";
import {
  Modal,
  NumberInput,
  Text,
  TextInput,
  Flex,
  Checkbox,
  Group,
  PasswordInput,
  TagsInput,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react";
import { useEffect } from "react";

interface ServerEditModalProps {
  isOpen: boolean;
  close: () => void;
  initialServer?: Server; // Undefined means new
  save: (state: Server) => void;
}
const ServerEditModal = ({
  isOpen,
  close,
  initialServer,
  save,
}: ServerEditModalProps) => {
  const emptyValues: Server = {
    host: "",
    port: 0,
    secure: false,
    username: "",
    password: "",
    senders: [],
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: emptyValues,
    validate: {
      host: (value) => (value !== "" ? null : "无效的服务器名"),
      port: (value) => (value > 0 && value < 65536 ? null : "无效的端口号"),
      senders: (value) => (value.length > 0 ? null : "未定义发送者列表"),
    },
  });

  useEffect(() => {
    if (isOpen) {
      // Reset initial value
      form.setInitialValues(
        initialServer ? structuredClone(initialServer) : emptyValues,
      );

      // Reset form to initial state
      form.reset();
    }
  }, [isOpen]);

  return (
    <Modal
      opened={isOpen}
      onClose={close}
      title={
        <Group gap="xs">
          <IconEdit />
          {initialServer ? `修改 ${initialServer.host}` : "新增服务器"}
        </Group>
      }
      size="lg"
    >
      <form onSubmit={form.onSubmit(save)}>
        <Flex direction="column" gap={6}>
          {/*Host & port*/}
          <Flex direction="row" gap="xs">
            <TextInput
              label="主机名"
              style={{
                flexGrow: 1,
              }}
              {...form.getInputProps("host")}
              key={form.key("host")}
            />

            <NumberInput
              label="端口"
              min={1}
              max={65535}
              clampBehavior="strict"
              {...form.getInputProps("port")}
              key={form.key("port")}
            />

            <Flex direction="column" justify="end">
              <Text size="sm" fw={500} mb={1}>
                安全
              </Text>
              <Checkbox
                size="xl"
                {...form.getInputProps("secure", {
                  type: "checkbox",
                })}
                key={form.key("secure")}
              />
            </Flex>
          </Flex>

          {/*Username & password*/}
          <Group grow>
            <TextInput
              label="用户名"
              {...form.getInputProps("username")}
              key={form.key("username")}
            />

            <PasswordInput
              label="密码"
              {...form.getInputProps("password")}
              key={form.key("password")}
            />
          </Group>

          {/*Senders*/}
          <TagsInput
            label="发件人身份"
            {...form.getInputProps("senders")}
            key={form.key("senders")}
          />

          {/*Save button*/}
          <Button mt="sm" leftSection={<IconDeviceFloppy />} type="submit">
            保存
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default ServerEditModal;
