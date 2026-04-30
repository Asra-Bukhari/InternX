export type PaymentStatus = "pending" | "released" | "in-escrow";

export interface Payment {
  id: string;
  projectTitle: string;
  counterpart: string;
  amount: string;
  status: PaymentStatus;
  date: string;
}
