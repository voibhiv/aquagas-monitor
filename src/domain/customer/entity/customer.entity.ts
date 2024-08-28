export type CustomerProps = {
  customer_code: string;
};

export class Customer {
  private constructor(private props: CustomerProps) {}

  public static create(customer_code: string) {
    return new Customer({
      customer_code,
    });
  }

  public static with(props: CustomerProps) {
    return new Customer(props);
  }
}
