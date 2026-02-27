"use client";

import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VerifyForm from "./VerifyForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { SettingsType } from "@/lib/types";
import { fetchSettings } from "@/hooks/fetchSettings";

type Screen = "login" | "register" | "forgotPassword" | "verify" | "resetPassword";

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
  const [screen, setScreen] = useState<Screen>("login");
  // State passed between screens (no URL params needed)
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingOtp, setPendingOtp] = useState("");
  const [verifyMode, setVerifyMode] = useState<"register" | "reset">("register");

  const handleSuccess = () => {
    fetchSettings(undefined, true).then(() => {
      if (onSuccess) onSuccess();
    });
  };

  const handleHide = () => {
    setScreen("login");
    setPendingEmail("");
    setPendingOtp("");
    onHide();
  };

  // ── Navigation callbacks passed to child forms ──────────────────────────────

  /** Called by LoginForm when server returns 403 (unverified) */
  const handleNeedVerify = (email: string) => {
    setPendingEmail(email);
    setVerifyMode("register");
    setScreen("verify");
  };

  /** Called by RegisterForm after successful registration */
  const handleRegisterNeedVerify = (email: string) => {
    setPendingEmail(email);
    setVerifyMode("register");
    setScreen("verify");
  };

  /** Called by ForgotPasswordForm after OTP is sent */
  const handleForgotNeedVerify = (email: string) => {
    setPendingEmail(email);
    setVerifyMode("reset");
    setScreen("verify");
  };

  /** Called by VerifyForm after OTP is confirmed — mode=reset → show reset form */
  const handleVerified = (email: string, otp: string) => {
    if (verifyMode === "reset") {
      setPendingEmail(email);
      setPendingOtp(otp);
      setScreen("resetPassword");
    } else {
      // mode=register → user is now logged in, close dialog
      handleSuccess();
    }
  };

  /** Called by ResetPasswordForm after password is changed */
  const handleResetSuccess = () => {
    setScreen("login");
    setPendingEmail("");
    setPendingOtp("");
  };

  // ── Render ──────────────────────────────────────────────────────────────────

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
        {screen === "verify" ? (
          <VerifyForm
            email={pendingEmail}
            mode={verifyMode}
            onVerified={handleVerified}
            onSwitchToLogin={() => setScreen("login")}
          />
        ) : screen === "resetPassword" ? (
          <ResetPasswordForm
            email={pendingEmail}
            otp={pendingOtp}
            onSuccess={handleResetSuccess}
            onSwitchToLogin={() => setScreen("login")}
          />
        ) : screen === "forgotPassword" ? (
          <ForgotPasswordForm
            initSettings={initSettings}
            onSwitchToLogin={() => setScreen("login")}
            onNeedVerify={handleForgotNeedVerify}
          />
        ) : screen === "register" ? (
          <RegisterForm
            initSettings={initSettings}
            onSwitchToLogin={() => setScreen("login")}
            onNeedVerify={handleRegisterNeedVerify}
          />
        ) : (
          <LoginForm
            initSettings={initSettings}
            onSwitchToRegister={() => setScreen("register")}
            onSwitchToForgotPassword={() => setScreen("forgotPassword")}
            onSuccess={handleSuccess}
            onNeedVerify={handleNeedVerify}
          />
        )}
      </div>

      {/* Toast container scoped inside the dialog so notifications always show */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 99999 }}
      />
    </Dialog>
  );
}
