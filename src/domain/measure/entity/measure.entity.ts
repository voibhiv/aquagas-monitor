export type MeasureProps = {
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: string;
  hasConfirmed: boolean;
  image_url: string;
};

export class Measure {
  private constructor(private props: MeasureProps) {}

  public static create(
    measure_uuid: string,
    measure_datetime: Date,
    measure_type: string,
    hasConfirmed: boolean,
    image_url: string,
  ) {
    return new Measure({
      measure_uuid,
      measure_datetime,
      measure_type,
      hasConfirmed,
      image_url,
    });
  }

  public static with(props: MeasureProps) {
    return new Measure(props);
  }
}
