"use client";
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { SettingsData } from '@/hooks/fetchSettings';

export default function SettingsCookieSync({ settings }: { settings: SettingsData | null }) {
    useEffect(() => {
        if (settings) {
            if (settings.vat) Cookies.set('vat', settings.vat);
            if (settings.tax) Cookies.set('tax', settings.tax.toString());
            if (settings.service) Cookies.set('service', settings.service.toString());
            // Store full settings if needed for client side access
            Cookies.set('app_settings', JSON.stringify(settings), { expires: 7 });
        }
    }, [settings]);
    return null;
}
