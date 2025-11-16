import { a as EnumStatus, b as EnumCommissionStatus } from './enum-kAdbNx_J.mjs';

const langs = ["vi", "lo", "en"];
const statusOptions = [
  { value: null, title: "T\u1EA5t c\u1EA3" },
  { value: EnumStatus.ACTIVE, title: "Ho\u1EA1t \u0111\u1ED9ng" },
  { value: EnumStatus.INACTIVE, title: "T\u1EA1m ng\u01B0ng" }
];
const expiryStatusOptions = [
  { value: null, title: "T\u1EA5t c\u1EA3" },
  { value: EnumStatus.ACTIVE, title: "Ho\u1EA1t \u0111\u1ED9ng" },
  { value: EnumStatus.EXPIRED, title: "\u0110\xE3 h\u1EBFt h\u1EA1n" }
];
const commissionStatusOptions = [
  { value: null, title: "T\u1EA5t c\u1EA3" },
  { value: EnumCommissionStatus.AWAITING_RATE, title: "Ch\u1EDD ch\u1ED1t %" },
  { value: EnumCommissionStatus.PENDING, title: "Ch\u1EDD thanh to\xE1n" },
  { value: EnumCommissionStatus.PAID, title: "\u0110\xE3 thanh to\xE1n" },
  { value: EnumCommissionStatus.CANCELLED, title: "\u0110\xE3 h\u1EE7y" }
];
const commissionTier = [
  { name: "Ti\xEAu chu\u1EA9n", requirement: "1-5 ng\u01B0\u1EDDi", rate: "15%" },
  { name: "B\u1EA1c", requirement: "6-15 ng\u01B0\u1EDDi", rate: "20%" },
  { name: "V\xE0ng", requirement: "16-30 ng\u01B0\u1EDDi", rate: "25%" },
  { name: "Kim C\u01B0\u01A1ng", requirement: "31+ ng\u01B0\u1EDDi", rate: "30%" }
];

export { commissionStatusOptions as a, commissionTier as c, expiryStatusOptions as e, langs as l, statusOptions as s };
//# sourceMappingURL=constants-B3HUeYES.mjs.map
