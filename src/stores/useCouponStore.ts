import { create } from 'zustand';

interface Coupon {
    id: string;
    code: string;
    type: 'PERCENTAGE' | 'FIXED' | 'TRIAL';
    value: number;
}

interface CouponState {
  code: string;
  appliedCoupon: Coupon | null;
  discountValue: number;
  
  setCode: (code: string) => void;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  setDiscount: (value: number) => void;
  clearCoupon: () => void;
}

export const useCouponStore = create<CouponState>((set) => ({
  code: '',
  appliedCoupon: null,
  discountValue: 0,

  setCode: (code) => set({ code }),
  setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
  setDiscount: (value) => set({ discountValue: value }),
  clearCoupon: () => set({ appliedCoupon: null, discountValue: 0, code: '' }),
}));
