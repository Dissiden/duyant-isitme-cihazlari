function getConfig() {
  const url =
    process.env.SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase ayarları eksik. SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanımlanmalı."
    );
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

export async function supabaseRest(
  path,
  options = {}
) {
  const {
    url,
    serviceRoleKey,
  } = getConfig();

  const method =
    options.method || "GET";

  const headers = {
    apikey: serviceRoleKey,

    Authorization:
      `Bearer ${serviceRoleKey}`,

    ...(options.body
      ? {
          "Content-Type":
            "application/json",
        }
      : {}),

    ...(options.prefer
      ? {
          Prefer:
            options.prefer,
        }
      : {}),
  };

  const response =
    await fetch(
      `${url}/rest/v1/${path}`,
      {
        method,

        headers,

        body:
          options.body
            ? JSON.stringify(
                options.body
              )
            : undefined,

        cache: "no-store",
      }
    );

  if (!response.ok) {
    let details = "";

    try {
      const payload =
        await response.json();

      details =
        payload?.message ||
        payload?.hint ||
        JSON.stringify(payload);
    } catch {
      details =
        await response.text();
    }

    throw new Error(
      details ||
        `Supabase isteği başarısız: ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  const text =
    await response.text();

  return text
    ? JSON.parse(text)
    : null;
}

export function normalizeTc(value) {
  return String(value || "")
    .replace(/\D/g, "")
    .slice(0, 11);
}

export function cleanText(
  value,
  maxLength = 500
) {
  return String(value || "")
    .trim()
    .slice(0, maxLength);
}