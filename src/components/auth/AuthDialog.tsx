"use client";

import { useState } from "react";
import { Dialog } from "primereact/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { SettingsType } from "@/lib/types";
import { fetchSettings } from "@/hooks/fetchSettings";

interface AuthDialogProps {
  visible: boolean;
  onHide: () => void;
  initSettings: SettingsType;
  onSuccess?: () => void;
}

export default function AuthDialog({
  visible,
  onHide,
  initSettings,
  onSuccess,
}: AuthDialogProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSuccess = () => {
    // Force refresh settings after login
    fetchSettings(undefined, true).then(() => {
      if (onSuccess) onSuccess();
    });
  };

  const handleSwitchToRegister = () => {
    setShowForgotPassword(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowForgotPassword(false);
    setShowRegister(false);
  };

  const handleSwitchToForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleHide = () => {
    setShowRegister(false);
    setShowForgotPassword(false);
    onHide();
  };

  return (
    <Dialog
      visible={visible}
      onHide={handleHide}
      modal
      header={null}
      footer={null}
      dismissableMask
      closable
      className="w-[90%] max-w-[400px] !rounded-2xl overflow-hidden"
      contentClassName="!rounded-2xl"
      showHeader={false}
      maskClassName="!bg-black/50"
    >
      <div className="bg-white rounded-2xl overflow-hidden">
        {showForgotPassword ? (
          <ForgotPasswordForm
            initSettings={initSettings}
            onSwitchToLogin={handleSwitchToLogin}
          />
        ) : showRegister ? (
          <RegisterForm
            initSettings={initSettings}
            onSwitchToLogin={handleSwitchToLogin}
            onSuccess={handleSuccess}
          />
        ) : (
          <LoginForm
            initSettings={initSettings}
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToForgotPassword={handleSwitchToForgotPassword}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Dialog>
  );
}
