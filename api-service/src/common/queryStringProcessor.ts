export class QueryStringProcessor {
  public numberRegexp = /^-?\d+(\.\d+)?$/;
  public arrayRegexp = /^\[\s*(?:(?:"[^"]*"|'[^']*'|-?\d+(?:\.\d+)?)(?:\s*,\s*(?:"[^"]*"|'[^']*'|-?\d+(?:\.\d+)?))*)?\s*\]$/;

  public parseBoolean(value: string): boolean {
    return value === "true";
  }

  public processNumber(value: string): number {
    return Number(value);
  }

  public processQueries(value: Record<string, string>): Record<string, any> {
    const parsedQuery = {};

    Object.entries(value).forEach(([key, value]) => {
      if (["true", "false"].includes(value)) {
        parsedQuery[key] = this.parseBoolean(value);
      } else if (this.numberRegexp.test(value)) {
        parsedQuery[key] = this.processNumber(value);
      } else if (this.arrayRegexp.test(value)) {
        try {
          parsedQuery[key] = JSON.parse(value);
        } catch {}
      } else {
        parsedQuery[key] = value;
      }
    });

    return parsedQuery;
  }
}
