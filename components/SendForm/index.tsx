import {
  ActionIcon,
  Button,
  Code,
  Container,
  Flex,
  Group,
  Input,
  Select,
  TagsInput,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconLayoutDashboard,
  IconMailFast,
  IconSectionSign,
  IconServer,
  IconSettings,
  IconTemplate,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import CodeHighlightEditor from "@/components/CodeHighlightEditor";
import { useForm } from "@mantine/form";
import type { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { readServers } from "@/slices/serversSlice";
import {
  addTemplate,
  readTemplates,
  saveTemplates,
} from "@/slices/templatesSlice";
import { actionIconStyle } from "@/styles/actionIconStyle";
import ServersEditModal from "@/components/ServersEditModal";
import TemplatesEditModal from "@/components/TemplatesEditModal";
import { notifications } from "@mantine/notifications";
import PreviewModal from "@/components/PreviewModal";
import type { Template } from "@/types/template";
import { notificationIconStyle } from "@/styles/notificationIconStyle";
import { SendRequest } from "@/types/sendRequest";

const SendForm = () => {
  const servers = useSelector((state: RootState) => state.servers);
  const templates = useSelector((state: RootState) => state.templates);
  const dispatch = useDispatch<AppDispatch>();

  const serversList = useMemo(
    () =>
      servers.map((server) => ({
        label: server.host,
        // value: server, // mantine cannot use object as select value
        value: server.host, // it only accepts string
        server, // use as append element
      })),
    [servers],
  );
  const sendersList = useRef<string[]>([]);

  const [isServersEditModalOpen, setIsServersEditModalOpen] = useState(false);
  const [isTemplatesEditModalOpen, setIsTemplatesEditModalOpen] =
    useState(false);
  const [previewContent, setPreviewContent] = useState<Template | null>(null);

  useEffect(() => {
    // Initial load
    dispatch(readServers());
    dispatch(readTemplates());
  }, []);

  const initialValues: {
    server: string;
    sender: string;
    receivers: string[];
    subject: string;
    body: string;
  } = {
    server: "",
    sender: "",
    receivers: [],
    subject: "",
    body: "",
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues,

    validate: {
      server: (value) => (value !== null ? null : "无效的服务器"),
      sender: (value) => (value !== "" ? null : "无效的身份"),
      receivers: (value) => (value.length > 0 ? null : "缺少收件人"),
    },
  });

  const refreshSenders = (server: string | null) => {
    form.setFieldValue("sender", initialValues.sender); // Reset selected
    sendersList.current = server
      ? serversList.find((s) => s.value === server)?.server.senders || []
      : [];
  };

  const sendEmail = async (values: typeof initialValues) => {
    const targetServer = servers.find((s) => s.host === values.server);
    if (!targetServer) {
      // Invalid server, reset
      form.setFieldValue("server", initialValues.server);
      return;
    }

    const req: SendRequest = {
      server: targetServer,
      sender: values.sender,
      receivers: values.receivers,
      mail: {
        subject: values.subject,
        body: values.body,
      },
    };

    const sendingNotify = notifications.show({
      // Loading state
      color: "blue",
      title: "邮件正在发送…",
      message: (
        <>
          {"正在以"}
          <Code>{req.sender}</Code>
          {"的身份发送邮件"}
          <Code>{req.mail.subject}</Code>
        </>
      ),
      loading: true,
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const res = await fetch("/send", {
        method: "POST",
        body: JSON.stringify(req),
      });
      if (res.ok) {
        notifications.update({
          // Success state
          color: "teal",
          title: "邮件发送成功",
          message: (
            <>
              {"邮件"}
              <Code>{req.mail.subject}</Code>
              {"很快就会送到目标用户邮箱里去啦"}
            </>
          ),
          icon: <IconCheck style={notificationIconStyle} />,
          loading: false,
          autoClose: 4_000,

          // ID
          id: sendingNotify,
        });
      } else {
        notifications.update({
          // Warning state
          color: "yellow",
          title: "邮件发送出现问题",
          message: "您可能需要检查相关的请求日志",
          icon: <IconAlertTriangle style={notificationIconStyle} />,
          loading: false,
          autoClose: 4_000,

          // ID
          id: sendingNotify,
        });
      }
    } catch (e) {
      notifications.update({
        // Error state
        color: "red",
        title: "邮件发送失败",
        message: "请检查相关的请求日志",
        icon: <IconX style={notificationIconStyle} />,
        loading: false,
        autoClose: 4_000,

        // ID
        id: sendingNotify,
      });
    }
  };

  const applyTemplateByIndex = (index: number) => {
    // Close modal
    setIsTemplatesEditModalOpen(false);
    // Apply to form
    form.setFieldValue("subject", templates[index].subject);
    form.setFieldValue("body", templates[index].body);
  };

  const saveCurrentAsTemplate = () => {
    // Close modal
    setIsTemplatesEditModalOpen(false);
    // Save subject & body
    const currentFormValues = form.getValues();
    if (currentFormValues.subject !== "" || currentFormValues.body !== "") {
      dispatch(
        addTemplate({
          subject: currentFormValues.subject,
          body: currentFormValues.body,
        }),
      );
      dispatch(saveTemplates());
      notifications.show({
        color: "green",
        title: "模板保存成功",
        message: (
          <>
            {"成功保存了"}
            <Code>{currentFormValues.subject}</Code>
          </>
        ),
      });
    } else {
      notifications.show({
        color: "yellow",
        title: "似乎没有可以保存的内容呢",
        message: "试试先输入一些文本吧？",
      });
    }
  };

  const preview = () => {
    const currentFormValues = form.getValues();
    setPreviewContent({
      subject: currentFormValues.subject,
      body: currentFormValues.body,
    });
  };

  return (
    <>
      <Container size="lg">
        <form onSubmit={form.onSubmit(sendEmail)}>
          <Flex direction="column" gap="md" my="lg">
            {/*Sender*/}
            <Flex direction="row" gap="md">
              <Group
                grow
                style={{
                  flexGrow: 1,
                }}
              >
                <Select
                  placeholder="SMTP 服务器"
                  leftSection={<IconServer size="60%" />}
                  searchable
                  nothingFoundMessage="没有找到欸…"
                  checkIconPosition="right"
                  data={serversList}
                  allowDeselect={false}
                  {...form.getInputProps("server")}
                  onChange={(newValue) => {
                    // Handle form event
                    form.getInputProps("server").onChange(newValue);

                    // Handle custom event
                    refreshSenders(newValue);
                  }}
                  key={form.key("server")}
                />

                <Select
                  placeholder="发件人身份"
                  leftSection={<IconUser size="60%" />}
                  searchable
                  nothingFoundMessage="没有找到欸…"
                  checkIconPosition="right"
                  data={sendersList.current}
                  allowDeselect={false}
                  {...form.getInputProps("sender")}
                  key={form.key("sender")}
                />
              </Group>

              <ActionIcon
                size="lg"
                title="设置"
                color="green"
                onClick={() => setIsServersEditModalOpen(true)}
              >
                <IconSettings style={actionIconStyle} />
              </ActionIcon>
            </Flex>

            {/*Receivers*/}
            <TagsInput
              placeholder="收件人列表"
              leftSection={<IconUsers size="60%" />}
              {...form.getInputProps("receivers")}
              key={form.key("receivers")}
            />

            {/*Subject*/}
            <Flex direction="row" gap="md">
              <Group
                grow
                style={{
                  flexGrow: 1,
                }}
              >
                <Input
                  placeholder="邮件主题"
                  leftSection={<IconSectionSign size="60%" />}
                  {...form.getInputProps("subject")}
                  key={form.key("subject")}
                />
              </Group>

              <ActionIcon
                size="lg"
                title="模板"
                color="orange"
                onClick={() => {
                  setIsTemplatesEditModalOpen(true);
                }}
              >
                <IconTemplate style={actionIconStyle} />
              </ActionIcon>
            </Flex>

            {/*Body*/}
            <CodeHighlightEditor
              {...form.getInputProps("body")}
              key={form.key("body")}
            />

            {/*Actions*/}
            <Group>
              <ActionIcon size="lg" title="预览" color="teal" onClick={preview}>
                <IconLayoutDashboard style={actionIconStyle} />
              </ActionIcon>

              <Button
                color="cyan"
                leftSection={<IconMailFast />}
                style={{
                  flexGrow: 1,
                }}
                title="发送"
                type="submit"
              >
                发送！
              </Button>
            </Group>
          </Flex>
        </form>
      </Container>

      <ServersEditModal
        isOpen={isServersEditModalOpen}
        close={() => {
          setIsServersEditModalOpen(false);
        }}
      />

      <TemplatesEditModal
        isOpen={isTemplatesEditModalOpen}
        close={() => {
          setIsTemplatesEditModalOpen(false);
        }}
        applyTemplate={applyTemplateByIndex}
        saveCurrentAsTemplate={saveCurrentAsTemplate}
      />

      <PreviewModal
        isOpen={previewContent !== null}
        close={() => {
          setPreviewContent(null);
        }}
        content={previewContent}
      />
    </>
  );
};

export default SendForm;
