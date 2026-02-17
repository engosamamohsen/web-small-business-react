"use client";

import { useState } from "react";
import { Dialog } from "primereact/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { SettingsType } from "@/lib/types";

type AuthMode = "login" | "register" | "forgotPassword";

interface AuthDialogProps {
  visible: boolean;
  onHide: () => void;
  initSettings: SettingsType;
}

export default function AuthDialog({
  visible,
  onHide,
  initSettings,
}: AuthDialogProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
          />
        ) : (
          <LoginForm
            initSettings={initSettings}
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToForgotPassword={handleSwitchToForgotPassword}
          />
        )}
      </div>
    </Dialog>
  );
}
