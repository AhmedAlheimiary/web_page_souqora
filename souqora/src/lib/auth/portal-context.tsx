"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type PortalRole = "seller" | "admin" | null;

interface PortalAuthContextType {
  portalRole: PortalRole;
  isSellerUnlocked: boolean;
  isAdminUnlocked: boolean;
  isModalOpen: boolean;
  openPortalModal: () => void;
  closePortalModal: () => void;
  unlockWithPasscode: (code: string) => { success: boolean; role?: PortalRole; error?: string };
  lockPortal: () => void;
}

const PortalAuthContext = createContext<PortalAuthContextType>({
  portalRole: null,
  isSellerUnlocked: false,
  isAdminUnlocked: false,
  isModalOpen: false,
  openPortalModal: () => {},
  closePortalModal: () => {},
  unlockWithPasscode: () => ({ success: false, error: "Not initialized" }),
  lockPortal: () => {},
});

// Configured default secret passcodes
const VALID_SELLER_CODES = [
  (process.env.NEXT_PUBLIC_SELLER_PASSCODE || "SELLER-2026").trim().toLowerCase(),
  "seller123",
  "تاجر2026",
];

const VALID_ADMIN_CODES = [
  (process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "ADMIN-2026").trim().toLowerCase(),
  "admin123",
  "مدير2026",
];

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const [portalRole, setPortalRole] = useState<PortalRole>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("souqora_portal_role");
      if (saved === "seller" || saved === "admin") {
        setPortalRole(saved);
      }
    } catch {
      // Storage access disabled
    }
  }, []);

  const openPortalModal = () => setIsModalOpen(true);
  const closePortalModal = () => setIsModalOpen(false);

  const unlockWithPasscode = (
    code: string
  ): { success: boolean; role?: PortalRole; error?: string } => {
    const cleanCode = code.trim().toLowerCase();
    if (!cleanCode) {
      return { success: false, error: "يرجى إدخال رمز المرور السري" };
    }

    if (VALID_ADMIN_CODES.includes(cleanCode)) {
      setPortalRole("admin");
      try {
        localStorage.setItem("souqora_portal_role", "admin");
        document.cookie = "souqora_portal_unlocked=admin; path=/; max-age=86400; SameSite=Lax";
      } catch {}
      return { success: true, role: "admin" as PortalRole };
    }

    if (VALID_SELLER_CODES.includes(cleanCode)) {
      setPortalRole("seller");
      try {
        localStorage.setItem("souqora_portal_role", "seller");
        document.cookie = "souqora_portal_unlocked=seller; path=/; max-age=86400; SameSite=Lax";
      } catch {}
      return { success: true, role: "seller" as PortalRole };
    }

    return {
      success: false,
      error: "رمز المرور غير صحيح. تأكد من إدخال الرمز المعتمد للتجار أو المدراء.",
    };
  };

  const lockPortal = () => {
    setPortalRole(null);
    try {
      localStorage.removeItem("souqora_portal_role");
      document.cookie = "souqora_portal_unlocked=; path=/; max-age=0; SameSite=Lax";
    } catch {}
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <PortalAuthContext.Provider
      value={{
        portalRole,
        isSellerUnlocked: portalRole === "seller" || portalRole === "admin",
        isAdminUnlocked: portalRole === "admin",
        isModalOpen,
        openPortalModal,
        closePortalModal,
        unlockWithPasscode,
        lockPortal,
      }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  return useContext(PortalAuthContext);
}
