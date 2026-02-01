import { reservationService } from "@/src/api/services/reservationService";
import { expenseService } from "@/src/api/services/expenseService";
import { damageService } from "@/src/api/services/damageService";
import type {
  Reservation,
  ApartmentExpenseDTO,
  ApartmentDamageDTO,
} from "@/src/types/types";

export interface AnalyticsParams {
  apartmentId: string; // you said you already pass it
}

export type CostCategoryName = "Režije" | "Šteta" | "Čišćenje" | "Namirnice";

export interface CostCategory {
  category: CostCategoryName;
  amount: number;
  percentage: number; // computed from totalCosts
}

export interface ApartmentInfo {
  id: string;
  title: string;
  address: string;
  imageUrl: string;
}

export interface AnalyticsData {
  // keep if your UI needs it; otherwise you can remove apartment completely
  apartment: ApartmentInfo;

  totalIncome: number;
  totalCosts: number;
  totalProfit: number;
  costsByCategory: CostCategory[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

const safeNumber = (n: unknown) => (typeof n === "number" && Number.isFinite(n) ? n : 0);

const CATEGORY_ORDER: CostCategoryName[] = ["Režije", "Šteta", "Čišćenje", "Namirnice"];

export const analyticsService = {
  async getAnalytics(params: AnalyticsParams): Promise<AnalyticsData> {
    const apartmentIdNum = Number(params.apartmentId);

    if (!Number.isFinite(apartmentIdNum)) {
      throw new Error(`Invalid apartmentId: ${params.apartmentId}`);
    }

    // fetch everything in parallel
    const [reservations, expenses, damages] = await Promise.all([
      reservationService.getReservations(apartmentIdNum) as Promise<Reservation[]>,
      expenseService.getByApartment(apartmentIdNum) as Promise<ApartmentExpenseDTO[]>,
      damageService.getByApartment(apartmentIdNum) as Promise<ApartmentDamageDTO[]>,
    ]);

    // ------------------- INCOME -------------------
    const totalIncome = round2(
      (reservations ?? []).reduce((sum, r) => sum + safeNumber(r.price), 0)
    );

    // ------------------- COSTS -------------------
    const expensesTotal = round2(
      (expenses ?? []).reduce((sum, e) => sum + safeNumber(e.amount), 0)
    );

    const damagesTotal = round2(
      (damages ?? []).reduce((sum, d) => sum + safeNumber(d.damagePrice), 0)
    );

    const totalCosts = round2(expensesTotal + damagesTotal);
    const totalProfit = round2(totalIncome - totalCosts);

    // ------------------- COSTS BY CATEGORY -------------------
    // expenses grouped by expenseType -> rezije/ciscenje/namirnice
    // damages -> steta
    const expenseByType: Record<CostCategoryName, number> = {
      Režije: 0,
      Šteta: 0,
      Čišćenje: 0,
      Namirnice: 0,
    };

    for (const e of expenses ?? []) {
      // if backend sends expenseType as one of these strings, this just works.
      // otherwise you can map here (see note below).
      const type = e.expenseType as CostCategoryName;

      if (type === "Režije" || type === "Čišćenje" || type === "Namirnice") {
        expenseByType[type] += safeNumber(e.amount);
      } else {
        // ignore unknown types (or add them later)
      }
    }

    // steta from damages
    expenseByType.Šteta = damagesTotal;

    const costsByCategory: CostCategory[] = CATEGORY_ORDER.map((cat) => {
      const amount = round2(expenseByType[cat] ?? 0);
      const percentage =
        totalCosts > 0 ? round2((amount / totalCosts) * 100) : 0;

      return { category: cat, amount, percentage };
    });

    // ------------------- APARTMENT INFO -------------------
    // You didn't give an apartment endpoint here, so we keep placeholders.
    // If you already have apartment details in cache somewhere, you can plug it in.
    const apartment: ApartmentInfo = {
      id: params.apartmentId,
      title: "—",
      address: "—",
      imageUrl: "",
    };

    return {
      apartment,
      totalIncome,
      totalCosts,
      totalProfit,
      costsByCategory,
    };
  },
};
