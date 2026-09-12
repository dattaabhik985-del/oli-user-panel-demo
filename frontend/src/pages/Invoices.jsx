import React, { useState } from 'react';
import { useStore } from '../oli/store';
import { Card, Btn } from '../oli/ui';
import { InvoiceViewModal } from '../oli/modals';
import { invoiceDoc, receiptDoc } from '../oli/pdf';

const Th = ({ children }) => <th className="text-left text-[10px] font-semibold tracking-wider text-gray-400 px-4 py-3 whitespace-nowrap">{children}</th>;
const Td = ({ children, bold }) => <td className={`px-4 py-3 text-xs whitespace-nowrap ${bold ? 'font-medium text-gray-700' : 'text-gray-500'}`}>{children}</td>;
const PaidBadge = () => <span className="rounded-full bg-green-100 text-green-600 px-2 py-0.5 text-[10px] font-medium">Paid</span>;

export function InvoicesPage() {
  const { state } = useStore();
  const [view, setView] = useState(null);
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="invoices-page">
      <h1 className="text-xl font-bold text-gray-800">OLI Invoices</h1>
      <p className="text-xs text-gray-400 mt-0.5">All invoices for payments made to Online Legal India.</p>
      <Card className="mt-5 overflow-x-auto oli-scroll" data-testid="invoices-table-wrap">
        <table className="w-full min-w-[760px]" data-testid="invoices-table">
          <thead className="border-b border-gray-100">
            <tr><Th>INVOICE NO.</Th><Th>OLI ID</Th><Th>SERVICE</Th><Th>INVOICE DATE</Th><Th>AMOUNT</Th><Th>STATUS</Th><Th>ACTIONS</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {state.invoices.map(inv => (
              <tr key={inv.no} data-testid={`invoice-row-${inv.no}`}>
                <Td bold>{inv.no}</Td><Td>{inv.oliId}</Td><Td>{inv.service}</Td><Td>{inv.date}</Td><Td bold>₹{inv.amount}</Td>
                <Td><PaidBadge /></Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Btn color="blue" data-testid={`invoice-view-${inv.no}`} onClick={() => setView(inv)}>View</Btn>
                    <Btn color="blue" outline data-testid={`invoice-download-${inv.no}`} onClick={() => invoiceDoc(inv).save(`${inv.no.replaceAll('/', '-')}.pdf`)}>Download</Btn>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <InvoiceViewModal open={!!view} item={view} kind="invoice" onClose={() => setView(null)} />
    </div>
  );
}

export function ReceiptsPage() {
  const { state } = useStore();
  const [view, setView] = useState(null);
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" data-testid="receipts-page">
      <h1 className="text-xl font-bold text-gray-800">Govt Receipt</h1>
      <p className="text-xs text-gray-400 mt-0.5">Government fees paid by you through/via Online Legal India. These are separate from OLI invoices.</p>
      <Card className="mt-5 overflow-x-auto oli-scroll" data-testid="receipts-table-wrap">
        <table className="w-full min-w-[720px]" data-testid="receipts-table">
          <thead className="border-b border-gray-100">
            <tr><Th>SERVICE</Th><Th>OLI ID</Th><Th>GOVT FEE</Th><Th>DATE</Th><Th>STATUS</Th><Th>ACTIONS</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {state.receipts.map(r => (
              <tr key={r.ref} data-testid={`receipt-row-${r.ref}`}>
                <Td bold>{r.service}</Td><Td>{r.oliId}</Td><Td bold>₹{r.fee}</Td><Td>{r.date}</Td>
                <Td><PaidBadge /></Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Btn color="blue" data-testid={`receipt-view-${r.ref}`} onClick={() => setView(r)}>View</Btn>
                    <Btn color="blue" outline data-testid={`receipt-download-${r.ref}`} onClick={() => receiptDoc(r).save(`${r.ref}.pdf`)}>Download</Btn>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <InvoiceViewModal open={!!view} item={view} kind="receipt" onClose={() => setView(null)} />
    </div>
  );
}
