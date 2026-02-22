"use client";
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { SettingsData, saveSettingsToLocalStorage } from '@/hooks/fetchSettings';

export default function SettingsCookieSync({ settings }: { settings: SettingsData | null }) {
    useEffect(() => {
        if (settings) {
            // Save to cookies
            if (settings.vat) Cookies.set('vat', settings.vat);
            if (settings.tax) Cookies.set('tax', settings.tax.toString());
            if (settings.service) Cookies.set('service', settings.service.toString());
            // Store full settings in cookies
            Cookies.set('app_settings', JSON.stringify(settings), { expires: 7 });
            
            // Also save to localStorage for faster client-side access
            saveSettingsToLocalStorage(settings);
        }
    }, [settings]);
    return null;
}
