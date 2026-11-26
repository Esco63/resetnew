"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_PRICING_SETTINGS,
  PRICING_STORAGE_KEY,
  type PricingSettings,
} from "@/lib/pricing";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function readSettings(): PricingSettings {
  if (typeof window === "undefined") return DEFAULT_PRICING_SETTINGS;

  try {
    const raw = window.localStorage.getItem(PRICING_STORAGE_KEY);
    if (!raw) return DEFAULT_PRICING_SETTINGS;
    return {
      ...DEFAULT_PRICING_SETTINGS,
      ...JSON.parse(raw),
    };
  } catch {
    return DEFAULT_PRICING_SETTINGS;
  }
}

export function usePricingSettings() {
  const [settings, setSettingsState] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);

  useEffect(() => {
    setSettingsState(readSettings());

    async function loadRemoteSettings() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from("pricing_settings")
        .select("settings")
        .eq("id", "default")
        .single();

      if (!error && data?.settings) {
        const remoteSettings = {
          ...DEFAULT_PRICING_SETTINGS,
          ...(data.settings as PricingSettings),
        };
        setSettingsState(remoteSettings);
        window.localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(remoteSettings));
      }
    }

    void loadRemoteSettings();

    const onStorage = (event: StorageEvent) => {
      if (event.key === PRICING_STORAGE_KEY) setSettingsState(readSettings());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setSettings = useCallback((next: PricingSettings) => {
    setSettingsState(next);
    window.localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(next));
    void fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_PRICING_SETTINGS);
    window.localStorage.removeItem(PRICING_STORAGE_KEY);
  }, []);

  return { settings, setSettings, resetSettings };
}
