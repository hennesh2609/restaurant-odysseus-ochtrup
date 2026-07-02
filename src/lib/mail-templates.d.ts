declare module "*mail-templates.mjs" {
  export const ASSET_BASE: string;
  export const ALLGEMEIN_BEISPIEL: string;

  export interface MailTemplate {
    key: "tisch" | "event" | "allgemein";
    alias: string;
    name: string;
    subject: string;
    html: string;
    sample: Record<string, string>;
  }

  export const TEMPLATES: MailTemplate[];
  export function renderPreview(html: string, vars: Record<string, string>): string;
}
