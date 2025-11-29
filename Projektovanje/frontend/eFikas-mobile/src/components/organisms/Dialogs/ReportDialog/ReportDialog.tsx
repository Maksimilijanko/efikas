import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsDialog } from "../SettingsDialog/SettingsDialog";
import DescriptionBox from "@/src/components/atoms/DescriptionBox/DescriptionBox";

interface ReportDialogProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (text: string) => void;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({ visible, onCancel, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <SettingsDialog
      visible={visible}
      title={t("dialogs.report.title")}
      onClose={onCancel}
      onConfirm={() => {}}
    >
      <DescriptionBox
        size="md"
        placeholder={t("dialogs.report.placeholder")}
      />
    </SettingsDialog>
  );
};
