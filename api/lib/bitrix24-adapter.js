const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);

function enabled(value) {
  return TRUE_VALUES.has(String(value || '').trim().toLowerCase());
}

export function bitrix24Config(env = process.env) {
  return {
    enabled: enabled(env.BITRIX24_ENABLED),
    webhookUrl: env.BITRIX24_WEBHOOK_URL || '',
    assignedById: env.BITRIX24_ASSIGNED_BY_ID || '',
    categoryId: env.BITRIX24_CATEGORY_ID || ''
  };
}

export async function sendLeadToBitrix24(lead, context = {}, env = process.env) {
  const config = bitrix24Config(env);

  if (!config.enabled) {
    return { ok: true, skipped: true, reason: 'BITRIX24_ENABLED is not true' };
  }

  if (!config.webhookUrl) {
    return { ok: false, skipped: true, reason: 'BITRIX24_WEBHOOK_URL missing' };
  }

  const fields = {
    TITLE: `ABService · ${context.kind === 'parts' ? 'Запчасти' : context.kind === 'stationary-service' ? 'Стационарный сервис' : 'Сервис'}`,
    NAME: lead.name || '',
    PHONE: context.normalizedPhone ? [{ VALUE: context.normalizedPhone, VALUE_TYPE: 'WORK' }] : [],
    COMMENTS: [
      lead.machine ? `Техника: ${lead.machine}` : '',
      lead.location ? `Локация: ${lead.location}` : '',
      lead.issue ? `Проблема: ${lead.issue}` : '',
      lead.mode ? `Формат: ${lead.mode}` : '',
      lead.article ? `Артикул: ${lead.article}` : '',
      lead.part ? `Запчасть: ${lead.part}` : '',
      lead.source ? `Источник: ${lead.source}` : '',
      context.telegramMessageId ? `Telegram message: ${context.telegramMessageId}` : ''
    ].filter(Boolean).join('\n')
  };

  if (config.assignedById) fields.ASSIGNED_BY_ID = config.assignedById;
  if (config.categoryId) fields.CATEGORY_ID = config.categoryId;

  const endpoint = config.webhookUrl.replace(/\/$/, '') + '/crm.lead.add.json';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields })
  });
  const result = await response.json().catch(() => ({}));

  return {
    ok: response.ok && !result.error,
    skipped: false,
    status: response.status,
    id: result.result || null,
    error: result.error_description || result.error || null
  };
}
