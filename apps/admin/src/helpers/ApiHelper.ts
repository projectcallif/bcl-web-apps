export class ApiHelper {
  static cleanParams(
    params: Record<string, unknown>,
  ): Record<string, string | number | boolean> {
    const cleaned: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        cleaned[key] = value as string | number | boolean;
      }
    }
    return cleaned;
  }
}
