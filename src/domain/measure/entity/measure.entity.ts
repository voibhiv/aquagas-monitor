export type MeasureProps = {
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
};

export class Measure {
  private constructor(private props: MeasureProps) {}

  public static create(
    measure_datetime: Date,
    measure_type: string,
    has_confirmed: boolean = false,
    image_url: string,
  ) {
    return new Measure({
      measure_uuid: crypto.randomUUID.toString(),
      measure_datetime,
      measure_type,
      has_confirmed,
      image_url,
    });
  }

  public static with(props: MeasureProps) {
    return new Measure(props);
  }
}
