export type MeasureProps = {
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
  measure_value: number;
  customer_code: string;
};

export class Measure {
  private constructor(private props: MeasureProps) {}

  public static create(
    measure_datetime: Date,
    measure_type: string,
    has_confirmed: boolean = false,
    image_url: string,
    measure_value: number,
    customer_code: string
  ) {
    return new Measure({
      measure_uuid: crypto.randomUUID().toString(),
      measure_datetime,
      measure_type,
      has_confirmed,
      image_url,
      measure_value,
      customer_code
    });
  }

  public static with(props: MeasureProps) {
    return new Measure(props);
  }

  public get measure_uuid() {
    return this.props.measure_uuid;
  }

  public get measure_datetime() {
    return this.props.measure_datetime;
  }

  public get measure_type() {
    return this.props.measure_type;
  }

  public get has_confirmed() {
    return this.props.has_confirmed;
  }

  public get image_url() {
    return this.props.image_url;
  }

  public get measure_value() {
    return this.props.measure_value;
  }

  public get customer_code() {
    return this.props.customer_code;
  }
}
