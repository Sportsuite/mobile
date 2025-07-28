interface PaymentSheetParams {
  NewOrder: {
    data: any;
    clientSecret: string;
    customer: string;
    ephemeralKey: string;
  };
}
