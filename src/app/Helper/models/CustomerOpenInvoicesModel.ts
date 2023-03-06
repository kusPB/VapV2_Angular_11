export class CustomerOpenInvoicesModel{
    public CustomerID? :number ;
    public CustomerInvoiceNo :string ;
    public dPaidAmount? : number;
    public dPaidAmountString :string ;
    public dRemainingAmount? : number;
    public dRemainingAmountString :string ;
    public dTotalAmount? : number ;
    public dTotalAmountString : string;
    public DueDate? :Date ;
    public DueDateString :string ;
    public purchaseAmount? :number ;
    public SaleID? : number ;
    public SalePaymentID :number ;
}