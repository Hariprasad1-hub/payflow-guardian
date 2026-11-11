export const DEMO_METRICS = {
  totalRevenue: 28450.00,
  revenueGrowth: "+14.8% vs last month",
  pendingPayments: 4820.00,
  pendingCount: 4,
  overdueInvoices: 1950.00,
  overdueCount: 2,
  avgCollectionDays: 8.5,
  paypalSandboxStatus: "Connected (Sandbox)",
};

export const DEMO_REVENUE_CHART = [
  { month: 'Jun', received: 14200, pending: 3100 },
  { month: 'Jul', received: 18500, pending: 2800 },
  { month: 'Aug', received: 21000, pending: 4200 },
  { month: 'Sep', received: 19800, pending: 3900 },
  { month: 'Oct', received: 25400, pending: 5100 },
  { month: 'Nov', received: 28450, pending: 4820 },
];

export const DEMO_INVOICES = [
  {
    id: "INV-2026-089",
    client: "Acme Cybernetics Corp",
    clientEmail: "billing@acme-cyber.io",
    description: "Cloud Architecture Audit & Security Review",
    amount: 3400.00,
    currency: "USD",
    issueDate: "2026-11-04",
    dueDate: "2026-11-18",
    status: "paid", // paid, pending, overdue, draft
    paymentMethod: "PayPal Checkout",
    paypalOrderId: "PAYID-MQ5V8IA12300",
    paidAt: "2026-11-08 14:22 UTC"
  },
  {
    id: "INV-2026-090",
    client: "Northwind Data Labs",
    clientEmail: "finance@northwinddata.com",
    description: "ML Pipeline Optimization & FastAPI Gateway",
    amount: 2750.00,
    currency: "USD",
    issueDate: "2026-11-02",
    dueDate: "2026-11-16",
    status: "pending",
    paymentMethod: "PayPal Smart Button",
    paypalOrderId: "PAYID-MQ6N4BX88711",
    paidAt: null
  },
  {
    id: "INV-2026-091",
    client: "Hyperion Digital Agency",
    clientEmail: "accounts@hyperion.design",
    description: "Fullstack SaaS Prototype UI/UX Revamp",
    amount: 1200.00,
    currency: "USD",
    issueDate: "2026-10-20",
    dueDate: "2026-11-03",
    status: "overdue",
    paymentMethod: "PayPal Invoice Link",
    paypalOrderId: "PAYID-MQ3Z1OP44102",
    paidAt: null,
    overdueDays: 8
  },
  {
    id: "INV-2026-092",
    client: "Vanguard Fintech Inc",
    clientEmail: "payable@vanguardfin.com",
    description: "Stripe to PayPal Multi-currency Migration",
    amount: 750.00,
    currency: "USD",
    issueDate: "2026-10-18",
    dueDate: "2026-11-01",
    status: "overdue",
    paymentMethod: "PayPal Invoice Link",
    paypalOrderId: "PAYID-MQ2K9LL19283",
    paidAt: null,
    overdueDays: 10
  },
  {
    id: "INV-2026-093",
    client: "Starlight Media Studio",
    clientEmail: "invoices@starlightmedia.co",
    description: "Video Processing Microservice Infrastructure",
    amount: 2070.00,
    currency: "USD",
    issueDate: "2026-11-09",
    dueDate: "2026-11-23",
    status: "pending",
    paymentMethod: "PayPal Smart Button",
    paypalOrderId: "PAYID-MQ7W2QQ99014",
    paidAt: null
  },
  {
    id: "INV-2026-094",
    client: "Zenith Health Tech",
    clientEmail: "ops@zenithhealth.org",
    description: "HIPAA Compliant Invoicing Automation",
    amount: 4500.00,
    currency: "USD",
    issueDate: "2026-11-01",
    dueDate: "2026-11-15",
    status: "paid",
    paymentMethod: "PayPal Checkout",
    paypalOrderId: "PAYID-MQ4L3DD77621",
    paidAt: "2026-11-05 09:15 UTC"
  }
];

export const DEMO_TRANSACTIONS = [
  {
    id: "TXN-788102",
    invoiceId: "INV-2026-089",
    client: "Acme Cybernetics Corp",
    type: "Payment Received",
    amount: 3400.00,
    fee: 98.60,
    net: 3301.40,
    currency: "USD",
    status: "Completed",
    date: "2026-11-08 14:22:10",
    gateway: "PayPal Sandbox",
    transactionId: "6YM92018895011"
  },
  {
    id: "TXN-788094",
    invoiceId: "INV-2026-094",
    client: "Zenith Health Tech",
    type: "Payment Received",
    amount: 4500.00,
    fee: 130.50,
    net: 4369.50,
    currency: "USD",
    status: "Completed",
    date: "2026-11-05 09:15:44",
    gateway: "PayPal Sandbox",
    transactionId: "4XL11029471023"
  },
  {
    id: "TXN-788081",
    invoiceId: "INV-2026-082",
    client: "Krypton Audio Labs",
    type: "Payment Received",
    amount: 1850.00,
    fee: 53.65,
    net: 1796.35,
    currency: "USD",
    status: "Completed",
    date: "2026-10-29 18:04:12",
    gateway: "PayPal Sandbox",
    transactionId: "9PQ88301140921"
  },
  {
    id: "TXN-788065",
    invoiceId: "INV-2026-077",
    client: "Solaria Robotics",
    type: "Dispute Hold (Resolved)",
    amount: 920.00,
    fee: 0.00,
    net: 920.00,
    currency: "USD",
    status: "Settled",
    date: "2026-10-24 11:30:00",
    gateway: "PayPal Sandbox",
    transactionId: "2AA33901192834"
  }
];

export const DEMO_AI_ACTIVITIES = [
  {
    id: "AI-ACT-1",
    timestamp: "10 mins ago",
    action: "Overdue Reminder Drafted",
    detail: "Generated courteous follow-up draft for Hyperion Digital ($1,200 overdue 8 days).",
    status: "Awaiting Approval",
    type: "reminder"
  },
  {
    id: "AI-ACT-2",
    timestamp: "1 hour ago",
    action: "Natural Language Invoice Extracted",
    detail: "Extracted invoice parameters from prompt: 'Bill Northwind 2,750 for ML pipeline'.",
    status: "Processed",
    type: "invoice"
  },
  {
    id: "AI-ACT-3",
    timestamp: "3 hours ago",
    action: "Payment Reconciliation",
    detail: "Matched incoming PayPal IPN webhook with INV-2026-089 for Acme Cybernetics.",
    status: "Reconciled",
    type: "reconciliation"
  },
  {
    id: "AI-ACT-4",
    timestamp: "Yesterday",
    action: "Cash Flow Risk Flagged",
    detail: "Identified Vanguard Fintech recurring 10-day delay trend. Recommended milestone billing.",
    status: "Insight",
    type: "risk"
  }
];

