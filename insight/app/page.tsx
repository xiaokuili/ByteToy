"use client";

import { useEffect, useState } from "react";
import { Message } from "ai";

import { generate } from "@/actions";
import { readStreamableValue } from "ai/rsc";
import { useChat } from '@ai-sdk/react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  const results = [...messages];
  if (data) {
    // Iterate through data array in reverse order
    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i] as {};

      if ('index' in item && typeof item.index === 'number') {
        // Replace content at the specified index
        if (results[item.index]) {
          results[item.index] = {
            ...results[item.index],
            content: 'begin table'
          };
        }
      }
    }
  }
  console.log(data);

  console.log(results);
  return (
    <div>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {results.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content === 'begin table' ? <TableExample /> : <div>{m.content}</div>}

          </div>
        ))}
        <form onSubmit={handleSubmit}>
          <input
            className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}



function TableExample() {

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV002</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>PayPal</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV003</TableCell>
              <TableCell>Unpaid</TableCell>
              <TableCell>Bank Transfer</TableCell>
              <TableCell className="text-right">$350.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
