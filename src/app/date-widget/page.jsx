"use client";
import React, { useState, useMemo, useCallback } from 'react';
import DateTimeWidget from './DateTimeWidget';
import DateTimeConfig from './DateTimeConfig';
import DateWidgetConfig from './DateWidgetContext';
import { useSearchParams, usePathname } from 'next/navigation';
import { DateTime } from "luxon";

function DateWidgetPage() {
  const dateWidgetConfig = DateWidgetConfig();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  
  const hideNav = searchParams.has('hidenav') && searchParams.get('hidenav') == 1;
  const localTime = DateTime.local();
  const timeZone = searchParams.get('tz') || localTime.zoneName;
  const locale = searchParams.get('locale') || localTime.locale;

  // Memoize copyUrl to avoid recalculating on each render
  const copyUrl = useMemo(() => {
    let baseUrl = (typeof window !== 'undefined' ? window.location.origin : '') + pathname + '?hidenav=1';
    baseUrl += `&tz=${timeZone}&locale=${locale}`;
    if (searchParams.toString().length > 0) {
      baseUrl += `&${searchParams.toString()}`;
    }
    return baseUrl;
  }, [pathname, searchParams, timeZone, locale]);

  // Memoize copyToClipboard function
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(copyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [copyUrl]);

  // Update dateWidgetConfig with memoized values
  dateWidgetConfig.tz = timeZone;
  dateWidgetConfig.locale = locale;

  return (
    <div className="flex flex-col gap-10 w-3/4 mx-auto">
      <div className="flex flex-col md:flex-row w-full justify-around">
        {!hideNav && (
          <div className="w-1/2">
            <h3 className="mb-4 text-dark">Date/time settings</h3>
            <DateTimeConfig config={dateWidgetConfig} />
          </div>
        )}
        <div className="flex flex-col items-start min-w-[20vw] sm:mt-0 mt-3">
          {!hideNav && <h3 className="mb-4 text-dark">Preview</h3>}
          <DateTimeWidget config={dateWidgetConfig} />
        </div>
      </div>

      {!hideNav && (
        <div className="h-24 w-full">
          <p>URL to copy</p>
          <div className="w-full flex flex-row">
            <input
              type="text"
              className="w-full mr-2 border-2 border-gray-300 rounded-md p-1 text-lg"
              value={copyUrl}
              readOnly
            />
            <button
              onClick={copyToClipboard}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-lg"
            >
              {copied ? <i className="fa fa-check"></i> : <i className="fa fa-copy"></i>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateWidgetPage;
