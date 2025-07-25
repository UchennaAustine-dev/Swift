export interface ValidationError {
  field: string;
  message: string;
}

export function validateSettings(settings: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Auto-cancel timeout validation
  if (
    !settings.autoCancel ||
    isNaN(Number(settings.autoCancel)) ||
    Number(settings.autoCancel) < 1
  ) {
    errors.push({
      field: "autoCancel",
      message: "Auto-cancel timeout must be a positive number",
    });
  }

  // Trade retry validation
  if (
    !settings.tradeRetry ||
    isNaN(Number(settings.tradeRetry)) ||
    Number(settings.tradeRetry) < 1
  ) {
    errors.push({
      field: "tradeRetry",
      message: "Trade retry limit must be a positive number",
    });
  }

  // Payout timeout validation
  if (
    !settings.payoutTimeout ||
    isNaN(Number(settings.payoutTimeout)) ||
    Number(settings.payoutTimeout) < 1
  ) {
    errors.push({
      field: "payoutTimeout",
      message: "Payout timeout must be a positive number",
    });
  }

  // Telegram token validation
  if (
    !settings.telegramToken ||
    settings.telegramToken.trim() === "" ||
    settings.telegramToken.includes("•")
  ) {
    errors.push({
      field: "telegramToken",
      message: "Please enter a valid Telegram bot token",
    });
  }

  // WhatsApp token validation
  if (
    !settings.whatsappToken ||
    settings.whatsappToken.trim() === "" ||
    settings.whatsappToken.includes("•")
  ) {
    errors.push({
      field: "whatsappToken",
      message: "Please enter a valid WhatsApp business token",
    });
  }

  // Webhook URL validation
  if (!settings.webhookUrl || !isValidUrl(settings.webhookUrl)) {
    errors.push({
      field: "webhookUrl",
      message: "Please enter a valid webhook URL",
    });
  }

  // Email recipients validation
  if (settings.emailRecipients) {
    const emails = settings.emailRecipients
      .split(",")
      .map((email: string) => email.trim());
    const invalidEmails = emails.filter(
      (email: string) => !isValidEmail(email)
    );
    if (invalidEmails.length > 0) {
      errors.push({
        field: "emailRecipients",
        message: "Please enter valid email addresses separated by commas",
      });
    }
  }

  // Slack webhook validation
  if (settings.slackWebhook && !isValidUrl(settings.slackWebhook)) {
    errors.push({
      field: "slackWebhook",
      message: "Please enter a valid Slack webhook URL",
    });
  }

  // SMTP validation
  if (settings.senderEmail && !isValidEmail(settings.senderEmail)) {
    errors.push({
      field: "senderEmail",
      message: "Please enter a valid sender email address",
    });
  }

  if (settings.smtpHost && settings.smtpHost.trim() === "") {
    errors.push({
      field: "smtpHost",
      message: "SMTP host is required",
    });
  }

  if (
    settings.smtpPort &&
    (isNaN(Number(settings.smtpPort)) ||
      Number(settings.smtpPort) < 1 ||
      Number(settings.smtpPort) > 65535)
  ) {
    errors.push({
      field: "smtpPort",
      message: "SMTP port must be a valid port number (1-65535)",
    });
  }

  return errors;
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
