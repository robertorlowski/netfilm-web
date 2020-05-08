export class Movie {
  constructor(
    public site: string,
    public type: string,
    public url: string,
    public title: string,
    public time: number
  ) {}

  public toJson(): string {
    return JSON.stringify({
      site: this.site,
      type: this.type,
      link: this.url,
      title: this.title,
      time_min: this.time.toString(),
    });
  }
}
