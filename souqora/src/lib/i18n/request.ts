import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { locales, type Locale } from "./config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale =
    rawLocale && locales.includes(rawLocale as Locale) ? rawLocale : "ar";

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
