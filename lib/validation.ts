export interface ValidationError {
  field: string;
  message: string;
}

export const validateSettings = (settings: {
  autoCancel: string;
  tradeRetry: string;
  payoutTimeout: string;
  telegramToken: string;
  whatsappToken: string;
  webhookUrl: string;
  emailRecipients: string;
  slackWebhook: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate numeric fields
  if (
    !settings.autoCancel ||
    isNaN(Number(settings.autoCancel)) ||
    Number(settings.autoCancel) <= 0
  ) {
    errors.push({
      field: "autoCancel",
      message: "Auto-cancel timeout must be a positive number",
    });
  }

  if (
    !settings.tradeRetry ||
    isNaN(Number(settings.tradeRetry)) ||
    Number(settings.tradeRetry) <= 0
  ) {
    errors.push({
      field: "tradeRetry",
      message: "Trade retry limit must be a positive number",
    });
  }

  if (
    !settings.payoutTimeout ||
    isNaN(Number(settings.payoutTimeout)) ||
    Number(settings.payoutTimeout) <= 0
  ) {
    errors.push({
      field: "payoutTimeout",
      message: "Payout timeout must be a positive number",
    });
  }

  // Validate tokens (basic length check)
  if (
    settings.telegramToken &&
    !settings.telegramToken.includes("•") &&
    settings.telegramToken.length < 20
  ) {
    errors.push({
      field: "telegramToken",
      message: "Telegram token appears to be invalid",
    });
  }

  if (
    settings.whatsappToken &&
    !settings.whatsappToken.includes("•") &&
    settings.whatsappToken.length < 20
  ) {
    errors.push({
      field: "whatsappToken",
      message: "WhatsApp token appears to be invalid",
    });
  }

  // Validate URLs
  const urlPattern = /^https?:\/\/.+/;
  if (settings.webhookUrl && !urlPattern.test(settings.webhookUrl)) {
    errors.push({
      field: "webhookUrl",
      message: "Webhook URL must be a valid HTTP/HTTPS URL",
    });
  }

  if (settings.slackWebhook && !urlPattern.test(settings.slackWebhook)) {
    errors.push({
      field: "slackWebhook",
      message: "Slack webhook must be a valid HTTP/HTTPS URL",
    });
  }

  // Validate email recipients
  if (settings.emailRecipients) {
    const emails = settings.emailRecipients
      .split(",")
      .map((email) => email.trim());
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const email of emails) {
      if (email && !emailPattern.test(email)) {
        errors.push({
          field: "emailRecipients",
          message: `Invalid email address: ${email}`,
        });
        break;
      }
    }
  }

  return errors;
};
