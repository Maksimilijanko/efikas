import { CR_API_BASE_URL } from "@/src/util/apiConstants";
import { FiscalConfig, FiscalItem, PaymentAmounts, FiscalResponse, PaymentMethodApi } from "@/src/types/types";

export class FiscalService {
  private config: FiscalConfig;

  constructor(config: FiscalConfig) {
    this.config = config;
  }

  // --- Helpers ---

  /**
   * Formatira broj na 2 decimale (npr. 10.50) jer API očekuje string
   */
  private formatDecimal(num: number): string {
    return num.toFixed(2);
  }

  /**
   * Formatira količinu na 3 decimale
   */
  private formatQuantity(num: number): string {
    return num.toFixed(3);
  }

  /**
   * Dopunjava GTIN (šifru) nulama do 8 karaktera ako je kraća
   */
  private formatGtin(gtin: string): string {
    if (gtin.length < 8) {
      return gtin.padStart(8, '0');
    }
    return gtin;
  }

  /**
   * Pomoćna metoda za kreiranje URL-a. 
   * Osigurava da imamo ispravan slash na kraju IP adrese prije dodavanja endpointa.
   */
  private getUrl(endpoint: string): string {
    const baseUrl = this.config.ipAddress.endsWith('/') 
      ? this.config.ipAddress 
      : `${this.config.ipAddress}/`;
    return `${baseUrl}${endpoint}`;
  }

  // --- API Methods ---

  /**
   * 1. PROVJERA STATUSA UREĐAJA (GET /attention)
   */
  public async checkDeviceStatus(): Promise<boolean> {
    try {
      const url = this.getUrl('attention');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Device status check failed: ${response.status}`);
      }

      return true; 
    } catch (error) {
      console.error("Fiscal device is not ready:", error);
      throw error;
    }
  }

  /**
   * 2. SLANJE RAČUNA (POST /invoices - Sale)
   */
  public async sendSaleInvoice(
    items: FiscalItem[], 
    payments: PaymentAmounts, 
    buyerId: string = ""
  ): Promise<FiscalResponse | null> {
    
    // Opciono: Provjeri status prije slanja
    await this.checkDeviceStatus();

    const url = this.getUrl('invoices');
    
    // Mapiranje plaćanja u API format
    const paymentMethods: PaymentMethodApi[] = [];
    if (payments.cash && payments.cash > 0) 
      paymentMethods.push({ amount: this.formatDecimal(payments.cash), paymentType: "Cash" });
    if (payments.card && payments.card > 0) 
      paymentMethods.push({ amount: this.formatDecimal(payments.card), paymentType: "Card" });
    if (payments.check && payments.check > 0) 
      paymentMethods.push({ amount: this.formatDecimal(payments.check), paymentType: "Check" });
    if (payments.wireTransfer && payments.wireTransfer > 0) 
      paymentMethods.push({ amount: this.formatDecimal(payments.wireTransfer), paymentType: "WireTransfer" });

    // Mapiranje artikala u API format
    const apiItems = items.map(item => ({
      name: item.name,
      gtin: this.formatGtin(item.gtin),
      labels: [item.taxLabel],
      totalAmount: this.formatDecimal(item.totalAmount),
      unitPrice: this.formatDecimal(item.unitPrice),
      quantity: this.formatQuantity(item.quantity)
    }));

    // Kreiranje payload-a
    const payload = {
      invoiceRequest: {
        invoiceType: "Normal",
        transactionType: "Sale",
        payment: paymentMethods,
        items: apiItems,
        cashier: this.config.cashierName,
        ...(buyerId ? { buyerId } : {})
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'RequestId': crypto.randomUUID() // Generiše unique ID
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error:", response.status, errorText);
        throw new Error(`Fiscalization failed: ${errorText}`);
      }

      const responseData = await response.json();
      
      // Vraća podatke definisane u FiscalResponse interfejsu
      return {
        invoiceNumber: responseData.invoiceNumber,
        sdcDateTime: responseData.sdcDateTime,
        tin: responseData.tin,
        invoiceCounter: responseData.invoiceCounter,
        mrc: responseData.mrc
      };

    } catch (error) {
      console.error("Error sending sale invoice:", error);
      throw error;
    }
  }

  /**
   * 3. STORNO RAČUNA (POST /invoices - Refund)
   */
  public async sendRefundInvoice(
    items: FiscalItem[], 
    payments: PaymentAmounts, 
    originalInvoiceNumber: string,
    originalInvoiceDateTime: Date | string, 
    buyerId: string = ""
  ): Promise<void> {

    const url = this.getUrl('invoices');

    // Mapiranje plaćanja (isto kao Sale)
    const paymentMethods: PaymentMethodApi[] = [];
    if (payments.cash && payments.cash > 0) 
      paymentMethods.push({ amount: this.formatDecimal(payments.cash), paymentType: "Cash" });
    if (payments.card && payments.card > 0) 
      paymentMethods.push({ amount: this.formatDecimal(payments.card), paymentType: "Card" });
    if (payments.check && payments.check > 0) 
      paymentMethods.push({ amount: this.formatDecimal(payments.check), paymentType: "Check" });
    if (payments.wireTransfer && payments.wireTransfer > 0) 
      paymentMethods.push({ amount: this.formatDecimal(payments.wireTransfer), paymentType: "WireTransfer" });

    // Mapiranje artikala (isto kao Sale)
    const apiItems = items.map(item => ({
      name: item.name,
      gtin: this.formatGtin(item.gtin),
      labels: [item.taxLabel],
      totalAmount: this.formatDecimal(item.totalAmount),
      unitPrice: this.formatDecimal(item.unitPrice),
      quantity: this.formatQuantity(item.quantity)
    }));

    // Formatiranje datuma reference
    let formattedRefDate: string;
    if (originalInvoiceDateTime instanceof Date) {
        formattedRefDate = originalInvoiceDateTime.toISOString();
    } else {
        formattedRefDate = originalInvoiceDateTime;
    }

    const payload = {
      invoiceRequest: {
        invoiceType: "Normal",
        transactionType: "Refund",
        referentDocumentNumber: originalInvoiceNumber,
        referentDocumentDT: formattedRefDate,
        payment: paymentMethods,
        items: apiItems,
        cashier: this.config.cashierName,
        ...(buyerId ? { buyerId } : {})
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'RequestId': crypto.randomUUID(),
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error:", response.status, errorText);
        throw new Error(`Refund failed: ${errorText}`);
      }

      console.log("Refund successfully processed.");

    } catch (error) {
      console.error("Error sending refund:", error);
      throw error;
    }
  }
}