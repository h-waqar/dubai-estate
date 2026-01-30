
import { CouponType } from '@prisma/client';

console.log('Checking CouponType...');
console.log('CouponType value:', CouponType);

if (CouponType) {
  console.log('CouponType keys:', Object.keys(CouponType));
} else {
  console.error('CouponType is UNDEFINED');
}
